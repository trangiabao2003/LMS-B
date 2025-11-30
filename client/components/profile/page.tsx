"use client"

import { useState } from "react";
import SidebarProfile from "./sidebar-profile";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./profile-info";
import ChangePassword from "./change-password";

type Props = {
  user: any;
}

const Profile = ({ user }: Props) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const { } = useLogOutQuery(undefined,
    { skip: !logout ? true : false });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  }

  return (
    <div className='w-full min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <div className={`w-full lg:w-[300px] lg:sticky ${scroll ? "lg:top-[120px]" : "lg:top-[30px]"}`}>
            <div className='dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-[#00000015] rounded-[5px] shadow-sm'>
              <SidebarProfile
                user={user}
                active={active}
                avatar={avatar}
                setActive={setActive}
                logOutHandler={logOutHandler}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {active === 1 && (
              <div className='bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6'>
                <ProfileInfo avatar={avatar} user={user} />
              </div>
            )}
             {active === 2 && (
              <div className='bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6'>
                <ChangePassword />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile