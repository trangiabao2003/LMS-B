"use client"

import React, { useEffect, useState } from 'react'
import CourseOptions from './course-options'
import CourseInformation from './course-information'
import CourseData from './course-data'
import CourseContentData from './course-content-data'
import CoursePreview from './course-preview'
import { useEditCourseMutation, useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type Props = {
    id: string;
}

const EditCourse = ({ id }: Props) => {
    const router = useRouter();
    const [editCourse, { isLoading: isUpdating, isSuccess, error }] = useEditCourseMutation();
    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

    const editCourseData = data?.courses?.find((i: any) => i._id === id);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Course updated successfully");
            router.push("/admin/courses");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error, router]);

    useEffect(() => {
        if (editCourseData) {
            setCourseInfo({
                name: editCourseData.name,
                description: editCourseData.description,
                price: editCourseData.price,
                estimatedPrice: editCourseData.estimatedPrice,
                tags: editCourseData.tags,
                categories: editCourseData.categories,
                level: editCourseData.level,
                demoUrl: editCourseData.demoUrl,
                thumbnail: editCourseData?.thumbnail?.url,
            })
            setBenefits(editCourseData.benefits);
            setPrerequisites(editCourseData.prerequisites);
            setCourseContentData(editCourseData.courseData);
        }
    }, [editCourseData]);

    const [active, setActive] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        categories: "",
        level: "",
        demoUrl: "",
        thumbnail: "",
    });
    const [benefits, setBenefits] = useState([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
    const [courseContentData, setCourseContentData] = useState([
        {
            videoUrl: "",
            title: "",
            description: "",
            videoSection: "Untitled Section",
            videoLength: "",
            links: [
                {
                    title: "",
                    url: "",
                },
            ],
            suggestion: "",
        },
    ]);

    const [courseData, setCourseData] = useState({});

    const handleSubmit = async () => {
        // Format benefits array
        const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));

        // Format prerequisites array
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));

        // Format course content array
        const formattedCourseContentData = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoLength: Number(courseContent.videoLength) || 0,
            videoSection: courseContent.videoSection,
            links: courseContent.links.map((link) => ({
                title: link.title,
                url: link.url,
            })),
            suggestion: courseContent.suggestion,
        }));

        // prepare our data object with proper type conversion
        const data = {
            name: courseInfo.name,
            description: courseInfo.description,
            price: courseInfo.price,
            estimatedPrice: courseInfo.estimatedPrice,
            tags: courseInfo.tags,
            categories: courseInfo.categories,
            thumbnail: courseInfo.thumbnail,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            totalVideos: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData,
        }
        setCourseData(data)
    }

    const handleCourseUpdate = async (e: any) => {
        if (!isUpdating) {
            await editCourse({ id, data: courseData });
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading course data...</p>
            </div>
        );
    }

    if (!editCourseData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">Course not found!</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Main Form - Left Side (3 columns) */}
                <div className="lg:col-span-3">
                    {
                        active === 0 && (
                            <CourseInformation
                                courseInfo={courseInfo}
                                setCourseInfo={setCourseInfo}
                                active={active}
                                setActive={setActive}
                            />
                        )
                    }

                    {
                        active === 1 && (
                            <CourseData
                                benefits={benefits}
                                setBenefits={setBenefits}
                                prerequisites={prerequisites}
                                setPrerequisites={setPrerequisites}
                                active={active}
                                setActive={setActive}
                            />
                        )
                    }

                    {
                        active === 2 && (
                            <CourseContentData
                                active={active}
                                setActive={setActive}
                                courseContentData={courseContentData}
                                setCourseContentData={setCourseContentData}
                                handleSubmit={handleSubmit}
                            />
                        )
                    }

                    {
                        active === 3 && (
                            <CoursePreview
                                active={active}
                                setActive={setActive}
                                courseData={courseData}
                                handleCourseCreate={handleCourseUpdate}
                                isEdit={true}
                            />
                        )
                    }
                </div>

                {/* Sidebar - Right Side (1 column) */}
                <div className="lg:col-span-1">
                    <CourseOptions active={active} setActive={setActive} />
                </div>
            </div>
        </div>
    )
}

export default EditCourse