"use client";

import { ThemeSwhitcher } from "@/app/utils/ThemeSwitcher";
import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

type Props = {
    open?: boolean;
    setOpen?: any;
};

const DashboardHeader = ({ open, setOpen }: Props) => {

    return (
        <div className="w-full bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
            <div className="flex items-center justify-between px-8 py-4">
                {/* Left Section - Title */}
                <div>
                    <h1 className="text-xl font-semibold text-black dark:text-white">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-6">
                    {/* Theme Switcher */}
                    <div className="flex items-center">
                        <ThemeSwhitcher />
                    </div>

                    {/* Notifications */}
                    <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
                        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black hover:text-blue-500 dark:hover:text-blue-400 transition-colors" />
                        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-[12px] flex items-center justify-center text-white font-semibold">
                            3
                        </span>
                    </div>

                    {/* Notifications Dropdown */}
                    {open && (
                        <div className="absolute top-16 right-8 w-[380px] max-h-[60vh] dark:bg-slate-800 bg-white shadow-xl rounded-lg overflow-hidden z-50">
                            <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <h5 className="text-[18px] font-semibold text-white">
                                    Notifications
                                </h5>
                            </div>
                            <div className="overflow-y-auto max-h-[50vh]">
                                {/* Notification Item 1 */}
                                <div className="dark:bg-slate-700/50 bg-gray-50 border-b border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-black dark:text-white font-semibold text-sm">
                                                New Question Received
                                            </p>
                                            <button className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                                                Mark as read
                                            </button>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                            A student asked a new question in your course MERN Stack LMS
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            5 minutes ago
                                        </p>
                                    </div>
                                </div>

                                {/* Notification Item 2 */}
                                <div className="dark:bg-slate-700/50 bg-gray-50 border-b border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-black dark:text-white font-semibold text-sm">
                                                New Course Sale
                                            </p>
                                            <button className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                                                Mark as read
                                            </button>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                            Someone purchased your course "Web Development Bootcamp"
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            1 hour ago
                                        </p>
                                    </div>
                                </div>

                                {/* Notification Item 3 */}
                                <div className="dark:bg-slate-700/50 bg-gray-50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-black dark:text-white font-semibold text-sm">
                                                Course Review
                                            </p>
                                            <button className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                                                Mark as read
                                            </button>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                            Your course received a 5-star review from a student
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader;