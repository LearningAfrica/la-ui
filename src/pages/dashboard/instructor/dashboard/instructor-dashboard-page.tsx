import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
	BarChart3,
	BookOpen,
	Clock,
	DollarSign,
	MessageSquare,
	Users,
	Plus,
	GraduationCap,
} from 'lucide-react';
// import type { CourseStatus } from '@/lib/types/course';
import { useAuth } from '@/hooks/use-auth.tsx';
import { Link } from 'react-router-dom';

// Mock data
// const courseData = [
// 	{
// 		id: '1',
// 		title: 'Complete JavaScript Course',
// 		status: 'published' as CourseStatus,
// 		students: 1245,
// 		rating: 4.8,
// 		revenue: '$4,560',
// 		image: '/javascript-code-abstract.png',
// 		lastUpdated: '2023-10-15',
// 	},
// 	{
// 		id: '2',
// 		title: 'Advanced React Patterns',
// 		status: 'in-review' as CourseStatus,
// 		students: 0,
// 		rating: 0,
// 		revenue: '$0',
// 		image: '/abstract-geometric-shapes.png',
// 		lastUpdated: '2024-02-01',
// 	},
// 	{
// 		id: '3',
// 		title: 'Introduction to Python',
// 		status: 'draft' as CourseStatus,
// 		students: 0,
// 		rating: 0,
// 		revenue: '$0',
// 		image: '/abstract-blue-burst.png',
// 		lastUpdated: '2024-01-20',
// 		completionPercentage: 65,
// 	},
// 	{
// 		id: '4',
// 		title: 'UI/UX Design Fundamentals',
// 		status: 'rejected' as CourseStatus,
// 		students: 0,
// 		rating: 0,
// 		revenue: '$0',
// 		image: '/abstract-southwest.png',
// 		lastUpdated: '2024-01-15',
// 		rejectionReason: 'Content needs more practical examples and exercises.',
// 	},
// ];

// const _recentStudents = [
// 	{
// 		id: 's1',
// 		name: 'John Smith',
// 		email: 'john.smith@example.com',
// 		course: 'Complete JavaScript Course',
// 		courseId: '1',
// 		enrolledDate: '2024-01-28',
// 		image: '/abstract-aj.png',
// 	},
// 	{
// 		id: 's2',
// 		name: 'Sarah Johnson',
// 		email: 'sarah.johnson@example.com',
// 		course: 'Advanced React Patterns',
// 		courseId: '2',
// 		enrolledDate: '2024-02-05',
// 		image: '/abstract-bw.png',
// 	},
// 	{
// 		id: 's3',
// 		name: 'Emily Davis',
// 		email: 'emily.davis@example.com',
// 		course: 'Introduction to Python',
// 		courseId: '3',
// 		enrolledDate: '2024-02-10',
// 		image: '/abstract-city.png',
// 	},
// ];

export default function InstructorDashboardPage() {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState('overview');

	// Mock data for instructor dashboard
	const stats = [
		{
			title: 'Total Students',
			value: '1,234',
			icon: <Users className="text-muted-foreground h-5 w-5" />,
			change: '+12%',
			trend: 'up',
		},
		{
			title: 'Total Revenue',
			value: '$12,345',
			icon: <DollarSign className="text-muted-foreground h-5 w-5" />,
			change: '+23%',
			trend: 'up',
		},
		{
			title: 'Active Courses',
			value: '8',
			icon: <BookOpen className="text-muted-foreground h-5 w-5" />,
			change: '+2',
			trend: 'up',
		},
		{
			title: 'Avg. Rating',
			value: '4.8',
			icon: <BarChart3 className="text-muted-foreground h-5 w-5" />,
			change: '+0.2',
			trend: 'up',
		},
	];

	const courses = [
		{
			id: '1',
			title: 'Complete JavaScript Course',
			students: 456,
			rating: 4.8,
			revenue: '$4,560',
			lastUpdated: '2023-10-15',
			status: 'published',
		},
		{
			id: '2',
			title: 'React Native for Beginners',
			students: 328,
			rating: 4.7,
			revenue: '$3,280',
			lastUpdated: '2023-11-20',
			status: 'published',
		},
		{
			id: '3',
			title: 'Advanced TypeScript Patterns',
			students: 215,
			rating: 4.9,
			revenue: '$2,150',
			lastUpdated: '2023-12-05',
			status: 'published',
		},
		{
			id: '4',
			title: 'Node.js API Development',
			students: 0,
			rating: 0,
			revenue: '$0',
			lastUpdated: '2024-01-10',
			status: 'draft',
		},
	];

	const recentMessages = [
		{
			id: '1',
			student: 'John Smith',
			course: 'Complete JavaScript Course',
			message: 'When will the next module be available?',
			time: '2 hours ago',
		},
		{
			id: '2',
			student: 'Sarah Johnson',
			course: 'React Native for Beginners',
			message: "I'm having trouble with the installation steps in lecture 4.",
			time: '5 hours ago',
		},
		{
			id: '3',
			student: 'Michael Brown',
			course: 'Advanced TypeScript Patterns',
			message:
				'Great explanation of decorators! Thanks for the clear examples.',
			time: '1 day ago',
		},
	];

	const upcomingTasks = [
		{
			id: '1',
			title: 'Update JavaScript course content',
			dueDate: '2024-02-15',
			priority: 'high',
		},
		{
			id: '2',
			title: 'Record new lectures for React Native course',
			dueDate: '2024-02-20',
			priority: 'medium',
		},
		{
			id: '3',
			title: 'Review student assignments',
			dueDate: '2024-02-10',
			priority: 'high',
		},
	];

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Instructor Dashboard
					</h1>
					<p className="text-muted-foreground">
						Welcome back, {user?.name}! Here's what's happening with your
						courses.
					</p>
				</div>
				<Button asChild>
					<Link to="/dashboard/instructor/courses/create">
						<Plus className="mr-2 h-4 w-4" /> Create Course
					</Link>
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										{stat.title}
									</p>
									<p className="text-2xl font-bold">{stat.value}</p>
								</div>
								<div className="bg-muted rounded-full p-2">{stat.icon}</div>
							</div>
							<div className="mt-4">
								<p
									className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
								>
									{stat.change} from last month
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Tabs
				defaultValue="overview"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="courses">Courses</TabsTrigger>
					<TabsTrigger value="students">Students</TabsTrigger>
					<TabsTrigger value="messages">Messages</TabsTrigger>
				</TabsList>
				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Recent Messages</CardTitle>
								<CardDescription>
									Latest messages from your students
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{recentMessages.map((message) => (
									<div
										key={message.id}
										className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
									>
										<div className="bg-primary/10 rounded-full p-2">
											<MessageSquare className="text-primary h-4 w-4" />
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">{message.student}</p>
											<p className="text-muted-foreground text-xs">
												<span className="font-medium">{message.course}</span>:{' '}
												{message.message}
											</p>
											<p className="text-muted-foreground text-xs">
												{message.time}
											</p>
										</div>
									</div>
								))}
							</CardContent>
							<CardFooter>
								<Button variant="outline" size="sm" className="w-full">
									<Link to="/dashboard/instructor/messages">
										View All Messages
									</Link>
								</Button>
							</CardFooter>
						</Card>
						<Card className="col-span-1">
							<CardHeader>
								<CardTitle>Upcoming Tasks</CardTitle>
								<CardDescription>
									Tasks that need your attention
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{upcomingTasks.map((task) => (
									<div
										key={task.id}
										className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
									>
										<div
											className={`rounded-full p-2 ${
												task.priority === 'high'
													? 'bg-red-100 text-red-600'
													: task.priority === 'medium'
														? 'bg-yellow-100 text-yellow-600'
														: 'bg-green-100 text-green-600'
											}`}
										>
											<Clock className="h-4 w-4" />
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">{task.title}</p>
											<p className="text-muted-foreground text-xs">
												Due: {task.dueDate}
											</p>
											<p
												className={`text-xs font-medium ${
													task.priority === 'high'
														? 'text-red-600'
														: task.priority === 'medium'
															? 'text-yellow-600'
															: 'text-green-600'
												}`}
											>
												{task.priority.charAt(0).toUpperCase() +
													task.priority.slice(1)}{' '}
												Priority
											</p>
										</div>
									</div>
								))}
							</CardContent>
							<CardFooter>
								<Button variant="outline" size="sm" className="w-full">
									<Link to="/dashboard/instructor/tasks">View All Tasks</Link>
								</Button>
							</CardFooter>
						</Card>
					</div>
					<Card>
						<CardHeader>
							<CardTitle>Course Performance</CardTitle>
							<CardDescription>
								Overview of your top performing courses
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{courses
									.filter((course) => course.status === 'published')
									.slice(0, 3)
									.map((course) => (
										<div key={course.id} className="space-y-2">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium">{course.title}</p>
												<p className="text-muted-foreground text-sm">
													{course.students} students
												</p>
											</div>
											<Progress value={course.rating * 20} className="h-2" />
											<div className="flex items-center justify-between">
												<p className="text-muted-foreground text-xs">
													Rating: {course.rating}/5
												</p>
												<p className="text-muted-foreground text-xs">
													Revenue: {course.revenue}
												</p>
											</div>
										</div>
									))}
							</div>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								size="sm"
								className="w-full"
								onClick={() => setActiveTab('courses')}
							>
								View All Courses
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="courses" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Your Courses</CardTitle>
							<CardDescription>
								Manage and monitor your course performance
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="relative w-full overflow-auto">
								<table className="w-full caption-bottom text-sm">
									<thead className="[&_tr]:border-b">
										<tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
											<th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
												Course
											</th>
											<th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
												Students
											</th>
											<th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
												Rating
											</th>
											<th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
												Revenue
											</th>
											<th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
												Status
											</th>
											<th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="[&_tr:last-child]:border-0">
										{courses.map((course) => (
											<tr
												key={course.id}
												className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
											>
												<td className="p-4 align-middle">{course.title}</td>
												<td className="p-4 align-middle">{course.students}</td>
												<td className="p-4 align-middle">
													{course.rating || 'N/A'}
												</td>
												<td className="p-4 align-middle">{course.revenue}</td>
												<td className="p-4 align-middle">
													<span
														className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
															course.status === 'published'
																? 'bg-green-100 text-green-800'
																: 'bg-yellow-100 text-yellow-800'
														}`}
													>
														{course.status.charAt(0).toUpperCase() +
															course.status.slice(1)}
													</span>
												</td>
												<td className="p-4 align-middle">
													<div className="flex items-center gap-2">
														<Button variant="outline" size="sm" asChild>
															<Link
																to={`/dashboard/instructor/courses/${course.id}`}
															>
																Edit
															</Link>
														</Button>
														<Button variant="ghost" size="sm" asChild>
															<Link
																to={`/dashboard/instructor/courses/${course.id}/analytics`}
															>
																Analytics
															</Link>
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
						<CardFooter>
							<Button asChild>
								<Link to="/dashboard/instructor/courses/create">
									<Plus className="mr-2 h-4 w-4" /> Create New Course
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="students" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Your Students</CardTitle>
							<CardDescription>
								Students enrolled in your courses
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground text-sm">
								You have 1,234 students enrolled across all your courses.
							</p>
							{/* Student list would go here */}
							<div className="mt-6 py-8 text-center">
								<GraduationCap className="text-muted-foreground/50 mx-auto h-12 w-12" />
								<h3 className="mt-4 text-lg font-medium">
									Student data is loading
								</h3>
								<p className="text-muted-foreground mt-2 text-sm">
									Check back soon to see detailed information about your
									students.
								</p>
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="outline" className="w-full" asChild>
								<Link to="/dashboard/instructor/students">
									View All Students
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="messages" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Messages</CardTitle>
							<CardDescription>
								Manage communications with your students
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentMessages.map((message) => (
									<div
										key={message.id}
										className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
									>
										<div className="bg-primary/10 rounded-full p-2">
											<MessageSquare className="text-primary h-4 w-4" />
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium">{message.student}</p>
											<p className="text-muted-foreground text-xs">
												<span className="font-medium">{message.course}</span>:{' '}
												{message.message}
											</p>
											<p className="text-muted-foreground text-xs">
												{message.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="outline" className="w-full" asChild>
								<Link to="/dashboard/instructor/messages">
									View All Messages
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
