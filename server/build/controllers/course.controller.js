"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnrolledCourses = exports.generateVideoUrl = exports.deleteCourse = exports.getAdminAllCourses = exports.addReplyToReview = exports.addReview = exports.addAnswer = exports.addQuestion = exports.getCourseByUser = exports.getAllCourses = exports.getSingleCourse = exports.editCourse = exports.uploadCourse = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const course_service_1 = require("../services/course.service");
const course_model_1 = __importDefault(require("../models/course.model"));
const redis_1 = require("../utils/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const axios_1 = __importDefault(require("axios"));
const order_model_1 = __importDefault(require("../models/order.model"));
//upload course
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const data = req.body;
        // Validate required fields
        const requiredFields = [
            "name",
            "description",
            "price",
            "estimatedPrice",
            "tags",
            "level",
            "demoUrl",
        ];
        for (const field of requiredFields) {
            if (!data[field]) {
                return next(new ErrorHandler_1.default(`${field} is required`, 400));
            }
        }
        // Convert price fields to number if they're strings
        if (typeof data.price === "string") {
            data.price = Number(data.price);
        }
        if (typeof data.estimatedPrice === "string") {
            data.estimatedPrice = Number(data.estimatedPrice);
        }
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        (0, course_service_1.createCourse)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Course upload failed", 500));
    }
});
//edit course
exports.editCourse = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const data = req.body;
        const courseId = req.params.id;
        // Find the existing course
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Handle thumbnail update
        const thumbnail = data.thumbnail;
        if (thumbnail &&
            typeof thumbnail === "string" &&
            !thumbnail.startsWith("https://res.cloudinary.com")) {
            // If thumbnail is a new base64 image (not a Cloudinary URL)
            // Delete old thumbnail from Cloudinary if it exists
            if (course.thumbnail && course.thumbnail.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(course.thumbnail.public_id);
            }
            // Upload new thumbnail
            const myCloud = await cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        else if (!thumbnail ||
            (typeof thumbnail === "string" &&
                thumbnail.startsWith("https://res.cloudinary.com"))) {
            // Keep the existing thumbnail (it's already a Cloudinary URL or undefined)
            data.thumbnail = course.thumbnail;
        }
        // Convert price fields to number if they're strings
        if (typeof data.price === "string") {
            data.price = Number(data.price);
        }
        if (typeof data.estimatedPrice === "string") {
            data.estimatedPrice = Number(data.estimatedPrice);
        }
        // Update the course
        const updatedCourse = await course_model_1.default.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        // Clear Redis cache
        await redis_1.redis.del(courseId);
        res.status(200).json({
            success: true,
            course: updatedCourse,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get single course -- without purchasing
exports.getSingleCourse = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis_1.redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            res.status(200).json({
                success: true,
                course,
            });
        }
        else {
            const course = await course_model_1.default.findById(req.params.id)
                .select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
                .lean();
            if (!course) {
                return next(new ErrorHandler_1.default("Course not found", 404));
            }
            await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800);
            res.status(200).json({
                success: true,
                course,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Failed to fetch course", 500));
    }
});
//get all courses -- without purchasing
exports.getAllCourses = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const courses = await course_model_1.default.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Failed to fetch course", 500));
    }
});
//get course content -- only for valid user
exports.getCourseByUser = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userId = req.user?._id;
        // Check if user purchased the course via orders collection
        const orderExists = await order_model_1.default.findOne({
            courseId,
            userId: userId.toString(),
        });
        if (!orderExists) {
            // Fallback: check user.courses array
            const userCourseList = req.user?.courses;
            const courseExists = userCourseList?.find((course) => course._id.toString() === courseId);
            if (!courseExists) {
                return next(new ErrorHandler_1.default("You have not purchased this course", 404));
            }
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const content = course.courseData;
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Failed to fetch course content", 500));
    }
});
exports.addQuestion = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content ID", 400));
        }
        const courseContent = course.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        //create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        //add this question to our course content
        courseContent.questions.push(newQuestion);
        await notification_model_1.default.create({
            user: req.user?._id,
            title: "New question received",
            message: `You have a new question in ${courseContent.title}`,
        });
        //save the updated course
        await course.save();
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Failed to add question", 500));
    }
});
exports.addAnswer = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler_1.default("Invalid content ID", 400));
        }
        const courseContent = course.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler_1.default("Content not found", 404));
        }
        const question = courseContent.questions?.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler_1.default("Invalid question id", 400));
        }
        //create a new answer object
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        //add this answer to our course content
        question.questionReplies?.push(newAnswer);
        await course.save();
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days
        if (req.user?._id === question.user._id) {
            //create a notification
            await notification_model_1.default.create({
                user: req.user?._id,
                title: "New question reply received",
                message: `You have a new question reply in ${courseContent.title}`,
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/question-reply.ejs"), data);
            try {
                await (0, sendMail_1.default)({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler_1.default(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReview = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        //check if courseId already exists in userCourseList based on _id
        const courseExists = userCourseList?.some((course) => course._id.toString() === courseId.toString());
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            rating,
            comment: review,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        course.reviews.push(reviewData);
        let avg = 0;
        course.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        // Calculate average rating
        course.rating = avg / course.reviews.length;
        await course.save();
        // Clear Redis cache after adding review
        await redis_1.redis.del(courseId);
        // Create notification
        await notification_model_1.default.create({
            user: req.user?._id,
            title: "New review received",
            message: `${req.user?.name} has given a review in ${course.name}`,
        });
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addReplyToReview = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const review = course.reviews.find((rev) => rev._id.toString() === reviewId);
        if (!review) {
            return next(new ErrorHandler_1.default("Review not found", 404));
        }
        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies.push(replyData);
        await redis_1.redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days
        await course.save();
        // Clear Redis cache after adding reply
        await redis_1.redis.del(courseId);
        res.status(200).json({
            success: true,
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//get all courses -- only for admin
exports.getAdminAllCourses = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        (0, course_service_1.getAllCoursesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//delete course -- only for admin
exports.deleteCourse = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await course_model_1.default.findById(id);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        await course.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// generate video url
exports.generateVideoUrl = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios_1.default.post(`https://dev.vdocipher.com/api/videos/${videoId}/otp`, { ttl: 300 }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get user's enrolled courses with full details
exports.getEnrolledCourses = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return next(new ErrorHandler_1.default("User not authenticated", 401));
        }
        // Get user's course IDs - handle both formats
        // Format 1: courses array contains ObjectIds directly
        // Format 2: courses array contains {courseId: string} objects
        const userCourses = req.user?.courses || [];
        const userCourseIds = userCourses.map((course) => {
            // If it's an object with courseId property
            if (course.courseId) {
                return course.courseId;
            }
            // If it's an ObjectId or string directly
            return course._id || course;
        });
        console.log("User courses:", userCourses);
        console.log("Extracted course IDs:", userCourseIds);
        if (userCourseIds.length === 0) {
            return res.status(200).json({
                success: true,
                courses: [],
            });
        }
        // Fetch full course details for enrolled courses
        const courses = await course_model_1.default.find({
            _id: { $in: userCourseIds },
        }).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        console.log("Found courses:", courses.length);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        console.error("Error in getEnrolledCourses:", error);
        return next(new ErrorHandler_1.default("Failed to fetch enrolled courses", 500));
    }
});
