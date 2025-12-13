"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = require("./middleware/error");
const user_route_1 = __importDefault(require("./routes/user.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const layout_route_1 = __importDefault(require("./routes/layout.route"));
exports.app = (0, express_1.default)();
// BẮT BUỘC KHI DEPLOY - FIX LỖI COOKIE SECURE
exports.app.set("trust proxy", 1);
// Body parser
exports.app.use(express_1.default.json({ limit: "50mb" }));
// Cookie parser
exports.app.use((0, cookie_parser_1.default)());
// CORS - SỬA CHUẨN
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowed = [
            "https://lms-b-client.vercel.app",
            process.env.CLIENT_URL,
            // cho dev local
            "http://localhost:3000",
            "http://localhost:3001",
        ].filter(Boolean);
        if (!origin ||
            allowed.some((allowedOrigin) => origin.includes(allowedOrigin))) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// XỬ LÝ PREFLIGHT
exports.app.options("*", (0, cors_1.default)());
// Routes
exports.app.use("/api/v1", user_route_1.default, course_route_1.default, order_route_1.default, notification_route_1.default, analytics_route_1.default, layout_route_1.default);
// Test API
exports.app.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working perfectly on production!",
    });
});
// Unknown route
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});
// Error Middleware
exports.app.use(error_1.ErrorMiddleware);
