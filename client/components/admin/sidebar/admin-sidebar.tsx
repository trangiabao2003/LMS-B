"use client"

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import avatarDefault from "../../../public/avatar.jpg";
import {
    HomeOutlinedIcon,
    PeopleOutlinedIcon,
    ReceiptOutlinedIcon,
    OndemandVideoIcon,
    SettingsIcon,
    ExitToAppIcon,
    MenuOutlinedIcon,
} from "./icon";

interface itemProps {
    title: string;
    to: string;
    icon: React.ReactNode;
    selected: string;
    setSelected: (title: string) => void;
    isCollapsed: boolean;
}

const Item = ({ title, to, icon, selected, setSelected, isCollapsed }: itemProps) => {
    return (
        <Link href={to}>
            <button
                onClick={() => setSelected(title)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 text-sm font-medium transition-colors ${selected === title
                    ? "text-[#6870fa] border-l-4 border-[#6870fa] bg-slate-800/50"
                    : "text-gray-400 border-l-4 border-transparent hover:text-gray-200"
                    }`}
                title={title}
            >
                <span className="text-xl shrink-0">{icon}</span>
                {!isCollapsed && <span className="hidden lg:inline">{title}</span>}
            </button>
        </Link>
    );
};

// Map routes to menu titles
const routeToTitle: { [key: string]: string } = {
    "/admin": "Dashboard",
    "/admin/users": "Users",
    "/admin/invoices": "Invoices",
    "/admin/create-course": "Create Course",
    "/admin/courses": "Live Courses",
    "/admin/hero": "Hero",
    "/admin/faq": "FAQ",
    "/admin/categories": "Categories",
    "/admin/team": "Manage Team",
    "/admin/courses-analytics": "Courses Analytics",
    "/admin/orders-analytics": "Orders Analytics",
    "/admin/users-analytics": "Users Analytics",
    "/admin/settings": "Settings",
    "/admin/logout": "Logout",
};

const AdminSidebar = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const { user } = useSelector((state: any) => state.auth);

    // Sync selected state with current pathname
    useEffect(() => {
        const currentTitle = routeToTitle[pathname] || "Dashboard";
        setSelected(currentTitle);
    }, [pathname]);

    return (
        <div
            className={`${isCollapsed ? "w-20" : "w-64"
                } h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 overflow-y-auto`}
            className={`${isCollapsed ? "w-20" : "w-64"
                } h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 overflow-y-auto`}
        >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-center lg:justify-between gap-2">
                {!isCollapsed && (
                    <a href="/" className="flex items-center gap-2">
                        <h1 className="text-lg font-bold text-white hidden lg:block">ELEARNING</h1>
                    </a>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <MenuOutlinedIcon className="text-xl" />
                </button>
            </div>

            {/* User Profile */}
            {!isCollapsed && (
                <div className="p-6 border-b border-slate-800 text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full border-4 border-blue-500 overflow-hidden">
                        <Image
                            src={user?.avatar?.url || avatarDefault}
                            alt="Admin"
                            width={96}
                            height={96}
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-white font-semibold text-sm">{user?.name || "Admin User"}</h2>
                    <p className="text-gray-400 text-xs">Admin</p>
                </div>
            )}

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 lg:px-0">
                {/* Dashboard */}
                <div>
                    <Item
                        title="Dashboard"
                        to="/admin"
                        icon={<HomeOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        isCollapsed={isCollapsed}
                    />
                </div>

                {/* Data Section */}
                {!isCollapsed && (
                    <div className="px-4 py-4 mt-2 hidden lg:block">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Data</h3>
                    </div>
                )}
                <Item
                    title="Users"
                    to="/admin/users"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="Invoices"
                    to="/admin/invoices"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />

                {/* Content Section */}
                {!isCollapsed && (
                    <div className="px-4 py-4 mt-2 hidden lg:block">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Content</h3>
                    </div>
                )}
                <Item
                    title="Create Course"
                    to="/admin/create-course"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="Live Courses"
                    to="/admin/courses"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />

                {/* Customization Section */}
                {!isCollapsed && (
                    <div className="px-4 py-4 mt-2 hidden lg:block">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Customization</h3>
                    </div>
                )}
                <Item
                    title="Hero"
                    to="/admin/hero"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="FAQ"
                    to="/admin/faq"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="Categories"
                    to="/admin/categories"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />

                {/* Controllers Section */}
                {!isCollapsed && (
                    <div className="px-4 py-4 mt-2 hidden lg:block">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Controllers</h3>
                    </div>
                )}
                <Item
                    title="Manage Team"
                    to="/admin/team"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />

                {/* Analytics Section */}
                {!isCollapsed && (
                    <div className="px-4 py-4 mt-2 hidden lg:block">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Analytics</h3>
                    </div>
                )}
                <Item
                    title="Courses Analytics"
                    to="/admin/courses-analytics"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="Orders Analytics"
                    to="/admin/orders-analytics"
                    icon={<OndemandVideoIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="Users Analytics"
                    to="/admin/users-analytics"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
            </nav>

            {/* Footer - Extras */}
            <div className="border-t border-slate-800 p-2 px-2 lg:px-4">
                {!isCollapsed && (
                    <div className="px-4 py-2 mb-2 hidden lg:block">
                        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Extras</h3>
                    </div>
                )}
                <Item
                    title="Settings"
                    to="/admin/settings"
                    icon={<SettingsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
                <Item
                    title="Logout"
                    to="/logout"
                    icon={<ExitToAppIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    isCollapsed={isCollapsed}
                />
            </div>
        </div>
    );
};

export default AdminSidebar;