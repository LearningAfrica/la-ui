import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { AchievementBadge as AchievementBadgeType } from '@/lib/types/badge';
import { Progress } from '@/components/ui/progress';

interface AchievementBadgeProps {
	badge: AchievementBadgeType;
	size?: 'sm' | 'md' | 'lg';
	showDetails?: boolean;
	className?: string;
}

const rarityColors = {
	common: 'bg-slate-200 dark:bg-slate-700',
	uncommon: 'bg-green-200 dark:bg-green-900',
	rare: 'bg-blue-200 dark:bg-blue-900',
	epic: 'bg-purple-200 dark:bg-purple-900',
	legendary: 'bg-amber-200 dark:bg-amber-900',
};

const rarityBorders = {
	common: 'border-slate-400 dark:border-slate-500',
	uncommon: 'border-green-500 dark:border-green-600',
	rare: 'border-blue-500 dark:border-blue-600',
	epic: 'border-purple-500 dark:border-purple-600',
	legendary: 'border-amber-500 dark:border-amber-600',
};

export function AchievementBadge({
	badge,
	size = 'md',
	showDetails = false,
	className,
}: AchievementBadgeProps) {
	const isEarned = !!badge.earnedAt;
	const isInProgress =
		!isEarned && badge.progress && badge.progress.current > 0;

	const sizeClasses = {
		sm: 'w-12 h-12',
		md: 'w-20 h-20',
		lg: 'w-28 h-28',
	};

	const detailsSize = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
	};

	return (
		<div className={cn('flex flex-col items-center', className)}>
			<div
				className={cn(
					'relative flex items-center justify-center overflow-hidden rounded-full border-2',
					isEarned
						? rarityBorders[badge.rarity]
						: 'border-gray-300 dark:border-gray-700',
					sizeClasses[size],
				)}
			>
				<div
					className={cn(
						'absolute inset-0 opacity-20',
						isEarned
							? rarityColors[badge.rarity]
							: 'bg-gray-200 dark:bg-gray-800',
					)}
				/>

				{isEarned ? (
					<img
						src={badge.image || '/placeholder.svg'}
						alt={badge.name}
						width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
						height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
						className={cn('z-10', !isEarned && 'opacity-40 grayscale')}
					/>
				) : (
					<div className="text-muted-foreground flex items-center justify-center">
						<span className="text-2xl">?</span>
					</div>
				)}

				{isInProgress && badge.progress && (
					<div className="bg-background/80 absolute right-0 bottom-0 left-0 h-1.5">
						<div
							className="bg-primary h-full"
							style={{
								width: `${(badge.progress.current / badge.progress.required) * 100}%`,
							}}
						/>
					</div>
				)}
			</div>

			{showDetails && (
				<div className="mt-2 text-center">
					<h4 className={cn('font-medium', detailsSize[size])}>
						{badge.name}
						{isEarned && (
							<Badge
								variant="outline"
								className={cn('ml-2', size === 'sm' ? 'px-1 text-[10px]' : '')}
							>
								{badge.rarity}
							</Badge>
						)}
					</h4>

					{isEarned && (
						<p
							className={cn(
								'text-muted-foreground',
								size === 'sm' ? 'text-[10px]' : 'text-xs',
							)}
						>
							Earned {new Date(badge.earnedAt!).toLocaleDateString()}
						</p>
					)}

					{isInProgress && badge.progress && (
						<div className="mt-1 w-full">
							<div className="mb-1 flex justify-between text-xs">
								<span>{badge.progress.current}</span>
								<span>{badge.progress.required}</span>
							</div>
							<Progress
								value={(badge.progress.current / badge.progress.required) * 100}
								className="h-1"
							/>
						</div>
					)}

					{!isEarned && !isInProgress && (
						<p
							className={cn(
								'text-muted-foreground',
								size === 'sm' ? 'text-[10px]' : 'text-xs',
							)}
						>
							Locked
						</p>
					)}
				</div>
			)}
		</div>
	);
}
