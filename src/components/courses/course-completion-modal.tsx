"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Award, Share2, Trophy, Twitter, Facebook, Linkedin, Download, ArrowRight } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AchievementBadge } from "@/components/badges/achievement-badge"
import { useBadgeToast } from "@/components/badges/badge-earned-toast"

interface CourseCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseName: string
  certificateId?: string
  instructorName: string
}

export function CourseCompletionModal({
  isOpen,
  onClose,
  courseId,
  courseName,
  certificateId,
  instructorName,
}: CourseCompletionModalProps) {
  const { showBadgeEarned } = useBadgeToast()

  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0, 0.2) },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0, 0.2) },
        })
      }, 250)

      // Show badge earned toast
      const firstCourseBadge = {
        id: "first-course",
        name: "First Steps",
        description: "Complete your first course",
        category: "completion",
        icon: "graduation-cap",
        image: "/badges/first-course-complete.png",
        earnedAt: new Date().toISOString(),
        rarity: "common",
        criteria: "Complete your first course",
      }

      // In a real app, you would check if this is the user's first course
      // and only show the badge if it is
      setTimeout(() => {
        showBadgeEarned(firstCourseBadge)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isOpen, showBadgeEarned])

  // Mock badge for course completion
  const completionBadge = {
    id: "first-course",
    name: "First Steps",
    description: "Complete your first course",
    category: "completion" as const,
    icon: "graduation-cap",
    image: "/badges/first-course-complete.png",
    earnedAt: new Date().toISOString(),
    rarity: "common" as const,
    criteria: "Complete your first course",
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl sm:text-3xl mt-4">Congratulations!</DialogTitle>
          <DialogDescription className="text-center text-lg">You've successfully completed</DialogDescription>
          <div className="text-center text-xl font-bold mt-1">{courseName}</div>
          <div className="text-center text-sm text-muted-foreground">Taught by {instructorName}</div>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              <Award className="mr-1 h-4 w-4" />
              Course Completed
            </Badge>
            {certificateId && (
              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">
                <Award className="mr-1 h-4 w-4" />
                Certificate Available
              </Badge>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium">Achievement Unlocked</h3>
            <AchievementBadge badge={completionBadge} size="md" showDetails />
          </div>

          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center">
              <Image
                src="/abstract-geometric-certificate.png"
                alt="Achievement"
                width={300}
                height={150}
                className="mix-blend-overlay opacity-50"
              />
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">Share your achievement with your network</div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {certificateId ? (
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/dashboard/student/certificates/${certificateId}`}>
                <Download className="mr-2 h-4 w-4" />
                View Certificate
              </Link>
            </Button>
          ) : (
            <Button disabled className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Certificate Processing
            </Button>
          )}
          <Button variant="outline" className="w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/student/achievements">
              View All Achievements
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
