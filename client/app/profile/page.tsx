"use client"

import { Header } from '@/components/header'
import Protected from '@/hooks/use-protected';
import { useState } from 'react'

type Props = {}

const page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

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
      </Protected>
    </div>
  )
}

export default page