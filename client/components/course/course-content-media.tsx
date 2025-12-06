'use client';

import { useState } from 'react';
import CoursePlayer from '@/app/utils/CoursePlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { styles } from '@/styles/styles';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

type Props = {
    data: any;
    activeVideo: number;
    setActiveVideo: (index: number) => void;
    user: any;
};

type TabType = 'Overview' | 'Resources' | 'Q&A' | 'Reviews';

const CourseContentMedia = ({ data, activeVideo, setActiveVideo, user }: Props) => {
    const [activeTab, setActiveTab] = useState<TabType>('Overview');
    const [question, setQuestion] = useState('');
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    const isReviewExists = data?.reviews?.find(
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

                        {
                            activeTab === "Resources" && (
                                <div>
                                    {data[activeVideo]?.links.map((item: any, index: number) => (
                                        <div className="mb-5" key={index}>
                                            <h2 className="md:text-[20px] md:inline-block dark:text-white text-black">
                                                {item.title && item.title + " :"}
                                            </h2>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                                                href={item.url}
                                            >
                                                {item.url}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )
                        }

                        {activeTab === "Q&A" && (
                            <>
                                <div className="flex w-full">
                                    <Image
                                        src={user.avatar ? user.avatar.url : "/avatar.jpg"}
                                        width={50}
                                        height={50}
                                        alt="avatar"
                                        className="w-[50px] h-[50px] md:w-9 md:h-9 rounded-full object-cover"
                                    />
                                    <textarea
                                        name=""
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        id=""
                                        cols={40}
                                        rows={5}
                                        placeholder="Write your question..."
                                        className="outline-none bg-transparent ml-3 border border-[#ffffff57] md:w-full p-2 rounded w-[90%] md:text-[18px] font-Poppins"
                                    >
                                    </textarea>
                                </div>
                                <div className="w-full flex justify-end">
                                    <div
                                        className={`${styles.button
                                            } w-[120px]! h-10! text-[18px] mt-5`}
                                    >
                                        Submit
                                    </div>
                                </div>
                                <br />
                                <br />
                                <div className="w-full h-px bg-[#ffffff3b]"></div>
                                <div>
                                    {/* questions Reply */}
                                </div>
                            </>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="w-full">
                                <>
                                    {!isReviewExists && (
                                        <>
                                            <div className="w-full flex items-center gap-4">

                                                <Image
                                                    src={
                                                        user.avatar
                                                            ? user.avatar.url
                                                            : "/avatar.jpg"
                                                    }
                                                    width={50}
                                                    height={50}
                                                    alt=""
                                                    className="w-[50px] h-[50px] rounded-full object-cover"
                                                />
                                                <div className="w-full">
                                                    <h5 className="pl-3 text-[20px] font-medium dark:text-white text-black">
                                                        Give a Rating <span className="text-red-500">*</span>
                                                    </h5>
                                                    <div className="flex w-full ml-2 pb-3">
                                                        {[1, 2, 3, 4, 5].map((i) =>
                                                            rating >= i ? (
                                                                <AiFillStar
                                                                    key={i}
                                                                    className="mr-1 cursor-pointer"
                                                                    color="rgb(246,186,0)"
                                                                    size={25}
                                                                    onClick={() => setRating(i)}
                                                                />
                                                            ) : (
                                                                <AiOutlineStar
                                                                    key={i}
                                                                    className="mr-1 cursor-pointer"
                                                                    color="rgb(246,186,0)"
                                                                    size={25}
                                                                    onClick={() => setRating(i)}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    <textarea
                                                        name=""
                                                        value={review}
                                                        onChange={(e) => setReview(e.target.value)}
                                                        id=""
                                                        cols={40}
                                                        rows={5}
                                                        placeholder="Write your comment..."
                                                        className="outline-none bg-transparent md:ml-3 border border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded text-[18px] font-Poppins"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="w-full flex justify-end">
                                                <div
                                                    className={`${styles.button} w-[120px]! h-10! text-[18px] mt-5 md:mr-0 mr-2`}
                                                >
                                                    Submit
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            </div>
                        )}
                    </div >
                </CardContent >
            </Card >
        </div >
    );
};

export default CourseContentMedia;