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
    const { data, isLoading, refetch } = useGetCourseDetailsQuery(id);
    const { data: config } = useGetStripePublishablekeyQuery({});
    const [createPaymentIntent, { data: paymentIntentData }] = useCreatePaymentIntentMutation();
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (config) {
            const publishablekey = config?.publishablekey;
            setStripePromise(loadStripe(publishablekey));
        }
    }, [config]);

    useEffect(() => {
        if (data && !clientSecret) {
            const amount = Math.round(data.course.price * 100);
            createPaymentIntent(amount);
        }
    }, [data, clientSecret]);

    useEffect(() => {
        if (paymentIntentData) {
            setClientSecret(paymentIntentData?.client_secret);
        }
    }, [paymentIntentData]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="">
                    <Heading
                        title={data?.course.name + " Details - LMSB"}
                        description="ELearning platform"
                        keywords={data?.course?.tags}
                    />
                    <Header
                        open={open}
                        setOpen={setOpen}
                        route={route}
                        setRoute={setRoute}
                        activeItem={1}
                    />
                    <CourseDetails
                        data={data.course}
                        stripePromise={stripePromise}
                        clientSecret={clientSecret}
                    />
                    <Footer />
                </div>
            )}
        </>
    );
};

export default CourseDetailsPage