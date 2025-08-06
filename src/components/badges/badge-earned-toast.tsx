import type { AchievementBadge as AchievementBadgeType } from '@/lib/types/badge';
import { AchievementBadge } from './achievement-badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BadgeEarnedToastProps {
  badge: AchievementBadgeType;
}

export function BadgeEarnedToast({ badge }: BadgeEarnedToastProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <AchievementBadge badge={badge} size="sm" />
      <div className="flex-1">
        <h4 className="font-medium">New Badge Earned!</h4>
        <p className="text-muted-foreground text-sm">{badge.name}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/dashboard/student/achievements')}
      >
        View
      </Button>
    </div>
  );
}

export function useBadgeToast() {
  return {
    showBadgeEarned: (badge: AchievementBadgeType) => {
      // TODO: Implement toast notification
      console.log('Badge earned:', badge.name);
    },
  };
}
