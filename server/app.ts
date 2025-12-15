require("dotenv").config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import aiRouter from "./routes/ai.route";

export const app = express();

// BẮT BUỘC KHI DEPLOY - FIX LỖI COOKIE SECURE
app.set("trust proxy", 1);

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

app.use(
	cors({
		origin: (origin, callback) => {
			const allowed = [
				"https://lms-b-client.vercel.app",
				process.env.CLIENT_URL,
				"http://localhost:3000",
				"http://localhost:3001",
			].filter(Boolean);

			if (
				!origin ||
				allowed.some((allowedOrigin) =>
					origin.includes(allowedOrigin as string)
				)
			) {
				callback(null, true);
			} else {
				callback(new Error("CORS not allowed"));
			}
		},
		credentials: true,
		methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// XỬ LÝ PREFLIGHT
app.options("*", cors());

// Routes
app.use(
	"/api/v1",
	aiRouter,
	userRouter,
	courseRouter,
	orderRouter,
	notificationRouter,
	analyticsRouter,
	layoutRouter
);

// Test API
app.get("/test", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "API is working perfectly on production!",
	});
});

// Unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

// Error Middleware
app.use(ErrorMiddleware);
