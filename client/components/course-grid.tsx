"use client"

import { useState, useMemo } from "react"
import { mockCourses } from "@/lib/mock-courses"
import { CourseCard } from "./course-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function CourseGrid() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const categories = useMemo(() => {
    return Array.from(new Set(mockCourses.map((course) => course.category)))
  }, [])

  const levels = useMemo(() => {
    return Array.from(new Set(mockCourses.map((course) => course.level)))
  }, [])

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || course.category === selectedCategory
      const matchesLevel = !selectedLevel || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [searchQuery, selectedCategory, selectedLevel])

  const hasActiveFilters = searchQuery || selectedCategory || selectedLevel

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Featured Courses</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our most popular courses and start learning today. Choose from a wide variety of topics and skill
            levels.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search courses by title, topic, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-base"
          />
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Level</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                  className="rounded-full"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
                setSelectedLevel(null)
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCourses.length} of {mockCourses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No courses found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
                setSelectedLevel(null)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
