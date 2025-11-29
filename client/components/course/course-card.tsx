import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Clock, BookOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CourseCardProps {
  course: any
  isProfile?: boolean
}

export function CourseCard({ course, isProfile = false }: CourseCardProps) {
  // Calculate total lessons from courseData
  const totalLessons = course.courseData?.length || 0
  
  // Calculate total duration from courseData (in hours)
  const totalDuration = course.courseData?.reduce((acc: number, item: any) => {
    return acc + (item.videoLength || 0)
  }, 0) || 0
  
  const durationInHours = (totalDuration / 60).toFixed(1)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <Image
          src={course.thumbnail?.url || "/placeholder.svg"}
          alt={course.name}
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
          <h3 className="font-semibold text-foreground line-clamp-2 text-balance">{course.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{course.categories}</p>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

        {/* Course Meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{course.purchased || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{durationInHours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{totalLessons} lessons</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-lg font-bold text-foreground">
          {course.price === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <>${course.price}</>
          )}
        </div>
        {!isProfile && (
          <Link href={`/course/${course._id}`}>
            <Button size="sm">Enroll</Button>
          </Link>
        )}
        {isProfile && (
          <Link href={`/course/${course._id}`}>
            <Button size="sm" variant="outline">Continue</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}