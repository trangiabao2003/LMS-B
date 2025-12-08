import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//create order
export const createOrder = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      // Validate payment info
      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            return next(new ErrorHandler("Payment not authorized!", 400));
          }

          // Check if this PaymentIntent has already been used for an order
          const existingOrderWithPayment = await OrderModel.findOne({
            "payment_info.id": paymentIntentId,
          });

          if (existingOrderWithPayment) {
            return next(
              new ErrorHandler(
                "This payment has already been processed. Please refresh the page.",
                400
              )
            );
          }
        }
      }

      const user = await userModel.findById(req.user?._id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if order already exists - this is the source of truth
      const existingOrder = await OrderModel.findOne({
        courseId,
        userId: user._id.toString(),
      });

      if (existingOrder) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Prepare order data
      const orderData: any = {
        courseId: course._id.toString(),
        userId: user._id.toString(),
        payment_info,
      };

      // CRITICAL: Create order FIRST before updating user
      let order;
      try {
        order = await newOrder(orderData);
      } catch (error: any) {
        console.error("Failed to create order:", error.message);
        return next(
          new ErrorHandler("Failed to create order. Please contact support.", 500)
        );
      }

      // Only update user and course after order is successfully created
      try {
        // Add course to user's courses (only if not already there)
        const courseAlreadyInUser = user.courses.some(
          (c: any) => c._id.toString() === course._id.toString()
        );

        if (!courseAlreadyInUser) {
          user.courses.push(course._id);
        }

        await user.save();

        // Update Redis with the new user data
        await redis.set(
          user._id.toString(),
          JSON.stringify(user),
          "EX",
          604800
        );

        // Update purchased count (use updateOne to avoid validation errors on old courses)
        await CourseModel.updateOne(
          { _id: course._id },
          { $inc: { purchased: 1 } }
        );

        // Create notification
        await NotificationModel.create({
          user: user._id,
          title: "New Order",
          message: `You have a new order from ${course.name}`,
        });

        // Send confirmation email (non-blocking)
        const mailData = {
          order: {
            _id: order._id.toString().slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
        };

        sendMail({
          email: user.email,
          subject: "Order confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        }).catch((error: any) => {
          console.error("Email error:", error.message);
        });

        // Return success response
        res.status(201).json({
          success: true,
          order,
        });
      } catch (error: any) {
        // If user/course update fails, we should ideally rollback the order
        // For now, log the error - the order exists but user doesn't have access
        console.error("Failed to update user/course after order creation:", error.message);
        return next(
          new ErrorHandler(
            "Order created but failed to grant access. Please contact support.",
            500
          )
        );
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//get all orders -- only for admin
export const getAllOrders = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const checkCoursePurchased = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      const order = await OrderModel.findOne({
        courseId,
        userId: userId.toString(),
      });

      res.status(200).json({
        success: true,
        isPurchased: !!order,
        order: order || null,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// send stripe publishble key
export const sendStripePublishableKey = CatchAsyncErrors(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY, // Lowercase 'key'
    });
  }
);

// order.controller.ts
export const newPayment = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount } = req.body;

      // Validate amount
      if (!amount || amount <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Đảm bảo là số nguyên
        currency: "USD",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      console.error("Stripe Payment Error:", error); // Thêm log
      return next(new ErrorHandler(error.message, 500));
    }
  }
);