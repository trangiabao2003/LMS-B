"use client"

import { Header } from '@/components/header'
import Profile from '@/components/profile/profile';
import Protected from '@/hooks/use-protected';
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

type Props = {
  user: any;
}

const page = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(5);
  const [route, setRoute] = useState("Login");
  const { user: reduxUser } = useSelector((state: any) => state.auth);
  const currentUser = reduxUser || user;

  useEffect(() => {
    if (currentUser?.name) {
      document.title = `${currentUser.name} profile - LMSB`;
    }
  }, [currentUser?.name]);

  return (
    <div>
      <Protected>
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          route={route}
          setRoute={setRoute}
        />
        <Profile user={currentUser} />
      </Protected>
    </div>
  )
}

export default page