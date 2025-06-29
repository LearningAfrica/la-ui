import { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	BookOpen,
	Clock,
	Award,
	GraduationCap,
	Calendar,
	FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for the dashboard
const recentCourses = [
	{
		id: '1',
		title: 'Advanced JavaScript Concepts',
		progress: 68,
		lastAccessed: '2 hours ago',
		image: '/javascript-code-abstract.png',
	},
	{
		id: '2',
		title: 'UI/UX Design Fundamentals',
		progress: 42,
		lastAccessed: 'Yesterday',
		image: '/abstract-geometric-shapes.png',
	},
	{
		id: '3',
		title: 'Machine Learning Basics',
		progress: 15,
		lastAccessed: '3 days ago',
		image: '/machine-learning-concept.png',
	},
];

const upcomingEvents = [
	{
		id: '1',
		title: 'JavaScript Group Study',
		date: 'Today',
		time: '3:00 PM - 4:30 PM',
		type: 'Study Group',
	},
	{
		id: '2',
		title: 'Design Critique Session',
		date: 'Tomorrow',
		time: '2:00 PM - 3:00 PM',
		type: 'Workshop',
	},
];

const achievements = [
	{
		id: '1',
		title: 'First Course Completed',
		date: 'Apr 15, 2025',
		icon: '/badges/first-course-complete.png',
	},
	{
		id: '2',
		title: '7-Day Streak',
		date: 'Apr 18, 2025',
		icon: '/badges/seven-day-streak.png',
	},
];

// Learning stats
const learningStats = {
	enrolledCourses: 20,
	completedCourses: 12,
	inProgressCourses: 5,
	totalHours: 86.5,
	streak: 8,
};

export default function StudentDashboard() {
	const [isLoading, setIsLoading] = useState(true);
	const [userName, _] = useState('Student');

	useEffect(() => {
		// Simulate loading
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center p-6">
				<div className="flex flex-col items-center gap-2">
					<div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
					<p className="text-muted-foreground text-sm">
						Loading your dashboard...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back, {userName}
				</h1>
				<p className="text-muted-foreground">
					Here's an overview of your learning progress.
				</p>
			</div>

			{/* Main Dashboard Tabs */}
			<Tabs defaultValue="overview" className="space-y-6">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="courses">My Courses</TabsTrigger>
					<TabsTrigger value="schedule">Schedule</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					{/* Summary Cards */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardContent className="flex flex-row items-center gap-4 p-6">
								<div className="bg-primary/10 rounded-full p-3">
									<BookOpen className="text-primary h-5 w-5" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Enrolled Courses
									</p>
									<p className="text-2xl font-bold">
										{learningStats.enrolledCourses}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="flex flex-row items-center gap-4 p-6">
								<div className="bg-primary/10 rounded-full p-3">
									<GraduationCap className="text-primary h-5 w-5" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Completed
									</p>
									<p className="text-2xl font-bold">
										{learningStats.completedCourses}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="flex flex-row items-center gap-4 p-6">
								<div className="bg-primary/10 rounded-full p-3">
									<Clock className="text-primary h-5 w-5" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Learning Hours
									</p>
									<p className="text-2xl font-bold">
										{learningStats.totalHours}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="flex flex-row items-center gap-4 p-6">
								<div className="bg-primary/10 rounded-full p-3">
									<Award className="text-primary h-5 w-5" />
								</div>
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Current Streak
									</p>
									<p className="text-2xl font-bold">
										{learningStats.streak} days
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Learning Progress */}
					<Card>
						<CardHeader>
							<CardTitle>Learning Progress</CardTitle>
							<CardDescription>Your overall course completion</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm font-medium">Course Completion</span>
									<span className="text-muted-foreground text-sm">
										{learningStats.completedCourses} of{' '}
										{learningStats.enrolledCourses} courses (
										{Math.round(
											(learningStats.completedCourses /
												learningStats.enrolledCourses) *
												100,
										)}
										%)
									</span>
								</div>
								<Progress
									value={Math.round(
										(learningStats.completedCourses /
											learningStats.enrolledCourses) *
											100,
									)}
									className="h-2"
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								<div className="rounded-lg border p-3">
									<div className="text-muted-foreground text-sm font-medium">
										In Progress
									</div>
									<div className="text-2xl font-bold">
										{learningStats.inProgressCourses}
									</div>
								</div>
								<div className="rounded-lg border p-3">
									<div className="text-muted-foreground text-sm font-medium">
										Completed
									</div>
									<div className="text-2xl font-bold">
										{learningStats.completedCourses}
									</div>
								</div>
								<div className="rounded-lg border p-3">
									<div className="text-muted-foreground text-sm font-medium">
										Not Started
									</div>
									<div className="text-2xl font-bold">
										{learningStats.enrolledCourses -
											learningStats.completedCourses -
											learningStats.inProgressCourses}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Continue Learning */}
					<div>
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-semibold">Continue Learning</h2>
							<Button variant="outline" size="sm" asChild>
								<Link to="/dashboard/student/courses">View All Courses</Link>
							</Button>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{recentCourses.map((course) => (
								<Card key={course.id} className="overflow-hidden">
									<div className="aspect-video w-full overflow-hidden">
										<img
											src={course.image || '/placeholder.svg'}
											alt={course.title}
											className="h-full w-full object-cover transition-transform hover:scale-105"
										/>
									</div>
									<CardContent className="p-6">
										<h3 className="mb-2 line-clamp-1 text-lg font-semibold">
											{course.title}
										</h3>
										<div className="mb-4">
											<div className="flex justify-between text-sm">
												<span>Progress</span>
												<span>{course.progress}%</span>
											</div>
											<Progress value={course.progress} className="h-2" />
										</div>
										<p className="text-muted-foreground text-sm">
											Last accessed {course.lastAccessed}
										</p>
									</CardContent>
									<CardFooter className="bg-muted/50 border-t px-6 py-3">
										<Button asChild className="w-full">
											<Link to={`/dashboard/student/courses/${course.id}`}>
												Continue
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</TabsContent>

				{/* Courses Tab */}
				<TabsContent value="courses" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>My Courses</CardTitle>
							<CardDescription>All your enrolled courses</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentCourses.map((course) => (
									<div
										key={course.id}
										className="flex items-center gap-4 rounded-lg border p-4"
									>
										<div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
											<img
												src={course.image || '/placeholder.svg'}
												alt={course.title}
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="min-w-0 flex-1">
											<h3 className="line-clamp-1 font-medium">
												{course.title}
											</h3>
											<div className="mt-1">
												<div className="flex justify-between text-sm">
													<span>Progress</span>
													<span>{course.progress}%</span>
												</div>
												<Progress value={course.progress} className="h-2" />
											</div>
										</div>
										<Button asChild size="sm">
											<Link to={`/dashboard/student/courses/${course.id}`}>
												Continue
											</Link>
										</Button>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter>
							<Button asChild variant="outline" className="w-full">
								<Link to="/dashboard/student/courses">View All Courses</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Schedule Tab */}
				<TabsContent value="schedule" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Upcoming Events</CardTitle>
								<CardDescription>
									Your scheduled events and deadlines
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{upcomingEvents.map((event) => (
										<div key={event.id} className="flex items-start space-x-3">
											<div className="bg-primary/10 rounded-md p-2">
												<Calendar className="text-primary h-4 w-4" />
											</div>
											<div>
												<p className="font-medium">{event.title}</p>
												<p className="text-muted-foreground text-sm">
													{event.date} • {event.time}
												</p>
												<p className="text-muted-foreground mt-1 text-xs">
													{event.type}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
							<CardFooter>
								<Button asChild variant="outline" className="w-full">
									<Link to="/dashboard/student/calendar">View Calendar</Link>
								</Button>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Recent Achievements</CardTitle>
								<CardDescription>Your learning milestones</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{achievements.map((achievement) => (
										<div
											key={achievement.id}
											className="flex items-center space-x-3"
										>
											<div className="bg-primary/10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
												<img
													src={achievement.icon || '/placeholder.svg'}
													alt={achievement.title}
													className="h-8 w-8 object-cover"
													onError={(e) => {
														e.currentTarget.src =
															'/badges/first-course-complete.png';
													}}
												/>
											</div>
											<div>
												<p className="font-medium">{achievement.title}</p>
												<p className="text-muted-foreground text-sm">
													{achievement.date}
												</p>
											</div>
										</div>
									))}
								</div>
							</CardContent>
							<CardFooter>
								<Button asChild variant="outline" className="w-full">
									<Link to="/dashboard/student/achievements">
										View All Achievements
									</Link>
								</Button>
							</CardFooter>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
						<Button
							variant="outline"
							className="flex h-24 flex-col items-center justify-center gap-1"
							asChild
						>
							<Link to="/dashboard/student/courses">
								<BookOpen className="h-5 w-5" />
								<span>My Courses</span>
							</Link>
						</Button>
						<Button
							variant="outline"
							className="flex h-24 flex-col items-center justify-center gap-1"
							asChild
						>
							<Link to="/dashboard/student/calendar">
								<Calendar className="h-5 w-5" />
								<span>Calendar</span>
							</Link>
						</Button>
						<Button
							variant="outline"
							className="flex h-24 flex-col items-center justify-center gap-1"
							asChild
						>
							<Link to="/dashboard/student/achievements">
								<Award className="h-5 w-5" />
								<span>Achievements</span>
							</Link>
						</Button>
						<Button
							variant="outline"
							className="flex h-24 flex-col items-center justify-center gap-1"
							asChild
						>
							<Link to="/dashboard/student/support/tickets">
								<FileText className="h-5 w-5" />
								<span>Support</span>
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
