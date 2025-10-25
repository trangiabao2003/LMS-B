import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CourseGrid } from "@/components/course-grid"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CourseGrid />
      <Footer />
    </main>
  )
}
