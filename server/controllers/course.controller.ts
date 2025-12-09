import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";
import OrderModel from "../models/order.model";

//upload course
export const uploadCourse = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
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
					return next(new ErrorHandler(`${field} is required`, 400));
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
				const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
					folder: "courses",
				});
				data.thumbnail = {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				};
			}
			createCourse(data, res, next);
		} catch (error: any) {
			return next(new ErrorHandler("Course upload failed", 500));
		}
	}
);

//edit course
export const editCourse = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = req.body;
			const courseId = req.params.id;

			// Find the existing course
			const course = await CourseModel.findById(courseId);
			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			// Handle thumbnail update
			const thumbnail = data.thumbnail;
			if (
				thumbnail &&
				typeof thumbnail === "string" &&
				!thumbnail.startsWith("https://res.cloudinary.com")
			) {
				// If thumbnail is a new base64 image (not a Cloudinary URL)

				// Delete old thumbnail from Cloudinary if it exists
				if (course.thumbnail && (course.thumbnail as any).public_id) {
					await cloudinary.v2.uploader.destroy(
						(course.thumbnail as any).public_id
					);
				}

				// Upload new thumbnail
				const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
					folder: "courses",
				});

				data.thumbnail = {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				};
			} else if (
				!thumbnail ||
				(typeof thumbnail === "string" &&
					thumbnail.startsWith("https://res.cloudinary.com"))
			) {
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
			const updatedCourse = await CourseModel.findByIdAndUpdate(
				courseId,
				{ $set: data },
				{ new: true }
			);

			// Clear Redis cache
			await redis.del(courseId);

			res.status(200).json({
				success: true,
				course: updatedCourse,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

//get single course -- without purchasing
export const getSingleCourse = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const courseId = req.params.id;
			const isCacheExist = await redis.get(courseId);

			if (isCacheExist) {
				const course = JSON.parse(isCacheExist);
				res.status(200).json({
					success: true,
					course,
				});
			} else {
				const course = await CourseModel.findById(req.params.id)
					.select(
						"-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
					)
					.lean();

				if (!course) {
					return next(new ErrorHandler("Course not found", 404));
				}

				await redis.set(courseId, JSON.stringify(course), "EX", 604800);
				res.status(200).json({
					success: true,
					course,
				});
			}
		} catch (error: any) {
			return next(new ErrorHandler("Failed to fetch course", 500));
		}
	}
);

//get all courses -- without purchasing
export const getAllCourses = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const courses = await CourseModel.find().select(
				"-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
			);

			res.status(200).json({
				success: true,
				courses,
			});
		} catch (error: any) {
			return next(new ErrorHandler("Failed to fetch course", 500));
		}
	}
);

//get course content -- only for valid user
export const getCourseByUser = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const courseId = req.params.id;
			const userId = req.user?._id;

			// Check if user purchased the course via orders collection
			const orderExists = await OrderModel.findOne({
				courseId,
				userId: userId.toString(),
			});

			if (!orderExists) {
				// Fallback: check user.courses array
				const userCourseList = req.user?.courses;
				const courseExists = userCourseList?.find(
					(course: any) => course._id.toString() === courseId
				);

				if (!courseExists) {
					return next(
						new ErrorHandler("You have not purchased this course", 404)
					);
				}
			}

			const course = await CourseModel.findById(courseId);
			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			const content = course.courseData;
			res.status(200).json({
				success: true,
				content,
			});
		} catch (error: any) {
			return next(new ErrorHandler("Failed to fetch course content", 500));
		}
	}
);

//add question in course
interface IAddQuestionData {
	question: string;
	courseId: string;
	contentId: string;
}

export const addQuestion = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { question, courseId, contentId }: IAddQuestionData = req.body;
			const course = await CourseModel.findById(courseId);

			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			if (!mongoose.Types.ObjectId.isValid(contentId)) {
				return next(new ErrorHandler("Invalid content ID", 400));
			}

			const courseContent = course.courseData?.find((item: any) =>
				item._id.equals(contentId)
			);

			if (!courseContent) {
				return next(new ErrorHandler("Content not found", 404));
			}

			//create a new question object
			const newQuestion: any = {
				user: req.user,
				question,
				questionReplies: [],
			};

			//add this question to our course content
			courseContent.questions.push(newQuestion);

			await NotificationModel.create({
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
		} catch (error: any) {
			return next(new ErrorHandler("Failed to add question", 500));
		}
	}
);

//add answer in course question
interface IAddAnswerData {
	answer: string;
	courseId: string;
	contentId: string;
	questionId: string;
}

export const addAnswer = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { answer, courseId, contentId, questionId }: IAddAnswerData =
				req.body;
			const course = await CourseModel.findById(courseId);

			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			if (!mongoose.Types.ObjectId.isValid(contentId)) {
				return next(new ErrorHandler("Invalid content ID", 400));
			}

			const courseContent = course.courseData?.find((item: any) =>
				item._id.equals(contentId)
			);

			if (!courseContent) {
				return next(new ErrorHandler("Content not found", 404));
			}

			const question = courseContent.questions?.find((item: any) =>
				item._id.equals(questionId)
			);

			if (!question) {
				return next(new ErrorHandler("Invalid question id", 400));
			}

			//create a new answer object
			const newAnswer: any = {
				user: req.user,
				answer,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			//add this answer to our course content
			question.questionReplies?.push(newAnswer);

			await course.save();

			await redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days

			if (req.user?._id === question.user._id) {
				//create a notification
				await NotificationModel.create({
					user: req.user?._id,
					title: "New question reply received",
					message: `You have a new question reply in ${courseContent.title}`,
				});
			} else {
				const data = {
					name: question.user.name,
					title: courseContent.title,
				};

				const html = await ejs.renderFile(
					path.join(__dirname, "../mails/question-reply.ejs"),
					data
				);

				try {
					await sendMail({
						email: question.user.email,
						subject: "Question Reply",
						template: "question-reply.ejs",
						data,
					});
				} catch (error: any) {
					return next(new ErrorHandler(error.message, 500));
				}
			}

			res.status(200).json({
				success: true,
				course,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

//add review in course
interface IAddReviewData {
	review: string;
	rating: number;
	userId: string;
}

export const addReview = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userCourseList = req.user?.courses;
			const courseId = req.params.id;

			//check if courseId already exists in userCourseList based on _id
			const courseExists = userCourseList?.some(
				(course: any) => course._id.toString() === courseId.toString()
			);

			if (!courseExists) {
				return next(
					new ErrorHandler("You are not eligible to access this course", 404)
				);
			}

			const course = await CourseModel.findById(courseId);

			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			const { review, rating } = req.body as IAddReviewData;

			const reviewData: any = {
				user: req.user,
				rating,
				comment: review,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			course.reviews.push(reviewData);

			let avg = 0;
			course.reviews.forEach((rev: any) => {
				avg += rev.rating;
			});

			// Calculate average rating
			course.rating = avg / course.reviews.length;

			await course.save();

			// Clear Redis cache after adding review
			await redis.del(courseId);

			// Create notification
			await NotificationModel.create({
				user: req.user?._id,
				title: "New review received",
				message: `${req.user?.name} has given a review in ${course.name}`,
			});

			res.status(200).json({
				success: true,
				course,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

//add reply in review
interface IAddReplyReviewData {
	comment: string;
	courseId: string;
	reviewId: string;
}

export const addReplyToReview = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { comment, courseId, reviewId } = req.body as IAddReplyReviewData;
			const course = await CourseModel.findById(courseId);

			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			const review = course.reviews.find(
				(rev: any) => rev._id.toString() === reviewId
			);

			if (!review) {
				return next(new ErrorHandler("Review not found", 404));
			}

			const replyData: any = {
				user: req.user,
				comment,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			if (!review.commentReplies) {
				review.commentReplies = [];
			}

			review.commentReplies.push(replyData);

			await redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days

			await course.save();

			// Clear Redis cache after adding reply
			await redis.del(courseId);

			res.status(200).json({
				success: true,
				course,
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 500));
		}
	}
);

//get all courses -- only for admin
export const getAdminAllCourses = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			getAllCoursesService(res);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

//delete course -- only for admin
export const deleteCourse = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const course = await CourseModel.findById(id);
			if (!course) {
				return next(new ErrorHandler("Course not found", 404));
			}

			await course.deleteOne({ id });
			await redis.del(id);
			res.status(200).json({
				success: true,
				message: "Course deleted successfully",
			});
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// generate video url
export const generateVideoUrl = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { videoId } = req.body;
			const response = await axios.post(
				`https://dev.vdocipher.com/api/videos/${videoId}/otp`,
				{ ttl: 300 },
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
					},
				}
			);
			res.json(response.data);
		} catch (error: any) {
			return next(new ErrorHandler(error.message, 400));
		}
	}
);

// get user's enrolled courses with full details
export const getEnrolledCourses = CatchAsyncErrors(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?._id;

			if (!userId) {
				return next(new ErrorHandler("User not authenticated", 401));
			}

			// Get user's course IDs - handle both formats
			// Format 1: courses array contains ObjectIds directly
			// Format 2: courses array contains {courseId: string} objects
			const userCourses = req.user?.courses || [];

			const userCourseIds = userCourses.map((course: any) => {
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
			const courses = await CourseModel.find({
				_id: { $in: userCourseIds },
			}).select(
				"-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
			);

			console.log("Found courses:", courses.length);

			res.status(200).json({
				success: true,
				courses,
			});
		} catch (error: any) {
			console.error("Error in getEnrolledCourses:", error);
			return next(new ErrorHandler("Failed to fetch enrolled courses", 500));
		}
	}
);
