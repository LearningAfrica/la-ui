import { useState } from 'react';
import {
	CalendarDays,
	Clock,
	GraduationCap,
	MoreVertical,
	BookOpen,
	BarChart3,
	TrendingUp,
	CheckCircle2,
} from 'lucide-react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CourseCard } from '@/components/course-card';
import { Link } from 'react-router-dom';

// Sample data - in a real app this would come from an API
const activeCourses = [
	{
		id: 'c1',
		title: 'Introduction to Web Development',
		description:
			'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
		image: '/javascript-code-abstract.png',
		instructor: 'Jane Smith',
		rating: 4.8,
		students: 1243,
		price: 49.99,
		category: 'Programming',
		progress: 45,
		lastAccessed: '2 days ago',
		nextLesson: 'CSS Flexbox and Grid',
	},
	{
		id: 'c2',
		title: 'Advanced JavaScript Patterns',
		description:
			'Master advanced JavaScript patterns and techniques used in modern web applications.',
		image: '/coding-javascript.png',
		instructor: 'John Doe',
		rating: 4.9,
		students: 876,
		price: 69.99,
		category: 'Programming',
		progress: 23,
		lastAccessed: 'Yesterday',
		nextLesson: 'Asynchronous JavaScript',
	},
];

const recommendedCourses = [
	{
		id: 'c3',
		title: 'React Framework Fundamentals',
		description:
			'Build modern UIs with React, the popular JavaScript library for building user interfaces.',
		image: '/abstract-blue-burst.png',
		instructor: 'Sarah Johnson',
		rating: 4.7,
		students: 2354,
		price: 59.99,
		category: 'Programming',
	},
	{
		id: 'c4',
		title: 'Node.js Backend Development',
		description:
			'Learn to build scalable backend applications with Node.js and Express.',
		image: '/abstract-geometric-shapes.png',
		instructor: 'Michael Chen',
		rating: 4.6,
		students: 1879,
		price: 64.99,
		category: 'Programming',
	},
	{
		id: 'c5',
		title: 'Full Stack Project: E-Commerce Site',
		description:
			'Apply your skills to build a complete e-commerce site from scratch.',
		image: '/abstract-geometric-sm.png',
		instructor: 'Alex Rodriguez',
		rating: 4.9,
		students: 954,
		price: 79.99,
		category: 'Programming',
	},
];

const learningStats = {
	hoursThisWeek: 12.5,
	coursesCompleted: 3,
	currentStreak: 8,
	totalLessonsCompleted: 78,
	certificatesEarned: 2,
	skillsLearned: 14,
};

export default function StudentLearningPage() {
	const [filter, setFilter] = useState('all');

	return (
		<div className="space-y-6 p-6 pb-16">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
				<p className="text-muted-foreground">
					Track your progress and continue your learning journey
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Learning Hours
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">
									{learningStats.hoursThisWeek}h
								</p>
								<p className="text-muted-foreground text-xs">This week</p>
							</div>
							<Clock className="text-muted-foreground h-8 w-8" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Courses Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">
									{learningStats.coursesCompleted}
								</p>
								<p className="text-muted-foreground text-xs">Total completed</p>
							</div>
							<GraduationCap className="text-muted-foreground h-8 w-8" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Current Streak
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">
									{learningStats.currentStreak} days
								</p>
								<p className="text-muted-foreground text-xs">Keep it going!</p>
							</div>
							<TrendingUp className="text-muted-foreground h-8 w-8" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">
							Lessons Completed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">
									{learningStats.totalLessonsCompleted}
								</p>
								<p className="text-muted-foreground text-xs">Total completed</p>
							</div>
							<CheckCircle2 className="text-muted-foreground h-8 w-8" />
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold tracking-tight">
						Continue Learning
					</h2>
					<Select defaultValue={filter} onValueChange={setFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Courses</SelectItem>
							<SelectItem value="in-progress">In Progress</SelectItem>
							<SelectItem value="not-started">Not Started</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{activeCourses.map((course) => (
						<Card key={course.id} className="flex flex-col">
							<div className="flex h-32 md:h-48">
								<div className="w-1/3">
									<img
										src={course.image || '/placeholder.svg'}
										alt={course.title}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="flex w-2/3 flex-col p-4">
									<div className="flex items-start justify-between">
										<h3 className="line-clamp-1 font-semibold">
											{course.title}
										</h3>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon" className="h-8 w-8">
													<MoreVertical className="h-4 w-4" />
													<span className="sr-only">More</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem>Mark as complete</DropdownMenuItem>
												<DropdownMenuItem>Add to favorites</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem>Unenroll</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									<p className="text-muted-foreground mb-2 text-sm">
										{course.instructor}
									</p>
									<div className="mt-auto">
										<div className="mb-1 flex items-center justify-between text-xs">
											<span>Progress</span>
											<span>{course.progress}%</span>
										</div>
										<Progress value={course.progress} className="h-1" />
										<div className="mt-2 flex items-center justify-between">
											<span className="text-muted-foreground flex items-center gap-1 text-xs">
												<CalendarDays className="h-3 w-3" /> Last:{' '}
												{course.lastAccessed}
											</span>
											<Badge variant="outline" className="text-xs">
												{course.category}
											</Badge>
										</div>
									</div>
								</div>
							</div>
							<CardFooter className="flex justify-between border-t p-4">
								<div className="text-muted-foreground text-xs">
									<span className="font-medium">Next:</span> {course.nextLesson}
								</div>
								<Button size="sm" className="h-8" asChild>
									<Link
										to={`/dashboard/student/courses/${course.id}/lessons/1`}
									>
										Continue
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>

			<Tabs defaultValue="recommendations" className="w-full">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold tracking-tight">
						Grow Your Skills
					</h2>
					<TabsList>
						<TabsTrigger value="recommendations">Recommendations</TabsTrigger>
						<TabsTrigger value="trending">Trending</TabsTrigger>
						<TabsTrigger value="wishlist">Wishlist</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="recommendations" className="mt-4">
					<div className="grid gap-6 md:grid-cols-3">
						{recommendedCourses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</TabsContent>
				<TabsContent value="trending" className="mt-4">
					<div className="rounded-md border p-8 text-center">
						<BookOpen className="text-muted-foreground mx-auto h-12 w-12" />
						<h3 className="mt-4 text-lg font-medium">
							Trending courses will appear here
						</h3>
						<p className="text-muted-foreground mt-2 text-sm">
							We'll show you popular courses in your areas of interest
						</p>
					</div>
				</TabsContent>
				<TabsContent value="wishlist" className="mt-4">
					<div className="rounded-md border p-8 text-center">
						<BookOpen className="text-muted-foreground mx-auto h-12 w-12" />
						<h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
						<p className="text-muted-foreground mt-2 text-sm">
							Save courses you're interested in by adding them to your wishlist
						</p>
						<Button className="mt-4" variant="outline">
							Browse courses
						</Button>
					</div>
				</TabsContent>
			</Tabs>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold tracking-tight">
						Learning Analytics
					</h2>
					<Button variant="outline" size="sm">
						<BarChart3 className="mr-2 h-4 w-4" />
						View detailed stats
					</Button>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="pb-0">
							<CardTitle>Learning Activity</CardTitle>
							<CardDescription>Your weekly learning pattern</CardDescription>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="flex h-[120px] items-end gap-2 pb-2">
								{[40, 20, 60, 35, 80, 45, 30].map((height, i) => (
									<div
										key={i}
										className="bg-primary/90 w-full rounded-sm"
										style={{ height: `${height}%` }}
									></div>
								))}
							</div>
							<div className="text-muted-foreground flex justify-between text-xs">
								<div>Mon</div>
								<div>Tue</div>
								<div>Wed</div>
								<div>Thu</div>
								<div>Fri</div>
								<div>Sat</div>
								<div>Sun</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-0">
							<CardTitle>Certificates</CardTitle>
							<CardDescription>Earned achievements</CardDescription>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold">
										{learningStats.certificatesEarned}
									</p>
									<p className="text-muted-foreground text-xs">
										Certificates earned
									</p>
								</div>
							</div>
							<Separator className="my-4" />
							<div className="flex justify-between text-sm">
								<span>View all certificates</span>
								<span className="text-primary cursor-pointer font-medium">
									→
								</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-0">
							<CardTitle>Skills Learned</CardTitle>
							<CardDescription>Your growing skill set</CardDescription>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold">
										{learningStats.skillsLearned}
									</p>
									<p className="text-muted-foreground text-xs">
										Skills tracked
									</p>
								</div>
							</div>
							<div className="mt-4 flex flex-wrap gap-1">
								<Badge variant="secondary">HTML</Badge>
								<Badge variant="secondary">CSS</Badge>
								<Badge variant="secondary">JavaScript</Badge>
								<Badge variant="secondary">React</Badge>
								<Badge variant="outline" className="cursor-pointer">
									+10 more
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-0">
							<CardTitle>Learning Goals</CardTitle>
							<CardDescription>Your targets for this month</CardDescription>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="space-y-4">
								<div>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span>Weekly hours (10h / 15h)</span>
										<span>67%</span>
									</div>
									<Progress value={67} className="h-1" />
								</div>
								<div>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span>Courses completed (1 / 2)</span>
										<span>50%</span>
									</div>
									<Progress value={50} className="h-1" />
								</div>
								<div>
									<div className="mb-1 flex items-center justify-between text-xs">
										<span>Daily streak (8 / 10 days)</span>
										<span>80%</span>
									</div>
									<Progress value={80} className="h-1" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
