"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, CheckCircle, Clock } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface CourseProgressTrackerProps {
  courseId: string
  courseName: string
  totalLessons: number
  completedLessons: number
  lastLessonId?: string
  nextLessonId?: string
}

export function CourseProgressTracker({
  courseId,
  courseName,
  totalLessons,
  completedLessons,
  lastLessonId,
  nextLessonId,
}: CourseProgressTrackerProps) {
  const [progressPercentage, setProgressPercentage] = useState(0)

  useEffect(() => {
    // Calculate progress percentage
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    setProgressPercentage(percentage)
  }, [completedLessons, totalLessons])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{courseName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              {completedLessons} of {totalLessons} lessons completed
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Estimated time: {(totalLessons - completedLessons) * 15} mins</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {nextLessonId ? (
          <Button className="w-full" asChild>
            <Link href={`/dashboard/student/courses/${courseId}/lessons/${nextLessonId}`}>Continue Learning</Link>
          </Button>
        ) : lastLessonId ? (
          <Button className="w-full" asChild>
            <Link href={`/dashboard/student/courses/${courseId}/lessons/${lastLessonId}`}>Resume Course</Link>
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/dashboard/student/courses/${courseId}`}>Start Course</Link>
          </Button>
        )}

        <Button variant="outline" className="w-full" asChild>
          <Link href={`/dashboard/student/courses/${courseId}`}>
            <BookOpen className="h-4 w-4 mr-2" />
            View Curriculum
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
