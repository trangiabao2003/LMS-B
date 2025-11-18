"use client"

import { Header } from '@/components/header'
import Profile from '@/components/profile/page';
import Protected from '@/hooks/use-protected';
import { useState } from 'react'

type Props = {
  user: any;
}

const page = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Protected>
        <Header
          // title="Profile"
          // description="Explore your personalized profile page on our Learning Management System (LMS). Access your courses, track your progress, and manage your account settings all in one place."
          // keywords="Programming, Machine Learning, Data Science, AI, Courses"
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          route={route}
          setRoute={setRoute}
        />
        <Profile
          user={user} />
      </Protected>
    </div>
  )
}

export default page