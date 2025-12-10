'use client';

import { useEffect, useState } from 'react';
import CoursePlayer from '@/app/utils/CoursePlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { styles } from '@/styles/styles';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import {
    useAddAnswerInQuestionMutation,
    useAddNewQuestionMutation,
    useAddReplyInReviewMutation,
    useAddReviewInCourseMutation,
    useGetCourseDetailsQuery
} from '@/redux/features/courses/coursesApi';
import TimeAgo from 'javascript-time-ago';
import { MdMessage, MdVerified } from 'react-icons/md';
import Ratings from '@/app/utils/Ratings';
import en from 'javascript-time-ago/locale/en.json'
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

type Props = {
    data: any;
    activeVideo: number;
    setActiveVideo: (index: number) => void;
    user: any;
    refetch: any;
    courseId: string;
};

type TabType = 'Overview' | 'Resources' | 'Q&A' | 'Reviews';

const CourseContentMedia = ({ data, activeVideo, setActiveVideo, user, refetch, courseId }: Props) => {
    const [activeTab, setActiveTab] = useState<TabType>('Overview');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionId, setQuestionId] = useState('');
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [addNewQuestion, { isSuccess, error, isLoading: questionCreationLoading }] = useAddNewQuestionMutation();
    const [replyActive, setReplyActive] = useState(false);
    const [isReviewReply, setIsReviewReply] = useState(false);
    const [reviewId, setReviewId] = useState('');
    const [replyReview, setReplyReview] = useState('');
    const [addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerCreationLoading }] = useAddAnswerInQuestionMutation()
    const [addReviewInCourse, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewCreationLoading }] = useAddReviewInCourseMutation();
    const [addReplyInReview, { isSuccess: replySuccess, error: replyError, isLoading: replyCreationLoading }] = useAddReplyInReviewMutation();
    const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(courseId, { refetchOnMountOrArgChange: true })
    const course = courseData?.course;

    const isReviewExists = course?.reviews?.find(
        (item: any) => item.user._id === user._id
    );

    const totalVideos = data?.length || 0;
    const currentVideo = data?.[activeVideo];

    const tabs: TabType[] = ['Overview', 'Resources', 'Q&A', 'Reviews'];

    const handlePreviousVideo = () => {
        if (activeVideo > 0) {
            setActiveVideo(activeVideo - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextVideo = () => {
        if (activeVideo < totalVideos - 1) {
            setActiveVideo(activeVideo + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">No video content available</p>
            </div>
        );
    }

    const handleQuestion = () => {
        if (question.length === 0) {
            toast.error("Question can't be empty");
        } else {
            addNewQuestion({
                question,
                courseId: courseId,
                contentId: currentVideo._id,
            });
            setQuestion('');
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setQuestion("");
            refetch();
            toast.success("Question added successfully");
            socketId.emit("notification", {
                title: "New Question received",
                message: `You have a new question in ${data[activeVideo].title}`,
                userId: user._id,
                type: "success",
            });
        }
        if (answerSuccess) {
            setAnswer("");
            refetch();
            toast.success("Answer added successfully");
            if (user.role !== "admin") {
                socketId.emit("notification", {
                    title: "New question reply received",
                    message: `You have a new question reply in ${data[activeVideo].title}`,
                    userId: user._id,
                    type: "success",
                });
            }
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (answerError) {
            if ("data" in answerError) {
                const errorMessage = answerError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (reviewSuccess) {
            setReview("");
            setRating(0);
            courseRefetch();
            toast.success("Review added successfully");
            socketId.emit("notification", {
                title: "New Review received",
                message: `You have a new review in ${data[activeVideo].title}`,
                userId: user._id,
                type: "success",
            });
        }
        if (reviewError) {
            if ("data" in reviewError) {
                const errorMessage = reviewError as any;
                toast.error(errorMessage.data.message);
            }
        }

    }, [isSuccess, error, answerSuccess, answerError, reviewError, reviewSuccess]);

    const handleAnswerSubmit = () => {
        addAnswerInQuestion({ answer, courseId, contentId: currentVideo._id, questionId: questionId });
        toast.success("Answer submitted: " + answer);
        setAnswer("");
    }

    const handleReviewSubmit = async () => {
        if (review.length === 0) {
            toast.error("Review can't be empty");
        }
        else {
            await addReviewInCourse({ review, rating, courseId: courseId })
        }
    }

    const handleReviewReplySubmit = async () => {
        if (replyReview.length === 0) {
            toast.error("Reply can't be empty");
        }
        else {
            await addReplyInReview({ comment: replyReview, courseId: courseId, reviewId: reviewId });
            toast.success("Reply submitted: " + replyReview);
            setReplyReview("");
        }
    }

    useEffect(() => {
        if (replySuccess) {
            setReplyReview("");
            courseRefetch();
            toast.success("Reply added successfully");
            socketId.emit("notification", {
                title: "New Reply review received",
                message: `You have a new reply review in ${data[activeVideo].title}`,
                userId: user._id,
                type: "success",
            });
        }
        if (replyError) {
            if ("data" in replyError) {
                const errorMessage = replyError as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [replySuccess, replyError]);

    return (
        <div className="space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-0">
                    <CoursePlayer
                        videoUrl={currentVideo?.videoUrl}
                        title={currentVideo?.title}
                    />
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={handlePreviousVideo}
                    disabled={activeVideo === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${activeVideo === 0
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Prev Lesson</span>
                </button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {activeVideo + 1} / {totalVideos}
                    </span>
                </div>

                <button
                    onClick={handleNextVideo}
                    disabled={activeVideo === totalVideos - 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${activeVideo === totalVideos - 1
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                >
                    <span>Next Lesson</span>
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Video Title */}
            <div>
                <h2 className="text-2xl font-bold text-foreground">
                    {currentVideo?.title}
                </h2>
            </div>

            {/* Tab Navigation */}
            <Card className="shadow-lg">
                <CardContent className="p-0">
                    {/* Tab Headers */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-6 py-4 font-semibold transition-all relative ${activeTab === tab
                                    ? 'text-cyan-600 dark:text-cyan-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 dark:bg-cyan-400" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">

                        {activeTab === 'Overview' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="text-sm">{`Lecture ${activeVideo + 1}`}</Badge>
                                    <Badge variant="outline" className="text-sm">
                                        {currentVideo?.videoLength} min
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {currentVideo?.description || 'No description available for this lesson.'}
                                </p>
                            </div>
                        )}

                        {activeTab === "Resources" && (
                            <div>
                                {currentVideo?.links?.map((item: any, index: number) => (
                                    <div className="mb-5" key={index}>
                                        <h2 className="md:text-[20px] md:inline-block dark:text-white text-black">
                                            {item.title && item.title + " :"}
                                        </h2>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-[#4395c4] md:text-[20px] md:pl-2"
                                            href={item.url}
                                        >
                                            {item.url}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "Q&A" && (
                            <>
                                {/* Text area for question input */}
                                <div className="flex w-full gap-3 mb-4">
                                    <Image
                                        src={user.avatar ? user.avatar.url : "/avatar.jpg"}
                                        width={40}
                                        height={40}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                    <textarea
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Write your question..."
                                        rows={5}
                                        className="flex-1 outline-none bg-transparent border border-slate-300 dark:border-[#ffffff57] p-3 rounded-xl md:text-[16px] font-Poppins resize-none"
                                    />
                                </div>

                                {/* Submit Question Button */}
                                <div className="w-full flex justify-end">
                                    <button
                                        disabled={questionCreationLoading}
                                        onClick={handleQuestion}
                                        className={`${styles.button} w-[120px] h-10 text-[16px] ${questionCreationLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                        Submit
                                    </button>
                                </div>
                                <br />

                                {/* Display questions */}
                                <div className="w-full h-px bg-[#ffffff3b]" />
                                <div className="mt-6">
                                    {
                                        currentVideo.questions.map((item: any, index: number) => (
                                            <div key={index} className="mb-6 pb-6 border-b border-[#ffffff1e]">
                                                <div className="flex gap-3">
                                                    <Image
                                                        src={item.user?.avatar?.url || "/avatar.jpg"}
                                                        width={40}
                                                        height={40}
                                                        alt="user"
                                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-foreground">{item.user?.name}</h5>
                                                        <p className="text-sm mt-1">{item.question}</p>
                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            {item.createdAt ? timeAgo.format(new Date(item.createdAt)) : 'Recently'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="w-full flex text-sm mt-4 items-center">
                                                    <span
                                                        className="md:pl-16 text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
                                                        onClick={() => {
                                                            if (questionId === item._id) {
                                                                setReplyActive(!replyActive);
                                                                setQuestionId('');
                                                            } else {
                                                                setReplyActive(true);
                                                                setQuestionId(item._id);
                                                            }
                                                        }}
                                                    >
                                                        {questionId === item._id && replyActive ? item.questionReplies.length !== 0 ? "Hide All Replies" : "Hide Reply" : item.questionReplies.length !== 0 ? "All Replies" : "Add Reply"}
                                                    </span>
                                                    <MdMessage size={20} className="dark:text-[#ffffff83] cursor-pointertext-[#00000068]"
                                                    />
                                                    <span className="pl-1 -mt-1 cursor-pointer text-[#00000068] dark:text-[#ffffff83]">
                                                        {item.questionReplies.length}
                                                    </span>
                                                </div>
                                                {replyActive && questionId === item._id && (
                                                    <>
                                                        {item.questionReplies.map((item: any) => (
                                                            <div className="w-full flex md:ml-16 my-5 text-black dark:text-white">
                                                                <div className='flex flex-end '>
                                                                    <Image
                                                                        src={
                                                                            item.user.avatar
                                                                                ? item.user.avatar.url
                                                                                : "avatar.jpg"
                                                                        }
                                                                        width={36}
                                                                        height={36}
                                                                        alt=""
                                                                        className="w-9 h-9 rounded-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="pl-2">
                                                                    <div className="flex items-center">
                                                                        <h5 className="font-semibold text-foreground">{item.user.name}</h5> {item.user.role === "admin" && <MdVerified className="text-[#0095f6] ml-2 text-[16px]" />}
                                                                    </div>
                                                                    <p className="text-[14px] pb-1 pl-1">{item.answer}</p>
                                                                    <small className="text-[#ffffff83]">
                                                                        {item.createdAt ? timeAgo.format(new Date(item.createdAt)) : 'Recently'}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <>
                                                            <div className="w-full flex relative">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter your reply..."
                                                                    value={answer}
                                                                    onChange={(e: any) => setAnswer(e.target.value)}
                                                                    className={`block md:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:text-white text-black dark:border-white p-[5px] w-full 
                                                                        ${answer || answerCreationLoading && 'cursor-not-allowed'}`}
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    className="absolute right-0 bottom-1"
                                                                    onClick={handleAnswerSubmit}
                                                                    disabled={answer === "" || answerCreationLoading}
                                                                >
                                                                    Submit
                                                                </button>
                                                            </div>
                                                            <br />
                                                        </>

                                                    </>
                                                )}
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="w-full">
                                {!isReviewExists && (
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <Image
                                                src={user.avatar ? user.avatar.url : "/avatar.jpg"}
                                                width={50}
                                                height={50}
                                                alt="avatar"
                                                className="w-[50px] h-[50px] rounded-full object-cover shrink-0"
                                            />
                                            <div className="flex-1">
                                                <h5 className="text-[20px] font-medium text-foreground mb-3">
                                                    Give a Rating <span className="text-red-500">*</span>
                                                </h5>
                                                <div className="flex gap-2 mb-4">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        rating >= i ? (
                                                            <AiFillStar
                                                                key={i}
                                                                className="cursor-pointer hover:scale-110 transition-transform"
                                                                color="rgb(246,186,0)"
                                                                size={25}
                                                                onClick={() => setRating(i)}
                                                            />
                                                        ) : (
                                                            <AiOutlineStar
                                                                key={i}
                                                                className="cursor-pointer hover:scale-110 transition-transform"
                                                                color="rgb(246,186,0)"
                                                                size={25}
                                                                onClick={() => setRating(i)}
                                                            />
                                                        )
                                                    ))}
                                                </div>
                                                <textarea
                                                    value={review}
                                                    onChange={(e) => setReview(e.target.value)}
                                                    placeholder="Write your review..."
                                                    rows={5}
                                                    className="w-full outline-none bg-transparent border border-slate-300 dark:border-[#ffffff57] p-3 rounded-xl text-[16px] font-Poppins resize-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-end">
                                            <button className={`${styles.button} w-[120px] h-10 text-[16px] ${reviewCreationLoading && "cursor-no-drop"}`}
                                                onClick={reviewCreationLoading ? () => { } : handleReviewSubmit}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <br />
                                <div className="w-full h-px bg-[#ffffff3b]"></div>
                                <div className="w-full">
                                    {course?.reviews && course.reviews.length > 0 ? (
                                        [...course.reviews].reverse().map((item: any, index: number) => (
                                            <div className="w-full my-5" key={index}>
                                                <div className="w-full flex">
                                                    <div>
                                                        <Image
                                                            src={
                                                                item.user.avatar
                                                                    ? item.user.avatar.url
                                                                    : "avatar.jpg"
                                                            }
                                                            width={36}
                                                            height={36}
                                                            alt=""
                                                            className="w-9 h-9 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-2">
                                                        <h1 className="text-[18px]">{item?.user.name}</h1>
                                                        <Ratings rating={item.rating} />
                                                        <p>{item.comment}</p>
                                                        <small className="text-slate-700 dark:text-[#ffffff83]">
                                                            {item.createdAt ? timeAgo.format(new Date(item.createdAt)) : "Just now"}
                                                        </small>
                                                    </div>
                                                </div>
                                                {
                                                    user.role === "admin" && (
                                                        <span className={`${styles.label} ml-10! cursor-pointer`}
                                                            onClick={() => {
                                                                setIsReviewReply(!isReviewReply);
                                                                setReviewId(item._id);
                                                            }} >
                                                            Add Reply <MdMessage size={16} className="cursor-pointer text-slate-600 dark:text-[#ffffff83]" />
                                                        </span>
                                                    )}
                                                {
                                                    isReviewReply && (
                                                        <div className="w-full flex relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter your reply..."
                                                                value={replyReview}
                                                                onChange={(e) => setReplyReview(e.target.value)}
                                                                className="block md:ml-12 mt-2 outline-none bg-transparent border-b border-white dark:border-[#ffffff83] p-[5px] w-[95%]"
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="absolute right-0 bottom-1"
                                                                onClick={() => handleReviewReplySubmit()}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>

                                                    )}
                                                {item.commentReplies.map((i: any, index: number) => (
                                                    <div className="w-full flex md:ml-16 my-5">
                                                        <div className="w-10 h-10" key={index}>
                                                            <Image
                                                                src={
                                                                    i.user.avatar
                                                                        ? i.user.avatar.url
                                                                        :
                                                                        "/avatar.jpg"
                                                                }
                                                                height={40}
                                                                width={40}
                                                                alt="avatar"
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="pl-2">
                                                            <h5 className="text-[16px]">{i.user.name}</h5>
                                                            <p>{i.comment}</p>
                                                            <small className="text-[#ffffff83]">
                                                                {i.createdAt ? timeAgo.format(new Date(i.createdAt)) : "Just now"}
                                                            </small>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="pt-3 text-muted-foreground">No reviews yet</p>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
};

export default CourseContentMedia;
