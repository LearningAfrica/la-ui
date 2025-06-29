import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Assessment {
	id: string;
	title: string;
	score: number;
	maxScore: number;
	date: string;
	course: string;
}

interface RecentAssessmentsProps {
	assessments: Assessment[];
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Assessments</CardTitle>
				<CardDescription>Your latest quiz and test results</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{assessments.map((assessment) => {
						const percentage = Math.round(
							(assessment.score / assessment.maxScore) * 100,
						);
						let badgeVariant = 'default';

						if (percentage >= 90) badgeVariant = 'success';
						else if (percentage >= 70) badgeVariant = 'default';
						else if (percentage >= 50) badgeVariant = 'warning';
						else badgeVariant = 'destructive';

						return (
							<div
								key={assessment.id}
								className="flex items-center justify-between"
							>
								<div>
									<div className="font-medium">{assessment.title}</div>
									<div className="text-muted-foreground text-sm">
										{assessment.course}
									</div>
									<div className="text-muted-foreground text-xs">
										{assessment.date}
									</div>
								</div>
								<Badge variant={badgeVariant as any} className="ml-auto">
									{assessment.score}/{assessment.maxScore} ({percentage}%)
								</Badge>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
