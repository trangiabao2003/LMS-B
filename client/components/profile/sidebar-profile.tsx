import Image from 'next/image';
import avatarDefault from './../../public/avatar.jpg';
import { MdLockPerson, MdOutlineAdminPanelSettings } from "react-icons/md";
import { SiCoursera } from "react-icons/si";
import { FaSignOutAlt } from "react-icons/fa";
import Link from 'next/link';

type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logOutHandler: any;
}

const SidebarProfile = ({ user, active, avatar, setActive, logOutHandler }: Props) => {
    return (
        <div className="w-full">
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 1 ? " dark:bg-slate-800 bg-slate-200" : "bg-transparent"}`}
                onClick={() => setActive(1)}
            >
                <Image
                    src={user.avatar || avatar ? user.avatar.url || avatar : avatarDefault}
                    alt=''
                    width={20}
                    height={20}
                    className='rounded-full w-5 h-5 object-cover md:h-[30px] md:w-[30px] cursor-pointer'
                />
                <h5 className='pl-2 md:block dark:text-white text-black'>
                    My Account
                </h5>
            </div>
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? " dark:bg-slate-800 bg-slate-200" : "bg-transparent"}`}
                onClick={() => setActive(2)}
            >
                <MdLockPerson size={20} className="dark:text-white text-black" />
                <h5 className="pl-2 md:block dark:text-white text-black">Change Password</h5>
            </div>
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 3 ? " dark:bg-slate-800 bg-slate-200" : "bg-transparent"}`}
                onClick={() => setActive(3)}
            >
                <SiCoursera size={20} className="dark:text-white text-black" />
                <h5 className="pl-2 md:block dark:text-white text-black">Enrolled Courses</h5>
            </div>
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 4 ? " dark:bg-slate-800 bg-slate-200" : "bg-transparent"}`}
                onClick={() => logOutHandler()}
            >
                <FaSignOutAlt size={20} className="dark:text-white text-black" />
                <h5 className="pl-2 md:block dark:text-white text-black">Log out</h5>
            </div>
            {
                user?.role === "admin" && (
                    <Link
                        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 6 ? " dark:bg-slate-800 bg-slate-200" : "bg-transparent"}`}
                        href={'/admin'}
                    >
                        <MdOutlineAdminPanelSettings size={20} className="dark:text-white text-black" />
                        <h5 className="pl-2 md:block dark:text-white text-black">Admin Dashboard</h5>
                    </Link>
                )
            }
        </div >
    )
}

export default SidebarProfile