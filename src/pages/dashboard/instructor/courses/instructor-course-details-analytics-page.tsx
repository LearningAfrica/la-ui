import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	ArrowUpRight,
	Download,
	Users,
	DollarSign,
	Star,
	BarChart2,
} from 'lucide-react';
import {
	Line,
	LineChart,
	Bar,
	BarChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { StatsCard } from '@/components/stats-card';
import { Link, useParams } from 'react-router-dom';

// Mock data for the analytics
const analyticsData = {
	overview: {
		totalEnrollments: 456,
		totalRevenue: '$4,560',
		averageRating: 4.8,
		completionRate: 68,
		totalWatchTime: '1,245 hours',
		activeStudents: 324,
	},
	enrollments: [
		{ date: 'Jan', count: 25 },
		{ date: 'Feb', count: 40 },
		{ date: 'Mar', count: 35 },
		{ date: 'Apr', count: 50 },
		{ date: 'May', count: 45 },
		{ date: 'Jun', count: 60 },
		{ date: 'Jul', count: 75 },
		{ date: 'Aug', count: 90 },
		{ date: 'Sep', count: 85 },
		{ date: 'Oct', count: 70 },
		{ date: 'Nov', count: 65 },
		{ date: 'Dec', count: 55 },
	],
	revenue: [
		{ date: 'Jan', amount: 250 },
		{ date: 'Feb', amount: 400 },
		{ date: 'Mar', amount: 350 },
		{ date: 'Apr', amount: 500 },
		{ date: 'May', amount: 450 },
		{ date: 'Jun', amount: 600 },
		{ date: 'Jul', amount: 750 },
		{ date: 'Aug', amount: 900 },
		{ date: 'Sep', amount: 850 },
		{ date: 'Oct', amount: 700 },
		{ date: 'Nov', amount: 650 },
		{ date: 'Dec', amount: 550 },
	],
	engagement: [
		{ section: 'Getting Started', completion: 92, watchTime: 120 },
		{ section: 'JavaScript Fundamentals', completion: 78, watchTime: 320 },
		{ section: 'Advanced JavaScript Concepts', completion: 65, watchTime: 280 },
		{ section: 'DOM Manipulation', completion: 72, watchTime: 210 },
		{ section: 'Asynchronous JavaScript', completion: 58, watchTime: 240 },
		{ section: 'Modern JavaScript Features', completion: 45, watchTime: 190 },
		{ section: 'Project Work', completion: 38, watchTime: 310 },
	],
	ratings: [
		{ rating: 5, count: 78 },
		{ rating: 4, count: 36 },
		{ rating: 3, count: 10 },
		{ rating: 2, count: 3 },
		{ rating: 1, count: 1 },
	],
	demographics: {
		countries: [
			{ name: 'United States', students: 180 },
			{ name: 'India', students: 95 },
			{ name: 'United Kingdom', students: 45 },
			{ name: 'Canada', students: 35 },
			{ name: 'Germany', students: 25 },
			{ name: 'Other', students: 76 },
		],
		devices: [
			{ name: 'Desktop', percentage: 65 },
			{ name: 'Mobile', percentage: 25 },
			{ name: 'Tablet', percentage: 10 },
		],
	},
	feedback: [
		{ category: 'Content Quality', score: 4.7 },
		{ category: 'Instructor Delivery', score: 4.9 },
		{ category: 'Course Structure', score: 4.5 },
		{ category: 'Practice Exercises', score: 4.3 },
		{ category: 'Support & Responsiveness', score: 4.6 },
	],
};

// Course details
const courseDetails = {
	id: '1',
	title: 'Complete JavaScript Course',
};

export default function CourseAnalyticsPage() {
	const params = useParams<{
		id: string;
	}>();
	const courseId = params.id as string;
	const [dateRange, setDateRange] = useState('last12Months');

	// Stats cards data
	const statsCards = [
		{
			id: 'enrollments',
			value: analyticsData.overview.totalEnrollments.toString(),
			label: 'Total Enrollments',
			description: 'Students enrolled in this course',
		},
		{
			id: 'revenue',
			value: analyticsData.overview.totalRevenue,
			label: 'Total Revenue',
			description: 'Earnings from this course',
		},
		{
			id: 'rating',
			value: analyticsData.overview.averageRating.toString(),
			label: 'Average Rating',
			description: `From ${analyticsData.ratings.reduce((sum, item) => sum + item.count, 0)} reviews`,
		},
		{
			id: 'completion',
			value: `${analyticsData.overview.completionRate}%`,
			label: 'Completion Rate',
			description: 'Students who finished the course',
		},
		{
			id: 'watchTime',
			value: analyticsData.overview.totalWatchTime,
			label: 'Total Watch Time',
			description: 'Cumulative viewing time',
		},
		{
			id: 'activeStudents',
			value: analyticsData.overview.activeStudents.toString(),
			label: 'Active Students',
			description: 'Students active in the last 30 days',
		},
	];

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to={`/dashboard/instructor/courses/${courseId}`}>
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Course
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Course Analytics
					</h1>
					<p className="text-muted-foreground mt-1">{courseDetails.title}</p>
				</div>
				<div className="flex items-center gap-2">
					<Select value={dateRange} onValueChange={setDateRange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select date range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="last30Days">Last 30 Days</SelectItem>
							<SelectItem value="last3Months">Last 3 Months</SelectItem>
							<SelectItem value="last6Months">Last 6 Months</SelectItem>
							<SelectItem value="last12Months">Last 12 Months</SelectItem>
							<SelectItem value="allTime">All Time</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline">
						<Download className="mr-2 h-4 w-4" />
						Export Data
					</Button>
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{statsCards.map((stat) => (
					<StatsCard key={stat.id} stat={stat} />
				))}
			</div>

			{/* Main Analytics Tabs */}
			<Card>
				<CardHeader className="pb-0">
					<Tabs defaultValue="enrollments">
						<TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
							<TabsTrigger value="enrollments">Enrollments</TabsTrigger>
							<TabsTrigger value="revenue">Revenue</TabsTrigger>
							<TabsTrigger value="engagement">Engagement</TabsTrigger>
							<TabsTrigger value="ratings">Ratings</TabsTrigger>
							<TabsTrigger value="demographics">Demographics</TabsTrigger>
							<TabsTrigger value="feedback">Feedback</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardHeader>
				<CardContent className="pt-6">
					<Tabs defaultValue="enrollments">
						{/* Enrollments Tab */}
						<TabsContent value="enrollments" className="space-y-6">
							<div>
								<div className="mb-4 flex items-center justify-between">
									<div>
										<h3 className="text-lg font-medium">Enrollment Trends</h3>
										<p className="text-muted-foreground text-sm">
											Monthly student enrollments
										</p>
									</div>
									<div className="flex items-center text-sm">
										<span className="flex items-center font-medium text-green-600">
											+12.5% <ArrowUpRight className="ml-1 h-3 w-3" />
										</span>
										<span className="text-muted-foreground ml-2">
											vs. previous period
										</span>
									</div>
								</div>
								<div className="h-[350px]">
									<ChartContainer
										config={{
											count: {
												label: 'Enrollments',
												color: 'hsl(var(--chart-1))',
											},
										}}
									>
										<ResponsiveContainer width="100%" height="100%">
											<LineChart data={analyticsData.enrollments}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="date" />
												<YAxis />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Legend />
												<Line
													type="monotone"
													dataKey="count"
													stroke="var(--color-count)"
													strokeWidth={2}
													dot={{ r: 4 }}
													activeDot={{ r: 6 }}
												/>
											</LineChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Enrollment Sources</CardTitle>
										<CardDescription>
											Where your students are coming from
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span>Direct</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">45%</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '45%' }}
														></div>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Search</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">30%</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '30%' }}
														></div>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Referrals</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">15%</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '15%' }}
														></div>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Social Media</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">10%</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '10%' }}
														></div>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Enrollment Insights</CardTitle>
										<CardDescription>Key metrics and trends</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Conversion Rate
													</p>
													<p className="text-2xl font-bold">4.8%</p>
												</div>
												<div className="flex items-center text-green-600">
													+0.6% <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Avg. Acquisition Cost
													</p>
													<p className="text-2xl font-bold">$12.40</p>
												</div>
												<div className="flex items-center text-green-600">
													-$1.20 <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Enrollment Growth
													</p>
													<p className="text-2xl font-bold">+18.5%</p>
												</div>
												<div className="flex items-center text-green-600">
													+2.3% <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Revenue Tab */}
						<TabsContent value="revenue" className="space-y-6">
							<div>
								<div className="mb-4 flex items-center justify-between">
									<div>
										<h3 className="text-lg font-medium">Revenue Trends</h3>
										<p className="text-muted-foreground text-sm">
											Monthly revenue from course sales
										</p>
									</div>
									<div className="flex items-center text-sm">
										<span className="flex items-center font-medium text-green-600">
											+15.2% <ArrowUpRight className="ml-1 h-3 w-3" />
										</span>
										<span className="text-muted-foreground ml-2">
											vs. previous period
										</span>
									</div>
								</div>
								<div className="h-[350px]">
									<ChartContainer
										config={{
											amount: {
												label: 'Revenue ($)',
												color: 'hsl(var(--chart-2))',
											},
										}}
									>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={analyticsData.revenue}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="date" />
												<YAxis />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Legend />
												<Bar
													dataKey="amount"
													fill="var(--color-amount)"
													radius={[4, 4, 0, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Revenue Breakdown</CardTitle>
										<CardDescription>Revenue by pricing tier</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span>Full Price</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">$2,850</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '62%' }}
														></div>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Discounted</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">$1,250</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '27%' }}
														></div>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span>Promotional</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">$460</span>
													<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
														<div
															className="bg-primary h-full"
															style={{ width: '11%' }}
														></div>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Financial Metrics</CardTitle>
										<CardDescription>Key revenue indicators</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Average Revenue Per User
													</p>
													<p className="text-2xl font-bold">$78.50</p>
												</div>
												<div className="flex items-center text-green-600">
													+$3.20 <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Lifetime Value
													</p>
													<p className="text-2xl font-bold">$125.80</p>
												</div>
												<div className="flex items-center text-green-600">
													+$12.40 <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Refund Rate
													</p>
													<p className="text-2xl font-bold">2.3%</p>
												</div>
												<div className="flex items-center text-green-600">
													-0.5% <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Engagement Tab */}
						<TabsContent value="engagement" className="space-y-6">
							<div>
								<div className="mb-4 flex items-center justify-between">
									<div>
										<h3 className="text-lg font-medium">
											Section Completion Rates
										</h3>
										<p className="text-muted-foreground text-sm">
											Percentage of students completing each section
										</p>
									</div>
								</div>
								<div className="h-[350px]">
									<ChartContainer
										config={{
											completion: {
												label: 'Completion (%)',
												color: 'hsl(var(--chart-3))',
											},
											watchTime: {
												label: 'Watch Time (min)',
												color: 'hsl(var(--chart-4))',
											},
										}}
									>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart
												data={analyticsData.engagement}
												layout="vertical"
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis type="number" />
												<YAxis dataKey="section" type="category" width={150} />
												<ChartTooltip content={<ChartTooltipContent />} />
												<Legend />
												<Bar
													dataKey="completion"
													fill="var(--color-completion)"
													radius={[0, 4, 4, 0]}
												/>
												<Bar
													dataKey="watchTime"
													fill="var(--color-watchTime)"
													radius={[0, 4, 4, 0]}
												/>
											</BarChart>
										</ResponsiveContainer>
									</ChartContainer>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Engagement Metrics</CardTitle>
										<CardDescription>
											How students interact with your course
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Avg. Session Duration
													</p>
													<p className="text-2xl font-bold">24 minutes</p>
												</div>
												<div className="flex items-center text-green-600">
													+3 min <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Avg. Sessions Per Student
													</p>
													<p className="text-2xl font-bold">18.5</p>
												</div>
												<div className="flex items-center text-green-600">
													+2.3 <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														Quiz Completion Rate
													</p>
													<p className="text-2xl font-bold">76%</p>
												</div>
												<div className="flex items-center text-green-600">
													+4% <ArrowUpRight className="ml-1 h-3 w-3" />
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Content Engagement</CardTitle>
										<CardDescription>
											Most and least engaging content
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											<div>
												<h4 className="mb-2 font-medium">
													Most Engaging Lessons
												</h4>
												<ol className="space-y-2">
													<li className="flex items-center justify-between">
														<span className="text-sm">
															1. JavaScript Promises Explained
														</span>
														<span className="text-sm font-medium">
															98% completion
														</span>
													</li>
													<li className="flex items-center justify-between">
														<span className="text-sm">
															2. Building Your First App
														</span>
														<span className="text-sm font-medium">
															95% completion
														</span>
													</li>
													<li className="flex items-center justify-between">
														<span className="text-sm">
															3. Debugging Techniques
														</span>
														<span className="text-sm font-medium">
															92% completion
														</span>
													</li>
												</ol>
											</div>
											<div>
												<h4 className="mb-2 font-medium">
													Least Engaging Lessons
												</h4>
												<ol className="space-y-2">
													<li className="flex items-center justify-between">
														<span className="text-sm">
															1. Advanced Design Patterns
														</span>
														<span className="text-sm font-medium">
															42% completion
														</span>
													</li>
													<li className="flex items-center justify-between">
														<span className="text-sm">
															2. Memory Management
														</span>
														<span className="text-sm font-medium">
															48% completion
														</span>
													</li>
													<li className="flex items-center justify-between">
														<span className="text-sm">
															3. Testing Frameworks
														</span>
														<span className="text-sm font-medium">
															52% completion
														</span>
													</li>
												</ol>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						{/* Ratings Tab */}
						<TabsContent value="ratings" className="space-y-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
								<Card className="md:col-span-2">
									<CardHeader>
										<CardTitle>Rating Distribution</CardTitle>
										<CardDescription>
											Breakdown of student ratings
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[300px]">
											<ChartContainer
												config={{
													count: {
														label: 'Number of Ratings',
														color: 'hsl(var(--chart-5))',
													},
												}}
											>
												<ResponsiveContainer width="100%" height="100%">
													<BarChart data={analyticsData.ratings}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="rating" />
														<YAxis />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Legend />
														<Bar
															dataKey="count"
															fill="var(--color-count)"
															radius={[4, 4, 0, 0]}
														/>
													</BarChart>
												</ResponsiveContainer>
											</ChartContainer>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Rating Summary</CardTitle>
										<CardDescription>
											Overall course rating metrics
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex h-full flex-col items-center justify-center">
											<div className="text-6xl font-bold">
												{analyticsData.overview.averageRating}
											</div>
											<div className="mt-2 mb-4 flex items-center">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-5 w-5 ${
															i <
															Math.floor(analyticsData.overview.averageRating)
																? 'fill-yellow-400 text-yellow-400'
																: 'text-gray-300'
														}`}
													/>
												))}
											</div>
											<p className="text-muted-foreground text-sm">
												Based on{' '}
												{analyticsData.ratings.reduce(
													(sum, item) => sum + item.count,
													0,
												)}{' '}
												reviews
											</p>
											<div className="mt-6 w-full space-y-2">
												{analyticsData.ratings
													.slice()
													.reverse()
													.map((rating) => (
														<div
															key={rating.rating}
															className="flex items-center gap-2"
														>
															<div className="flex w-12 items-center gap-1">
																<span>{rating.rating}</span>
																<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
															</div>
															<div className="bg-muted h-2 w-full overflow-hidden rounded-full">
																<div
																	className="h-full bg-yellow-400"
																	style={{
																		width: `${
																			(rating.count /
																				analyticsData.ratings.reduce(
																					(sum, item) => sum + item.count,
																					0,
																				)) *
																			100
																		}%`,
																	}}
																></div>
															</div>
															<span className="text-muted-foreground w-8 text-xs">
																{rating.count}
															</span>
														</div>
													))}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Feedback Categories</CardTitle>
									<CardDescription>
										Student ratings by course aspect
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ChartContainer
											config={{
												score: {
													label: 'Rating Score',
													color: 'hsl(var(--chart-6))',
												},
											}}
										>
											<ResponsiveContainer width="100%" height="100%">
												<BarChart
													data={analyticsData.feedback}
													layout="vertical"
												>
													<CartesianGrid strokeDasharray="3 3" />
													<XAxis type="number" domain={[0, 5]} />
													<YAxis
														dataKey="category"
														type="category"
														width={180}
													/>
													<ChartTooltip content={<ChartTooltipContent />} />
													<Legend />
													<Bar
														dataKey="score"
														fill="var(--color-score)"
														radius={[0, 4, 4, 0]}
													/>
												</BarChart>
											</ResponsiveContainer>
										</ChartContainer>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Demographics Tab */}
						<TabsContent value="demographics" className="space-y-6">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Student Locations</CardTitle>
										<CardDescription>
											Top countries by enrollment
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[300px]">
											<ChartContainer
												config={{
													students: {
														label: 'Number of Students',
														color: 'hsl(var(--chart-7))',
													},
												}}
											>
												<ResponsiveContainer width="100%" height="100%">
													<BarChart
														data={analyticsData.demographics.countries}
														layout="vertical"
													>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis type="number" />
														<YAxis dataKey="name" type="category" width={100} />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Legend />
														<Bar
															dataKey="students"
															fill="var(--color-students)"
															radius={[0, 4, 4, 0]}
														/>
													</BarChart>
												</ResponsiveContainer>
											</ChartContainer>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Device Usage</CardTitle>
										<CardDescription>
											How students access your course
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[300px]">
											<ChartContainer
												config={{
													percentage: {
														label: 'Percentage',
														color: 'hsl(var(--chart-8))',
													},
												}}
											>
												<ResponsiveContainer width="100%" height="100%">
													<BarChart data={analyticsData.demographics.devices}>
														<CartesianGrid strokeDasharray="3 3" />
														<XAxis dataKey="name" />
														<YAxis />
														<ChartTooltip content={<ChartTooltipContent />} />
														<Legend />
														<Bar
															dataKey="percentage"
															fill="var(--color-percentage)"
															radius={[4, 4, 0, 0]}
														/>
													</BarChart>
												</ResponsiveContainer>
											</ChartContainer>
										</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Student Demographics</CardTitle>
									<CardDescription>
										Breakdown of student characteristics
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
										<div>
											<h4 className="mb-4 font-medium">Age Distribution</h4>
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span>18-24</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">25%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '25%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>25-34</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">42%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '42%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>35-44</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">20%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '20%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>45+</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">13%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '13%' }}
															></div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div>
											<h4 className="mb-4 font-medium">Experience Level</h4>
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span>Beginner</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">35%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '35%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>Intermediate</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">45%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '45%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>Advanced</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">20%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '20%' }}
															></div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<div>
											<h4 className="mb-4 font-medium">Learning Goals</h4>
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<span>Career Change</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">30%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '30%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>Skill Enhancement</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">40%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '40%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>Hobby/Interest</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">20%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '20%' }}
															></div>
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													<span>Academic</span>
													<div className="flex items-center gap-2">
														<span className="text-sm">10%</span>
														<div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
															<div
																className="bg-primary h-full"
																style={{ width: '10%' }}
															></div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						{/* Feedback Tab */}
						<TabsContent value="feedback" className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Student Feedback Analysis</CardTitle>
									<CardDescription>
										Common themes from student reviews
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div>
											<h4 className="mb-4 font-medium">Positive Feedback</h4>
											<div className="space-y-4">
												<div className="rounded-lg border p-4">
													<div className="mb-2 flex items-center gap-2">
														<span className="font-medium">
															Clear Explanations
														</span>
														<span className="text-muted-foreground text-sm">
															(mentioned in 45 reviews)
														</span>
													</div>
													<p className="text-sm">
														"The instructor explains complex concepts in a way
														that's easy to understand."
													</p>
												</div>
												<div className="rounded-lg border p-4">
													<div className="mb-2 flex items-center gap-2">
														<span className="font-medium">
															Practical Examples
														</span>
														<span className="text-muted-foreground text-sm">
															(mentioned in 38 reviews)
														</span>
													</div>
													<p className="text-sm">
														"The real-world examples and projects helped me
														apply what I learned immediately."
													</p>
												</div>
												<div className="rounded-lg border p-4">
													<div className="mb-2 flex items-center gap-2">
														<span className="font-medium">
															Comprehensive Content
														</span>
														<span className="text-muted-foreground text-sm">
															(mentioned in 32 reviews)
														</span>
													</div>
													<p className="text-sm">
														"This course covers everything you need to know
														about JavaScript, from basics to advanced."
													</p>
												</div>
											</div>
										</div>

										<div>
											<h4 className="mb-4 font-medium">
												Areas for Improvement
											</h4>
											<div className="space-y-4">
												<div className="rounded-lg border p-4">
													<div className="mb-2 flex items-center gap-2">
														<span className="font-medium">
															More Practice Exercises
														</span>
														<span className="text-muted-foreground text-sm">
															(mentioned in 18 reviews)
														</span>
													</div>
													<p className="text-sm">
														"Would benefit from more hands-on exercises to
														reinforce the concepts."
													</p>
												</div>
												<div className="rounded-lg border p-4">
													<div className="mb-2 flex items-center gap-2">
														<span className="font-medium">Updated Content</span>
														<span className="text-muted-foreground text-sm">
															(mentioned in 12 reviews)
														</span>
													</div>
													<p className="text-sm">
														"Some sections could be updated to cover the latest
														JavaScript features."
													</p>
												</div>
												<div className="rounded-lg border p-4">
													<div className="mb-2 flex items-center gap-2">
														<span className="font-medium">Advanced Topics</span>
														<span className="text-muted-foreground text-sm">
															(mentioned in 10 reviews)
														</span>
													</div>
													<p className="text-sm">
														"Would like to see more advanced topics covered in
														greater depth."
													</p>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Sentiment Analysis</CardTitle>
									<CardDescription>
										AI-powered analysis of student reviews
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
										<div className="flex flex-col items-center">
											<div className="relative h-32 w-32">
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-2xl font-bold">85%</span>
												</div>
												<svg className="h-full w-full" viewBox="0 0 36 36">
													<path
														d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
														fill="none"
														stroke="#eee"
														strokeWidth="2"
													/>
													<path
														d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
														fill="none"
														stroke="hsl(var(--primary))"
														strokeWidth="2"
														strokeDasharray="85, 100"
														strokeLinecap="round"
													/>
												</svg>
											</div>
											<h4 className="mt-2 font-medium">Positive</h4>
										</div>
										<div className="flex flex-col items-center">
											<div className="relative h-32 w-32">
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-2xl font-bold">10%</span>
												</div>
												<svg className="h-full w-full" viewBox="0 0 36 36">
													<path
														d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
														fill="none"
														stroke="#eee"
														strokeWidth="2"
													/>
													<path
														d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
														fill="none"
														stroke="hsl(var(--warning))"
														strokeWidth="2"
														strokeDasharray="10, 100"
														strokeLinecap="round"
													/>
												</svg>
											</div>
											<h4 className="mt-2 font-medium">Neutral</h4>
										</div>
										<div className="flex flex-col items-center">
											<div className="relative h-32 w-32">
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-2xl font-bold">5%</span>
												</div>
												<svg className="h-full w-full" viewBox="0 0 36 36">
													<path
														d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
														fill="none"
														stroke="#eee"
														strokeWidth="2"
													/>
													<path
														d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
														fill="none"
														stroke="hsl(var(--destructive))"
														strokeWidth="2"
														strokeDasharray="5, 100"
														strokeLinecap="round"
													/>
												</svg>
											</div>
											<h4 className="mt-2 font-medium">Negative</h4>
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle>Recommendations</CardTitle>
					<CardDescription>
						AI-powered suggestions to improve your course
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="rounded-lg border p-4">
							<h4 className="mb-2 flex items-center font-medium">
								<BarChart2 className="text-primary mr-2 h-4 w-4" />
								Update Advanced JavaScript Section
							</h4>
							<p className="text-muted-foreground mb-2 text-sm">
								This section has the lowest completion rate (45%). Consider
								breaking it into smaller, more digestible lessons and adding
								more practical examples.
							</p>
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">Impact:</span>
								<span>Potential 15% increase in section completion rate</span>
							</div>
						</div>
						<div className="rounded-lg border p-4">
							<h4 className="mb-2 flex items-center font-medium">
								<Users className="text-primary mr-2 h-4 w-4" />
								Target Marketing to 25-34 Age Group
							</h4>
							<p className="text-muted-foreground mb-2 text-sm">
								This demographic shows the highest engagement and completion
								rates. Consider creating targeted marketing campaigns for this
								audience.
							</p>
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">Impact:</span>
								<span>Potential 20% increase in enrollment</span>
							</div>
						</div>
						<div className="rounded-lg border p-4">
							<h4 className="mb-2 flex items-center font-medium">
								<DollarSign className="text-primary mr-2 h-4 w-4" />
								Optimize Pricing Strategy
							</h4>
							<p className="text-muted-foreground mb-2 text-sm">
								Your conversion rate increases by 35% during promotional
								periods. Consider implementing a tiered pricing strategy with
								more frequent limited-time offers.
							</p>
							<div className="flex items-center gap-2 text-sm">
								<span className="text-primary">Impact:</span>
								<span>Potential 25% increase in revenue</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
