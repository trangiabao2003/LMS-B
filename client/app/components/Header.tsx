import Link from 'next/link';
import React from 'react'

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
}

export default function Header({ open, setOpen, activeItem }: Props) {
    const [active, setActive] = React.useState(activeItem);
    const [openSidebar, setOpenSidebar] = React.useState(false);

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 85) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }

    return (
        <div>
            <div className={`${active
                ? "dark: bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                : "w-full border-b dark:border--[#ffffff1c] h-[80px] z-[80] dark:shadow"
                }`}>
                    <div className="w-[95%] mx-auto flex justify-between items-center h-full">
                        <div className="w-full h-[80px] flex items-center justify-between p-3">
                            <div className="d">
                                <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
                                    Elearning
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}