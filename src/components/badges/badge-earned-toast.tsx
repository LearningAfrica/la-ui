"use client"

import type { AchievementBadge as AchievementBadgeType } from "@/types/badge"
import { AchievementBadge } from "./achievement-badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface BadgeEarnedToastProps {
  badge: AchievementBadgeType
}

export function BadgeEarnedToast({ badge }: BadgeEarnedToastProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <AchievementBadge badge={badge} size="sm" />
      <div className="flex-1">
        <h4 className="font-medium">New Badge Earned!</h4>
        <p className="text-sm text-muted-foreground">{badge.name}</p>
      </div>
      <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/student/achievements")}>
        View
      </Button>
    </div>
  )
}

export function useBadgeToast() {
  const { toast } = useToast()

  return {
    showBadgeEarned: (badge: AchievementBadgeType) => {
      toast({
        title: "Achievement Unlocked!",
        description: <BadgeEarnedToast badge={badge} />,
        duration: 5000,
      })
    },
  }
}
