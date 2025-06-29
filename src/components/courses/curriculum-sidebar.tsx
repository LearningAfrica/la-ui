"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { CheckCircle, Clock, FileText, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  title: string
  duration: string
  type: string
  isCompleted: boolean
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface CurriculumSidebarProps {
  courseId: string
  sections: Section[]
  currentLessonId: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function CurriculumSidebar({
  courseId,
  sections,
  currentLessonId,
  isOpen,
  onClose,
  className,
}: CurriculumSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Calculate progress
  const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0)
  const completedLessons = sections.reduce(
    (acc, section) => acc + section.lessons.filter((lesson) => lesson.isCompleted).length,
    0,
  )
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  // Get lesson icon based on type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />
      case "quiz":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-background transition-transform duration-300 ease-in-out lg:relative lg:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold">Course Content</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex flex-col p-4">
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Your progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8.5rem)]">
          <div className="px-4 pb-12">
            {sections.map((section) => (
              <div key={section.id} className="mb-4">
                <h3 className="mb-2 font-medium">{section.title}</h3>
                <ul className="space-y-1">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === currentLessonId
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/dashboard/student/courses/${courseId}/lessons/${lesson.id}`}
                          className={cn(
                            "flex items-center rounded-md p-2 text-sm",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          <div className="mr-2 flex h-5 w-5 items-center justify-center">
                            {lesson.isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              getLessonIcon(lesson.type)
                            )}
                          </div>
                          <span className="flex-1 truncate">{lesson.title}</span>
                          <span className="ml-2 flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {lesson.duration}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
