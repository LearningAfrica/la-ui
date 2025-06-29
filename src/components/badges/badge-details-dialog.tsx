"use client"

import type { AchievementBadge as AchievementBadgeType } from "@/types/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AchievementBadge } from "./achievement-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

interface BadgeDetailsDialogProps {
  badge: AchievementBadgeType | null
  isOpen: boolean
  onClose: () => void
}

export function BadgeDetailsDialog({ badge, isOpen, onClose }: BadgeDetailsDialogProps) {
  if (!badge) return null

  const isEarned = !!badge.earnedAt

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Badge Details</DialogTitle>
          <DialogDescription className="text-center">
            {isEarned ? "You've earned this badge!" : "Keep working to earn this badge"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <AchievementBadge badge={badge} size="lg" />

          <div className="mt-4 text-center">
            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
              {badge.name}
              <Badge variant="outline" className={`capitalize ${isEarned ? "bg-primary/10 text-primary" : ""}`}>
                {badge.rarity}
              </Badge>
            </h3>

            <p className="mt-2 text-muted-foreground">{badge.description}</p>

            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="font-medium mb-1">How to earn</h4>
              <p className="text-sm">{badge.criteria}</p>
            </div>

            {isEarned && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Earned on {new Date(badge.earnedAt!).toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </div>
            )}

            {!isEarned && badge.progress && (
              <div className="mt-4">
                <p className="text-sm font-medium">
                  Progress: {badge.progress.current} / {badge.progress.required}
                </p>
                <div className="w-full bg-muted h-2 rounded-full mt-1">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
