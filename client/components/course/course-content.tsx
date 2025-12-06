'use client';

import { useState } from 'react';
import { Header } from '../header';
import CourseContentMedia from './course-content-media';
import CourseContentList from './course-content-list';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/app/utils/Heading';

type Props = {
    data: any;
    user: any;
}

const CourseContent = ({ data, user }: Props) => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState('Login');
    const [activeVideo, setActiveVideo] = useState(0);

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">No course content available</p>
            </div>
        );
    }

    return (
        <>
            <Header
                activeItem={1}
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
            />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Heading
                    title={data[activeVideo]?.title}
                    keywords={data[activeVideo]?.tags}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Course Content Media */}
                    <div className="lg:col-span-2">
                        <CourseContentMedia
                            data={data}
                            activeVideo={activeVideo}
                            setActiveVideo={setActiveVideo}
                            user={user}
                        />
                    </div>

                    {/* Right Column - Course Content List */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4">Course Content</h3>
                                <Separator className="mb-4" />
                                <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                    <CourseContentList
                                        data={data}
                                        activeVideo={activeVideo}
                                        setActiveVideo={setActiveVideo}
                                        isDemo={false}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseContent;