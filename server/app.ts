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
// import { rateLimit } from "express-rate-limit";
export const app = express();

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(
	cors({
		origin: [
			"https://lms-b-client.vercel.app",
			process.env.CLIENT_URL || "https://lms-b-client.vercel.app",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
		allowedHeaders: ["Content-Type", "Authorization"],
		optionsSuccessStatus: 200,
	})
);

//api requests limit
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
// 	// store: ... , // Redis, Memcached, etc. See below.
// });

//routes
app.use(
	"/api/v1",
	userRouter,
	courseRouter,
	orderRouter,
	notificationRouter,
	analyticsRouter,
	layoutRouter
);

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		success: true,
		message: "API is working fine",
	});
});

//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
	const err = new Error(`Route ${req.originalUrl} not found`) as any;
	err.statusCode = 404;
	next(err);
});

//Middlewares calls
// app.use(limiter);
app.use(ErrorMiddleware);
