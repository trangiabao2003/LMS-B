'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCheckCoursePurchasedQuery } from '@/redux/features/orders/ordersApi';
import { useGetCourseContentQuery } from '@/redux/features/courses/coursesApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import CourseContent from '@/components/course/course-content';
import Loader from '@/components/Loader/Loader';

const CourseAccessPage = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;

    // Load user data
    const { data: userData, isLoading: userLoading } = useLoadUserQuery(undefined, {});
    const user = userData?.user;

    // Check if course is purchased
    const {
        data: purchaseData,
        isLoading: checkingPurchase
    } = useCheckCoursePurchasedQuery(courseId, {
        skip: !user || !courseId,
    });

    // Get course content (not details) - for purchased users only
    const {
        data: contentData,
        isLoading: contentLoading,
        error: contentError
    } = useGetCourseContentQuery(courseId, {
        skip: !courseId || !purchaseData?.isPurchased,
    });

    // Redirect if not purchased
    useEffect(() => {
        if (!userLoading && !checkingPurchase && !purchaseData?.isPurchased) {
            router.push(`/course/${courseId}`);
        }
    }, [userLoading, checkingPurchase, purchaseData, courseId, router]);

    if (userLoading || checkingPurchase || contentLoading) {
        return <Loader />;
    }

    if (!user) {
        router.push('/');
        return <Loader />;
    }

    if (!purchaseData?.isPurchased) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-4">
                        You have not purchased this course
                    </p>
                    <button
                        onClick={() => router.push(`/course/${courseId}`)}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Go to Course Details
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <CourseContent
                data={contentData?.courseContent}
                id={courseId}
                user={user}
            />
        </div>
    );
};

export default CourseAccessPage;