"use client"
import React, { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { styles } from '@/styles/styles'
import { useRouter } from 'next/navigation'

const NotFound = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    const router = useRouter();
    const backToHome = () => {
        router.push("/");
    };

    return (
        <div className='flex flex-col min-h-screen'>
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={0}
                setRoute={setRoute}
                route={route}
            />
            <div className="w-[95%] md:w-[90%] lg:w-[85%] m-auto flex flex-col items-center justify-center flex-1 py-20">
                <h1 className="text-[100px] font-Poppins font-[700] text-black dark:text-white leading-none">
                    404
                </h1>
                <p className={`${styles.title} mb-8`}>
                    Page Not Found
                </p>
                <p className="text-center font-Poppins text-black dark:text-white mb-8 text-[18px] max-w-[600px]">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <button onClick={backToHome} className={styles.button}>
                    Back to Home
                </button>
            </div>
            <Footer />
        </div>
    )
}

export default NotFound
