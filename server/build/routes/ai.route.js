"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../utils/redis");
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const chatHistory_model_1 = __importDefault(require("../models/chatHistory.model"));
const aiRouter = express_1.default.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
// Test AI route
aiRouter.get("/test", (req, res) => {
    res.status(200).json({ success: true, message: "AI Router is working" });
});
// Chat with AI
aiRouter.post("/chat", auth_1.isAuthenticated, (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res) => {
    const { question, courseId } = req.body;
    const userId = req.user?._id?.toString();
    if (!question || !userId) {
        return res.status(400).json({
            success: false,
            message: "Question and user ID required",
        });
    }
    try {
        // Check cache
        const cacheKey = `chat:${userId}:${question.substring(0, 50)}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cached),
                cached: true,
            });
        }
        // Call Python AI Service
        const response = await axios_1.default.post(`${AI_SERVICE_URL}/api/v1/chat/ask`, {
            question,
            course_id: courseId || null,
            user_id: userId,
        }, { timeout: 120000 } // Increase timeout to 120s for slow AI responses
        );
        // Cache result for 1 hour
        await redis_1.redis.setex(cacheKey, 3600, JSON.stringify(response.data));
        // Save chat to MongoDB
        try {
            const sessionId = `session_${userId}_${Date.now()}`;
            // Find or create chat session
            let chatHistory = await chatHistory_model_1.default.findOne({
                userId,
                sessionId,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
            });
            if (!chatHistory) {
                chatHistory = new chatHistory_model_1.default({
                    userId,
                    sessionId,
                    courseId,
                    messages: []
                });
            }
            // Add user message and AI response
            chatHistory.messages.push({
                role: "user",
                content: question,
                timestamp: new Date()
            }, {
                role: "assistant",
                content: response.data.answer,
                sources: response.data.sources,
                timestamp: new Date()
            });
            await chatHistory.save();
        }
        catch (historyError) {
            console.error("Failed to save chat history:", historyError.message);
            // Continue even if history save fails
        }
        return res.status(200).json({
            success: true,
            data: response.data,
            cached: false,
        });
    }
    catch (error) {
        console.error("AI Chat Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "AI service error",
        });
    }
}));
// Get chat history
aiRouter.get("/history", auth_1.isAuthenticated, (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res) => {
    const userId = req.user?._id?.toString();
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID required",
        });
    }
    try {
        // Fetch last 10 chat sessions
        const chatHistories = await chatHistory_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("-__v")
            .lean();
        return res.status(200).json({
            success: true,
            data: chatHistories,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}));
// Index course to AI
aiRouter.post("/index-course", auth_1.isAuthenticated, (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res) => {
    const { courseId, name, description, content, category } = req.body;
    if (!courseId || !name) {
        return res.status(400).json({
            success: false,
            message: "Course ID and name required",
        });
    }
    try {
        const response = await axios_1.default.post(`${AI_SERVICE_URL}/api/v1/courses/index`, {
            course_id: courseId,
            name,
            description,
            content,
            category,
        });
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    }
    catch (error) {
        console.error("Course Indexing Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Indexing failed",
        });
    }
}));
// Reindex course
aiRouter.post("/reindex-course/:courseId", auth_1.isAuthenticated, (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res) => {
    const { courseId } = req.params;
    const { name, description, content, category } = req.body;
    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: "Course ID required",
        });
    }
    try {
        const response = await axios_1.default.post(`${AI_SERVICE_URL}/api/v1/courses/reindex/${courseId}`, {
            course_id: courseId,
            name,
            description,
            content,
            category,
        });
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    }
    catch (error) {
        console.error("Course Reindexing Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Reindexing failed",
        });
    }
}));
// Health check
aiRouter.get("/health", (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res) => {
    try {
        const response = await axios_1.default.get(`${AI_SERVICE_URL}/api/v1/health/`, {
            timeout: 5000,
        });
        return res.status(200).json({
            success: true,
            data: response.data,
        });
    }
    catch (error) {
        return res.status(503).json({
            success: false,
            message: "AI service unavailable",
        });
    }
}));
aiRouter.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI route is working!",
        timestamp: new Date().toISOString(),
        endpoints: {
            chat: "POST /api/v1/ai/chat",
            history: "GET /api/v1/ai/history",
            health: "GET /api/v1/ai/health",
        },
    });
});
exports.default = aiRouter;
