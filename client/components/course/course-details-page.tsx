import { useEffect, useState } from 'react'
import Loader from '../Loader/Loader';
import { Heading } from '@/app/utils/Heading';
import { useGetCourseDetailsQuery } from '@/redux/features/courses/coursesApi';
import { Header } from '../header';
import CourseDetails from './course-details';
import { Footer } from '../footer';
import { useCreatePaymentIntentMutation, useGetStripePublishablekeyQuery } from '@/redux/features/orders/ordersApi';
import { loadStripe } from '@stripe/stripe-js';

type Props = {
    id: string;
}

const CourseDetailsPage = ({ id }: Props) => {
    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const { data, isLoading } = useGetCourseDetailsQuery(id);
    const { data: config } = useGetStripePublishablekeyQuery({});
    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        if (config) {
            const publishablekey = config?.publishableKey;
            setStripePromise(loadStripe(publishablekey));
        }
        if (data) {
            const amount = Math.round(data.course.price * 100);
            createPaymentIntent(amount);
        };

    }, [config, data]);

    useEffect(() => {
        if (paymentIntentData) {
            setClientSecret(paymentIntentData?.clientSecret);
        }

    }, [paymentIntentData]);

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
                        {
                            stripePromise && (
                                <CourseDetails data={data.course} stripePromise={stripePromise} clientSecret={clientSecret} />
                            )
                        }

                        <Footer />
                    </div>
                )
            }
        </>
    )
}

export default CourseDetailsPage