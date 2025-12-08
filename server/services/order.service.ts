import { NextFunction, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import OrderModel from "../models/order.model";

//create new order
export const newOrder = async (data: any) => {
	try {
		const order = await OrderModel.create(data);
		console.log("Order created successfully:", order._id);
		return order;
	} catch (error: any) {
		console.error("Order creation failed:", error.message);
		throw new Error(`Failed to create order: ${error.message}`);
	}
};

//get all orders
export const getAllOrdersService = async (res: Response) => {
	const orders = await OrderModel.find().sort({ createdAt: -1 });

	res.status(201).json({
		success: true,
		orders,
	});
};
