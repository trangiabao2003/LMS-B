"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CourseGrid } from "@/components/course/course-grid"
import { Footer } from "@/components/footer"
import { useState } from "react";
import Reviews from "@/components/route/reviews"

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <main className="min-h-screen bg-background">
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        route={route}
        setRoute={setRoute}
      />
      <HeroSection />
      <CourseGrid />
      <Reviews />
      <Footer />
    </main>
  )
}
