"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPayment = exports.sendStripePublishableKey = exports.checkCoursePurchased = exports.getAllOrders = exports.createOrder = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const order_model_1 = __importDefault(require("../models/order.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body;
        // Validate payment info
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler_1.default("Payment not authorized!", 400));
                }
                // Check if this PaymentIntent has already been used for an order
                const existingOrderWithPayment = await order_model_1.default.findOne({
                    "payment_info.id": paymentIntentId,
                });
                if (existingOrderWithPayment) {
                    return next(new ErrorHandler_1.default("This payment has already been processed. Please refresh the page.", 400));
                }
            }
        }
        const user = await user_model_1.default.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        // Check if order already exists - this is the source of truth
        const existingOrder = await order_model_1.default.findOne({
            courseId,
            userId: user._id.toString(),
        });
        if (existingOrder) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Prepare order data
        const orderData = {
            courseId: course._id.toString(),
            userId: user._id.toString(),
            payment_info,
        };
        // CRITICAL: Create order FIRST before updating user
        let order;
        try {
            order = await (0, order_service_1.newOrder)(orderData);
        }
        catch (error) {
            console.error("Failed to create order:", error.message);
            return next(new ErrorHandler_1.default("Failed to create order. Please contact support.", 500));
        }
        // Only update user and course after order is successfully created
        try {
            // Add course to user's courses (only if not already there)
            const courseAlreadyInUser = user.courses.some((c) => c._id.toString() === course._id.toString());
            if (!courseAlreadyInUser) {
                user.courses.push(course._id);
            }
            await user.save();
            // Update Redis with the new user data
            await redis_1.redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800);
            // Update purchased count (use updateOne to avoid validation errors on old courses)
            await course_model_1.default.updateOne({ _id: course._id }, { $inc: { purchased: 1 } });
            // Create notification
            await notification_model_1.default.create({
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
            (0, sendMail_1.default)({
                email: user.email,
                subject: "Order confirmation",
                template: "order-confirmation.ejs",
                data: mailData,
            }).catch((error) => {
                console.error("Email error:", error.message);
            });
            // Return success response
            res.status(201).json({
                success: true,
                order,
            });
        }
        catch (error) {
            // If user/course update fails, we should ideally rollback the order
            // For now, log the error - the order exists but user doesn't have access
            console.error("Failed to update user/course after order creation:", error.message);
            return next(new ErrorHandler_1.default("Order created but failed to grant access. Please contact support.", 500));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all orders -- only for admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.checkCoursePurchased = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        const order = await order_model_1.default.findOne({
            courseId,
            userId: userId.toString(),
        });
        res.status(200).json({
            success: true,
            isPurchased: !!order,
            order: order || null,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// send stripe publishble key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY, // Lowercase 'key'
    });
});
// order.controller.ts
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { amount } = req.body;
        // Validate amount
        if (!amount || amount <= 0) {
            return next(new ErrorHandler_1.default("Invalid amount", 400));
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
    }
    catch (error) {
        console.error("Stripe Payment Error:", error); // Thêm log
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
