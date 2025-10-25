import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, BookOpen } from "lucide-react"
import type { Course } from "@/lib/mock-courses"
import Image from "next/image"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={course.image || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {course.level}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2 text-balance">{course.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{course.instructor}</p>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

        {/* Course Meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{(course.students / 1000).toFixed(1)}K</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.lessons} lessons</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-lg font-bold text-foreground">${course.price}</div>
        <Button size="sm">Enroll</Button>
      </CardFooter>
    </Card>
  )
}
