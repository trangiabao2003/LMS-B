"use client"

import React, { useState } from 'react'
import CourseOptions from './course-options'
import CourseInformation from './course-information'
import { styles } from '@/styles/styles'

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
        <div className={styles.courseContainer}>
            <div className={styles.courseWrapper}>
                <div className={styles.courseMainContent}>
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
                </div>
                <div className={styles.courseSidebar}>
                    <CourseOptions active={active} setActive={setActive} />
                </div>
            </div>
        </div>
    )
}

export default CreateCourse