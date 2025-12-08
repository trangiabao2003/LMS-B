import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { 
  createOrder, 
  getAllOrders, 
  newPayment, 
  sendStripePublishableKey,
  checkCoursePurchased 
} from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated, createOrder);

orderRouter.get(
  "/get-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment", isAuthenticated, newPayment);

// New endpoint to check if course is purchased
orderRouter.get(
  "/check-purchased/:courseId",
  updateAccessToken,
  isAuthenticated,
  checkCoursePurchased
);

export default orderRouter;