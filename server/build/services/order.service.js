"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
//create new order
const newOrder = async (data) => {
    try {
        const order = await order_model_1.default.create(data);
        console.log("Order created successfully:", order._id);
        return order;
    }
    catch (error) {
        console.error("Order creation failed:", error.message);
        throw new Error(`Failed to create order: ${error.message}`);
    }
};
exports.newOrder = newOrder;
//get all orders
const getAllOrdersService = async (res) => {
    const orders = await order_model_1.default.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders,
    });
};
exports.getAllOrdersService = getAllOrdersService;
