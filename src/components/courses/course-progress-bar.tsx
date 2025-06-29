import { Progress } from '@/components/ui/progress';

interface CourseProgressBarProps {
	progress: number;
	size?: 'sm' | 'md' | 'lg';
	showPercentage?: boolean;
	className?: string;
}

export function CourseProgressBar({
	progress,
	size = 'md',
	showPercentage = true,
	className = '',
}: CourseProgressBarProps) {
	// Ensure progress is between 0 and 100
	const normalizedProgress = Math.min(100, Math.max(0, progress));

	// Determine height based on size
	const heightClass = size === 'sm' ? 'h-1' : size === 'md' ? 'h-2' : 'h-3';

	return (
		<div className={`space-y-1 ${className}`}>
			{showPercentage && (
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Progress</span>
					<span className="font-medium">{normalizedProgress}%</span>
				</div>
			)}
			<Progress value={normalizedProgress} className={heightClass} />
		</div>
	);
}
