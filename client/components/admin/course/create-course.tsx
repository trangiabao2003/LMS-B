"use client"

import React, { useState } from 'react'
import CourseOptions from './course-options'
import CourseInformation from './course-information'
import CourseData from './course-data'

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