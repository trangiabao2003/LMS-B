"use client"

import React, { useState } from 'react'
import Heading from './utils/Heading'
import Header from './components/Header'

type Props = {}

export default function Page({ }: Props) {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div>
      <Heading
        title="Elearning"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="programming, MERN, Redux, Machine learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem} />
    </div>
  )
}