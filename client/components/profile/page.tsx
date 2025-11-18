"use client"

import { useState } from "react";
import SidebarProfile from "./sidebar-profile";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

type Props = {
  user: any;
}

const Profile = (user: Props) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const {} = useLogOutQuery(undefined, 
    { skip: !logout ? true : false });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  }

  return (
    <div className='w-[85%] flex mx-auto'>
      <div className={`w-[300px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-[#00000015] rounded-[5px] shadow-sm mt-20 mb-20 sticky ${scroll ? "top-[120px]" : "top-[30px]"} left-[30px]`}>
        <SidebarProfile 
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
    </div>
  )
}

export default Profile