"use client"

import { CourseCard } from "../course/course-card"
import { useGetEnrolledCoursesQuery } from "@/redux/features/courses/coursesApi"
import Loader from "../Loader/Loader"

type Props = {}

const EnrolledCourses = (props: Props) => {
    const { data, isLoading } = useGetEnrolledCoursesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    })

    const enrolledCourses = data?.courses || []

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="w-full">
            <h1 className="block text-[25px] md:text-[30px] font-Poppins text-center font-medium text-black dark:text-white pb-6">
                Enrolled Courses
            </h1>

            {enrolledCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-foreground mb-2">No courses enrolled yet</h3>
                        <p className="text-muted-foreground mb-6">Start learning by enrolling in a course</p>
                        <a
                            href="/courses"
                            className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-[#37a39a] text-[#37a39a] dark:text-white font-semibold rounded-lg hover:bg-[#37a39a] hover:text-white transition duration-200"
                        >
                            Browse Courses
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course: any) => (
                        <CourseCard key={course._id} course={course} isProfile={true} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default EnrolledCourses
