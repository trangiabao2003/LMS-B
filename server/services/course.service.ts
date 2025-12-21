import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import axios from "axios";
require("dotenv").config();

//create course
export const createCourse = CatchAsyncErrors(
	async (data: any, res: Response) => {
		const course = await CourseModel.create(data);
        
        // Trigger AI Indexing
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
        axios.post(`${AI_SERVICE_URL}/api/v1/courses/index`, {
            course_id: course._id,
            name: course.name,
            description: course.description,
            category: course.categories || "General",
            content: JSON.stringify(course.courseData || []) 
        }).catch(err => console.error("AI Indexing Error:", err.message));

		res.status(201).json({
			success: true,
			course,
		});
	}
);

//get all courses
export const getAllCoursesService = async (res: Response) => {
	const courses = await CourseModel.find().sort({ createdAt: -1 });

	res.status(201).json({
		success: true,
		courses,
	});
};
