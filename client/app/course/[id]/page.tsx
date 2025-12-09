"use client"

import CourseDetailsPage from "@/components/course/course-details-page";
import { use } from "react";

const Page = ({ params }: any) => {
    const { id }:  any = use(params);

    return (
        <div>
            <CourseDetailsPage id={id} />
        </div>
    )
};

export default Page;