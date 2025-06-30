import type { AchievementBadge as AchievementBadgeType } from '@/types/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AchievementBadge } from './achievement-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface BadgeDetailsDialogProps {
  badge: AchievementBadgeType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeDetailsDialog({
  badge,
  isOpen,
  onClose,
}: BadgeDetailsDialogProps) {
  if (!badge) return null;

  const isEarned = !!badge.earnedAt;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Badge Details</DialogTitle>
          <DialogDescription className="text-center">
            {isEarned
              ? "You've earned this badge!"
              : 'Keep working to earn this badge'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <AchievementBadge badge={badge} size="lg" />

          <div className="mt-4 text-center">
            <h3 className="flex items-center justify-center gap-2 text-xl font-bold">
              {badge.name}
              <Badge
                variant="outline"
                className={`capitalize ${isEarned ? 'bg-primary/10 text-primary' : ''}`}
              >
                {badge.rarity}
              </Badge>
            </h3>

            <p className="text-muted-foreground mt-2">{badge.description}</p>

            <div className="bg-muted mt-4 rounded-md p-3">
              <h4 className="mb-1 font-medium">How to earn</h4>
              <p className="text-sm">{badge.criteria}</p>
            </div>

            {isEarned && (
              <div className="mt-4">
                <p className="text-muted-foreground text-sm">
                  Earned on {new Date(badge.earnedAt!).toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Achievement
                </Button>
              </div>
            )}

            {!isEarned && badge.progress && (
              <div className="mt-4">
                <p className="text-sm font-medium">
                  Progress: {badge.progress.current} / {badge.progress.required}
                </p>
                <div className="bg-muted mt-1 h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(badge.progress.current / badge.progress.required) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
