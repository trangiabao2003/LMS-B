'use client';

import { useState } from 'react';
import CoursePlayer from '@/app/utils/CoursePlayer';
import CourseContentList from './course-content-list';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    data: any;
    id: string;
    user: any;
}

const CourseContent = ({ data, id, user }: Props) => {
    const [activeVideo, setActiveVideo] = useState(0);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">No course content available</p>
            </div>
        );
    }

    const totalVideos = data.length;

    const handlePreviousVideo = () => {
        if (activeVideo > 0) {
            setActiveVideo(activeVideo - 1);
        }
    };

    const handleNextVideo = () => {
        if (activeVideo < totalVideos - 1) {
            setActiveVideo(activeVideo + 1);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Video Player - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-0">
                            <CoursePlayer 
                                videoUrl={data[activeVideo]?.videoUrl} 
                                title={data[activeVideo]?.title}
                            />
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={handlePreviousVideo}
                            disabled={activeVideo === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeVideo === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg'
                            }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                            <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                {activeVideo + 1} / {totalVideos}
                            </span>
                            <span>Lectures</span>
                        </div>

                        <button
                            onClick={handleNextVideo}
                            disabled={activeVideo === totalVideos - 1}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                                activeVideo === totalVideos - 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg'
                            }`}
                        >
                            <span>Next</span>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Video Info */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge>{`Lecture ${activeVideo + 1}`}</Badge>
                                <Badge variant="outline">
                                    {data[activeVideo]?.videoLength} min
                                </Badge>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">
                                {data[activeVideo]?.title}
                            </h2>
                            <p className="text-muted-foreground">
                                {data[activeVideo]?.description}
                            </p>

                            {/* Links/Resources */}
                            {data[activeVideo]?.links && data[activeVideo].links.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Resources:</h3>
                                        {data[activeVideo].links.map((link: any, index: number) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 hover:underline"
                                            >
                                                <span>📎</span>
                                                <span>{link.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Course Content List - Right Column */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-4">Course Content</h3>
                            <Separator className="mb-4" />
                            <CourseContentList
                                data={data}
                                activeVideo={activeVideo}
                                setActiveVideo={setActiveVideo}
                                isDemo={false}
                            />
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default CourseContent;