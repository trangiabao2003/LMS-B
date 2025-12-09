"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CourseGrid } from "@/components/course/course-grid"
import { Footer } from "@/components/footer"
import { useState } from "react";
import Reviews from "@/components/route/reviews"
import FAQ from "@/components/faq/faq"
import { Heading } from "./utils/Heading"

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  return (
    <main className="min-h-screen bg-background">
      <Heading
        title="LMSB - Buoc tiep di 4 life"
      />
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
      <FAQ />
      <Footer />
    </main>
  )
}
