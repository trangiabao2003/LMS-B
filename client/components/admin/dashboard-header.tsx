"use client";

import { ThemeSwhitcher } from "@/app/utils/ThemeSwitcher";
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationsApi";
import { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardHeader = () => {
    const [open, setOpen] = useState(false);
    const notificationSound = new Audio(
        "https://res.cloudinary.com/biennguyen/video/upload/v1765113063/new-notification-022-370046_kagbph.mp3"
    );
    const { data, refetch } = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();
    const [notifications, setNotifications] = useState<any>([]);

    const playerNotificationSound = () => {
        notificationSound.play();
    };

    useEffect(() => {
        if (data) {
            setNotifications(
                data.notifications.filter((item: any) => item.status === "unread")
            );
        }
        if (isSuccess) {
            refetch();
        }
        notificationSound.load();

    }, [data, isSuccess]);

    useEffect(() => {
        socketId.on("newNotification", (data) => {
            refetch();
            playerNotificationSound();
        });

    }, []);

    const handleNotificationStatusChange = async (id: string) => {
        await updateNotificationStatus(id);
    }

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
                        {notifications.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-[12px] flex items-center justify-center text-white font-semibold">
                            {notifications.length}
                        </span>}
                    </div>

                    {/* Notifications Dropdown */}
                    {open && (
                        <div className="absolute top-16 right-8 w-[380px] max-h-[60vh] dark:bg-slate-800 bg-white shadow-xl rounded-lg overflow-hidden z-50">
                            <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <h5 className="text-[18px] font-semibold text-white">
                                    Notifications
                                </h5>
                            </div>
                            {
                                notifications && notifications.length > 0 ? (
                                    <div className="overflow-y-auto max-h-[50vh]">
                                        {notifications.map((notification: any) => (
                                            <div
                                                key={notification._id}
                                                className="dark:bg-slate-700/50 bg-gray-50 border-b border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <p className="text-black dark:text-white font-semibold text-sm">
                                                            {notification.title}
                                                        </p>
                                                        <button
                                                            onClick={() => handleNotificationStatusChange(notification._id)}
                                                            className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                                        {timeAgo.format(new Date(notification.createdAt))}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center">
                                        No notification
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader;