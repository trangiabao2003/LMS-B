import { useState } from 'react'
import Loader from '../Loader/Loader';
import { Heading } from '@/app/utils/Heading';
import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import { Header } from '../header';
import CourseDetails from './course-details';
import { Footer } from '../footer';

type Props = {
    id: string;
}

const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);

    return (
        <>
            {
                isLoading ? (<Loader />) : (
                    <div className="">
                        <Heading
                            title={data?.course.name + " Deatails - LMSB"}
                            description={
                                "ELearning is a programming community which is developed by shahriar sajeeb for helping programmers"
                            }
                            keywords={data?.course?.tags}
                        />
                        <Header
                            open={open}
                            setOpen={setOpen}
                            route={route} setRoute={setRoute}
                            activeItem={1}
                        />
                        <CourseDetails data={data?.course} />
                        <Footer />
                    </div>
                )
            }
        </>
    )
}

export default CourseDetailsPage