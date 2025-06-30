import type { AchievementBadge as AchievementBadgeType } from '@/lib/types/badge';
import { AchievementBadge } from './achievement-badge';
import { cn } from '@/lib/utils';

interface BadgeCollectionProps {
  badges: AchievementBadgeType[];
  title?: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  emptyMessage?: string;
}

export function BadgeCollection({
  badges,
  title,
  showDetails = true,
  size = 'md',
  className,
  emptyMessage = 'No badges earned yet',
}: BadgeCollectionProps) {
  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-lg font-medium">{title}</h3>}

      {badges.length > 0 ? (
        <div
          className={cn(
            'grid gap-4',
            size === 'sm'
              ? 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10'
              : size === 'md'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {badges.map((badge) => (
            <AchievementBadge
              key={badge.id}
              badge={badge}
              size={size}
              showDetails={showDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 flex h-32 items-center justify-center rounded-lg">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
