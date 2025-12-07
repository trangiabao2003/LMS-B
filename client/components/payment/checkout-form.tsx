import { useCreateOrderMutation } from '@/redux/features/orders/ordersApi';
import { styles } from '@/styles/styles';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

type Props = {
    setOpen: any;
    data: any;
    refetchPurchased?: () => void;
    user: any;
}

const CheckoutForm = ({ setOpen, data, refetchPurchased, user }: Props) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [message, setMessage] = useState<any>("");
    const [createOrder, { data: orderData, error, isSuccess }] = useCreateOrderMutation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
            toast.error(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            createOrder({ courseId: data._id, payment_info: paymentIntent });
        }
    };

    useEffect(() => {
        if (isSuccess && orderData) {
            toast.success("Course purchased successfully!");
            setIsLoading(false);
            setOpen(false);
            socketId.emit("notification", {
                title: "New Order",
                message: `You have a new order from ${data.name}`,
                userId: user._id,
                type: "success",
            });

            if (refetchPurchased) {
                refetchPurchased();
            }

            setTimeout(() => {
                router.push(`/course-access/${data._id}`);
            }, 1000);
        }

        if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
            setIsLoading(false);
        }
    }, [orderData, error, isSuccess, data._id, router, setOpen, refetchPurchased]);

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement id="link-authentication-element" />
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                type="submit"
                className={`${styles.button} mt-2 h-[35px]! w-full`}
            >
                {isLoading ? "Processing..." : "Pay now"}
            </button>

            {message && (
                <div className="text-red-500 font-Poppins pt-2">
                    {message}
                </div>
            )}
        </form>
    );
}

export default CheckoutForm;