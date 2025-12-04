'use client';

import { useState } from 'react';
import CoursePlayer from '@/app/utils/CoursePlayer';
import CourseContentList from './course-content-list';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Props = {
    data: any;
    id: string;
    user: any;
}

const CourseContent = ({ data, id, user }: Props) => {
    const [activeVideo, setActiveVideo] = useState(0);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Video Player - Left Column */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                            <CoursePlayer 
                                videoUrl={data?.courseData[activeVideo]?.videoUrl}
                                title={data?.courseData[activeVideo]?.title}
                            />
                        </CardContent>
                    </Card>

                    {/* Video Info */}
                    <Card className="mt-6">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge>{`Lecture ${activeVideo + 1}`}</Badge>
                                <Badge variant="outline">
                                    {data?.courseData[activeVideo]?.videoLength} min
                                </Badge>
                            </div>
                            <h2 className="text-2xl font-bold mb-4">
                                {data?.courseData[activeVideo]?.title}
                            </h2>
                            <p className="text-muted-foreground">
                                {data?.courseData[activeVideo]?.description}
                            </p>
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
                                data={data?.courseData}
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