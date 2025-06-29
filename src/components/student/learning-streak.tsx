import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Flame } from 'lucide-react';

// Mock data for learning streak
const streakData = [
	{ date: 'Apr 14', minutes: 45 },
	{ date: 'Apr 15', minutes: 60 },
	{ date: 'Apr 16', minutes: 30 },
	{ date: 'Apr 17', minutes: 75 },
	{ date: 'Apr 18', minutes: 90 },
	{ date: 'Apr 19', minutes: 45 },
	{ date: 'Apr 20', minutes: 60 },
	{ date: 'Apr 21', minutes: 120 },
];

export function LearningStreak() {
	const currentStreak = 8; // Days
	const longestStreak = 14; // Days

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Learning Streak</CardTitle>
						<CardDescription>Your daily learning consistency</CardDescription>
					</div>
					<div className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500">
						<Flame className="h-4 w-4" />
						<span className="text-sm font-medium">{currentStreak} days</span>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-4 grid grid-cols-2 gap-4">
					<div>
						<p className="text-muted-foreground text-sm font-medium">
							Current Streak
						</p>
						<p className="text-2xl font-bold">{currentStreak} days</p>
					</div>
					<div>
						<p className="text-muted-foreground text-sm font-medium">
							Longest Streak
						</p>
						<p className="text-2xl font-bold">{longestStreak} days</p>
					</div>
				</div>
				<div className="h-[200px]">
					<ChartContainer
						config={{
							minutes: {
								label: 'Minutes',
								color: 'hsl(var(--chart-1))',
							},
						}}
					>
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={streakData}>
								<defs>
									<linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="5%"
											stopColor="var(--color-minutes)"
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor="var(--color-minutes)"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<XAxis dataKey="date" />
								<YAxis />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Area
									type="monotone"
									dataKey="minutes"
									stroke="var(--color-minutes)"
									fillOpacity={1}
									fill="url(#colorMinutes)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</ChartContainer>
				</div>
			</CardContent>
		</Card>
	);
}
