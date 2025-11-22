"use client"

import React, { useState } from 'react'
import CourseOptions from './course-options'
import CourseInformation from './course-information'
import CourseData from './course-data'
import CourseContentData from './course-content-data'
import CoursePreview from './course-preview'

type Props = {}

const CreateCourse = (props: Props) => {
    const [active, setActive] = useState(0);
    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
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
            videoSection: courseContent.videoSection,
            links: courseContent.links.map((link) => ({
                title: link.title,
                url: link.url,
            })),
            suggestion: courseContent.suggestion,
        }));

        // prepare our data object
        const data = {
            name: courseInfo.name,
            description: courseInfo.description,
            price: courseInfo.price,
            estimatedPrice: courseInfo.estimatedPrice,
            tags: courseInfo.tags,
            thumbnail: courseInfo.thumbnail,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            totalVideos: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseContent: formattedCourseContentData,
        }
        setCourseData(data)
    }

    const handleCourseCreate = async (e: any) => {
        const data = courseData;
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Main Form - Left Side (2 columns) */}
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
                                handleCourseCreate={handleCourseCreate}
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

export default CreateCourse