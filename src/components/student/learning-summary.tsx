import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LearningSummaryProps {
	totalCourses: number;
	completedCourses: number;
	inProgressCourses: number;
	totalHours: number;
	averageScore: number;
	streak: number;
}

export function LearningSummary({
	totalCourses,
	completedCourses,
	inProgressCourses,
	totalHours,
	averageScore,
	streak,
}: LearningSummaryProps) {
	const completionPercentage =
		Math.round((completedCourses / totalCourses) * 100) || 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Learning Summary</CardTitle>
				<CardDescription>
					Your overall learning progress and statistics
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<div className="flex justify-between">
						<span className="text-sm font-medium">Course Completion</span>
						<span className="text-muted-foreground text-sm">
							{completedCourses} of {totalCourses} courses (
							{completionPercentage}%)
						</span>
					</div>
					<Progress value={completionPercentage} className="h-2" />
				</div>

				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
					<div className="rounded-lg border p-3">
						<div className="text-muted-foreground text-sm font-medium">
							In Progress
						</div>
						<div className="text-2xl font-bold">{inProgressCourses}</div>
					</div>
					<div className="rounded-lg border p-3">
						<div className="text-muted-foreground text-sm font-medium">
							Total Hours
						</div>
						<div className="text-2xl font-bold">{totalHours}</div>
					</div>
					<div className="rounded-lg border p-3">
						<div className="text-muted-foreground text-sm font-medium">
							Avg. Score
						</div>
						<div className="text-2xl font-bold">{averageScore}%</div>
					</div>
					<div className="rounded-lg border p-3 sm:col-span-3">
						<div className="text-muted-foreground text-sm font-medium">
							Current Streak
						</div>
						<div className="flex items-center">
							<div className="text-2xl font-bold">{streak} days</div>
							<div className="ml-2 flex">
								{Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
									<div
										key={i}
										className="bg-primary ml-1 h-2 w-2 rounded-full"
										style={{
											opacity: 0.5 + i / 10,
										}}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
