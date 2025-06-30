'use client';

import { useState } from 'react';
import {
	BarChart3,
	BookOpen,
	Calendar,
	Clock,
	Download,
	Filter,
	Layers,
	MoreHorizontal,
	Plus,
	Search,
	Settings,
	Star,
	Users,
} from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for learning content
const learningData = {
	totalCourses: 248,
	activeCourses: 187,
	totalStudents: 12453,
	totalInstructors: 76,
	averageCompletion: 68,
	totalCategories: 12,
	recentlyAdded: 14,
	pendingReview: 8,

	courseStats: [
		{ month: 'Jan', count: 45 },
		{ month: 'Feb', count: 52 },
		{ month: 'Mar', count: 49 },
		{ month: 'Apr', count: 62 },
		{ month: 'May', count: 58 },
		{ month: 'Jun', count: 65 },
		{ month: 'Jul', count: 68 },
		{ month: 'Aug', count: 72 },
		{ month: 'Sep', count: 80 },
		{ month: 'Oct', count: 92 },
		{ month: 'Nov', count: 98 },
		{ month: 'Dec', count: 110 },
	],

	popularCourses: [
		{
			id: 'course-1',
			title: 'Advanced JavaScript Programming',
			category: 'Programming',
			instructor: 'Alex Johnson',
			instructorId: 'inst-1',
			students: 1245,
			rating: 4.8,
			lastUpdated: '2023-11-15T00:00:00.000Z',
			status: 'active',
			image: '/javascript-code-abstract.png',
		},
		{
			id: 'course-2',
			title: 'Introduction to Data Science',
			category: 'Data Science',
			instructor: 'Maria Garcia',
			instructorId: 'inst-2',
			students: 987,
			rating: 4.7,
			lastUpdated: '2023-12-01T00:00:00.000Z',
			status: 'active',
			image: '/abstract-blue-burst.png',
		},
		{
			id: 'course-3',
			title: 'UX/UI Design Fundamentals',
			category: 'Design',
			instructor: 'David Kim',
			instructorId: 'inst-3',
			students: 876,
			rating: 4.9,
			lastUpdated: '2023-10-22T00:00:00.000Z',
			status: 'active',
			image: '/abstract-geometric-shapes.png',
		},
		{
			id: 'course-4',
			title: 'Digital Marketing Masterclass',
			category: 'Marketing',
			instructor: 'Sarah Williams',
			instructorId: 'inst-4',
			students: 754,
			rating: 4.6,
			lastUpdated: '2023-11-05T00:00:00.000Z',
			status: 'active',
			image: '/abstract-southwest.png',
		},
		{
			id: 'course-5',
			title: 'Machine Learning for Beginners',
			category: 'Data Science',
			instructor: 'James Chen',
			instructorId: 'inst-5',
			students: 698,
			rating: 4.5,
			lastUpdated: '2023-12-10T00:00:00.000Z',
			status: 'active',
			image: '/vibrant-street-market.png',
		},
	],

	recentCourses: [
		{
			id: 'course-6',
			title: 'Blockchain Development',
			category: 'Programming',
			instructor: 'Michael Lee',
			instructorId: 'inst-6',
			students: 342,
			rating: 4.4,
			lastUpdated: '2024-01-05T00:00:00.000Z',
			status: 'active',
			image: '/coding-javascript.png',
		},
		{
			id: 'course-7',
			title: 'Advanced Excel for Business',
			category: 'Business',
			instructor: 'Jennifer Smith',
			instructorId: 'inst-7',
			students: 289,
			rating: 4.7,
			lastUpdated: '2024-01-10T00:00:00.000Z',
			status: 'active',
			image: '/green-tractor-field.png',
		},
		{
			id: 'course-8',
			title: 'Photography Masterclass',
			category: 'Arts',
			instructor: 'Robert Brown',
			instructorId: 'inst-8',
			students: 156,
			rating: 4.8,
			lastUpdated: '2024-01-15T00:00:00.000Z',
			status: 'pending',
			image: '/diverse-classroom-instructor.png',
		},
		{
			id: 'course-9',
			title: 'Public Speaking Essentials',
			category: 'Personal Development',
			instructor: 'Emily Davis',
			instructorId: 'inst-9',
			students: 124,
			rating: 4.6,
			lastUpdated: '2024-01-18T00:00:00.000Z',
			status: 'pending',
			image: '/diverse-students-studying.png',
		},
		{
			id: 'course-10',
			title: 'Introduction to Cybersecurity',
			category: 'IT & Security',
			instructor: 'Thomas Wilson',
			instructorId: 'inst-10',
			students: 98,
			rating: 4.5,
			lastUpdated: '2024-01-20T00:00:00.000Z',
			status: 'pending',
			image: '/stylized-ej-initials.png',
		},
	],

	categories: [
		{ id: 'cat-1', name: 'Programming', courses: 45, students: 3245 },
		{ id: 'cat-2', name: 'Data Science', courses: 32, students: 2876 },
		{ id: 'cat-3', name: 'Design', courses: 28, students: 2154 },
		{ id: 'cat-4', name: 'Business', courses: 35, students: 1987 },
		{ id: 'cat-5', name: 'Marketing', courses: 22, students: 1654 },
		{ id: 'cat-6', name: 'Personal Development', courses: 18, students: 1432 },
		{ id: 'cat-7', name: 'IT & Security', courses: 25, students: 1876 },
		{ id: 'cat-8', name: 'Arts', courses: 15, students: 987 },
		{ id: 'cat-9', name: 'Health & Fitness', courses: 12, students: 876 },
		{ id: 'cat-10', name: 'Language Learning', courses: 16, students: 1243 },
	],
};

export default function AdminLearningPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedStatus, setSelectedStatus] = useState('');

	// Filter courses based on search query, category, and status
	const filterCourses = (courses: any[]) => {
		return courses.filter((course) => {
			const matchesSearch =
				course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === '' || course.category === selectedCategory;
			const matchesStatus =
				selectedStatus === '' || course.status === selectedStatus;

			return matchesSearch && matchesCategory && matchesStatus;
		});
	};

	const filteredPopularCourses = filterCourses(learningData.popularCourses);
	const filteredRecentCourses = filterCourses(learningData.recentCourses);

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Learning Management
					</h1>
					<p className="text-muted-foreground">
						Manage all learning content and monitor platform performance
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button asChild>
						<Link to="/dashboard/admin/courses/create">
							<Plus className="mr-2 h-4 w-4" /> Add New Course
						</Link>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<Settings className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Learning Settings</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link to="/dashboard/admin/categories" className="flex w-full">
									Manage Categories
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link to="/dashboard/admin/approvals" className="flex w-full">
									Course Approvals
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link
									to="/dashboard/admin/certificates"
									className="flex w-full"
								>
									Certificate Templates
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>Platform Settings</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Courses</CardTitle>
						<BookOpen className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{learningData.totalCourses}
						</div>
						<p className="text-muted-foreground text-xs">
							{learningData.activeCourses} active courses
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Students
						</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{learningData.totalStudents.toLocaleString()}
						</div>
						<p className="text-muted-foreground text-xs">
							Across {learningData.totalCategories} categories
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Completion Rate
						</CardTitle>
						<BarChart3 className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{learningData.averageCompletion}%
						</div>
						<Progress value={learningData.averageCompletion} className="mt-2" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Recent Activity
						</CardTitle>
						<Calendar className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{learningData.recentlyAdded}
						</div>
						<p className="text-muted-foreground text-xs">
							New courses added this month
						</p>
						<div className="mt-2 text-xs">
							<Badge variant="outline" className="mr-1">
								{learningData.pendingReview} pending review
							</Badge>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col gap-4 md:flex-row">
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
					<Input
						type="search"
						placeholder="Search courses or instructors..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Select value={selectedCategory} onValueChange={setSelectedCategory}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{learningData.categories.map((category) => (
							<SelectItem key={category.id} value={category.name}>
								{category.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={selectedStatus} onValueChange={setSelectedStatus}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Statuses</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="archived">Archived</SelectItem>
					</SelectContent>
				</Select>
				<Button variant="outline" className="flex gap-2">
					<Filter className="h-4 w-4" /> More Filters
				</Button>
			</div>

			{/* Course Tabs */}
			<Tabs defaultValue="popular" className="space-y-4">
				<TabsList>
					<TabsTrigger value="popular">Popular Courses</TabsTrigger>
					<TabsTrigger value="recent">Recently Added</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
				</TabsList>

				{/* Popular Courses Tab */}
				<TabsContent value="popular" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Popular Courses</CardTitle>
							<CardDescription>
								The most enrolled courses on the platform
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Course</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Instructor</TableHead>
										<TableHead className="text-right">Students</TableHead>
										<TableHead className="text-right">Rating</TableHead>
										<TableHead className="text-right">Last Updated</TableHead>
										<TableHead className="text-right">Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredPopularCourses.length > 0 ? (
										filteredPopularCourses.map((course) => (
											<TableRow key={course.id}>
												<TableCell className="font-medium">
													<div className="flex items-center gap-3">
														<div className="h-10 w-10 overflow-hidden rounded-md">
															<img
																src={course.image || '/placeholder.svg'}
																alt={course.title}
																className="h-full w-full object-cover"
															/>
														</div>
														<div className="font-medium">{course.title}</div>
													</div>
												</TableCell>
												<TableCell>{course.category}</TableCell>
												<TableCell>
													<Link
														to={`/dashboard/admin/instructors/${course.instructorId}`}
														className="text-primary hover:underline"
													>
														{course.instructor}
													</Link>
												</TableCell>
												<TableCell className="text-right">
													{course.students.toLocaleString()}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<Star className="fill-primary text-primary h-4 w-4" />
														<span>{course.rating}</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													{format(new Date(course.lastUpdated), 'MMM d, yyyy')}
												</TableCell>
												<TableCell className="text-right">
													<Badge
														variant={
															course.status === 'active' ? 'default' : 'outline'
														}
													>
														{course.status}
													</Badge>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
																<span className="sr-only">Actions</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/dashboard/admin/courses/${course.id}`,
																	)
																}
															>
																View Details
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/dashboard/admin/courses/${course.id}/edit`,
																	)
																}
															>
																Edit Course
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/dashboard/admin/courses/${course.id}/students`,
																	)
																}
															>
																View Students
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
																Archive Course
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={8}
												className="text-muted-foreground py-6 text-center"
											>
												No courses found matching your filters
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline" size="sm">
								<Download className="mr-2 h-4 w-4" /> Export Data
							</Button>
							<Button variant="outline" size="sm" asChild>
								<Link to="/dashboard/admin/courses">View All Courses</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Recently Added Tab */}
				<TabsContent value="recent" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recently Added Courses</CardTitle>
							<CardDescription>
								New courses added to the platform
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Course</TableHead>
										<TableHead>Category</TableHead>
										<TableHead>Instructor</TableHead>
										<TableHead className="text-right">Students</TableHead>
										<TableHead className="text-right">Rating</TableHead>
										<TableHead className="text-right">Added Date</TableHead>
										<TableHead className="text-right">Status</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRecentCourses.length > 0 ? (
										filteredRecentCourses.map((course) => (
											<TableRow key={course.id}>
												<TableCell className="font-medium">
													<div className="flex items-center gap-3">
														<div className="h-10 w-10 overflow-hidden rounded-md">
															<img
																src={course.image || '/placeholder.svg'}
																alt={course.title}
																className="h-full w-full object-cover"
															/>
														</div>
														<div className="font-medium">{course.title}</div>
													</div>
												</TableCell>
												<TableCell>{course.category}</TableCell>
												<TableCell>
													<Link
														to={`/dashboard/admin/instructors/${course.instructorId}`}
														className="text-primary hover:underline"
													>
														{course.instructor}
													</Link>
												</TableCell>
												<TableCell className="text-right">
													{course.students.toLocaleString()}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<Star className="fill-primary text-primary h-4 w-4" />
														<span>{course.rating}</span>
													</div>
												</TableCell>
												<TableCell className="text-right">
													{format(new Date(course.lastUpdated), 'MMM d, yyyy')}
												</TableCell>
												<TableCell className="text-right">
													<Badge
														variant={
															course.status === 'active' ? 'default' : 'outline'
														}
													>
														{course.status}
													</Badge>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreHorizontal className="h-4 w-4" />
																<span className="sr-only">Actions</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/dashboard/admin/courses/${course.id}`,
																	)
																}
															>
																View Details
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	navigate(
																		`/dashboard/admin/courses/${course.id}/edit`,
																	)
																}
															>
																Edit Course
															</DropdownMenuItem>
															{course.status === 'pending' && (
																<DropdownMenuItem
																	onClick={() =>
																		navigate(
																			`/dashboard/admin/approvals/${course.id}`,
																		)
																	}
																>
																	Review Course
																</DropdownMenuItem>
															)}
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
																Archive Course
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={8}
												className="text-muted-foreground py-6 text-center"
											>
												No recent courses found matching your filters
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="outline" size="sm">
								<Download className="mr-2 h-4 w-4" /> Export Data
							</Button>
							<Button variant="outline" size="sm" asChild>
								<Link to="/dashboard/admin/approvals">
									View Pending Approvals
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>

				{/* Categories Tab */}
				<TabsContent value="categories" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Course Categories</CardTitle>
							<CardDescription>
								Overview of course categories and their performance
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{learningData.categories.map((category) => (
									<Card key={category.id} className="overflow-hidden">
										<CardHeader className="p-4">
											<CardTitle className="text-lg">{category.name}</CardTitle>
										</CardHeader>
										<CardContent className="p-4 pt-0">
											<div className="flex justify-between text-sm">
												<div>
													<div className="font-medium">{category.courses}</div>
													<div className="text-muted-foreground">Courses</div>
												</div>
												<div>
													<div className="font-medium">
														{category.students.toLocaleString()}
													</div>
													<div className="text-muted-foreground">Students</div>
												</div>
												<div>
													<div className="font-medium">
														{Math.round(category.students / category.courses)}
													</div>
													<div className="text-muted-foreground">
														Avg. Students
													</div>
												</div>
											</div>
										</CardContent>
										<CardFooter className="flex justify-end p-4 pt-0">
											<Button variant="ghost" size="sm" asChild>
												<Link to={`/dashboard/admin/categories/${category.id}`}>
													View Details
												</Link>
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						</CardContent>
						<CardFooter>
							<Button asChild>
								<Link to="/dashboard/admin/categories/create">
									<Plus className="mr-2 h-4 w-4" /> Add New Category
								</Link>
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Learning Insights */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Course Growth</CardTitle>
						<CardDescription>
							Monthly course additions over the past year
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex h-[200px] items-end gap-2">
							{learningData.courseStats.map((stat) => (
								<div
									key={stat.month}
									className="relative flex flex-1 flex-col items-center"
								>
									<div
										className="bg-primary/90 w-full rounded-sm"
										style={{ height: `${(stat.count / 110) * 100}%` }}
									></div>
									<span className="mt-2 text-xs">{stat.month}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Learning Activity</CardTitle>
						<CardDescription>
							Recent platform activity and engagement
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder.svg" alt="Student" />
										<AvatarFallback>S</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">
											New Student Enrollment
										</p>
										<p className="text-muted-foreground text-xs">
											Advanced JavaScript Programming
										</p>
									</div>
								</div>
								<div className="text-muted-foreground text-xs">2 hours ago</div>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder.svg" alt="Instructor" />
										<AvatarFallback>I</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">New Course Submitted</p>
										<p className="text-muted-foreground text-xs">
											Python for Data Analysis
										</p>
									</div>
								</div>
								<div className="text-muted-foreground text-xs">5 hours ago</div>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder.svg" alt="Student" />
										<AvatarFallback>C</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">Course Completion</p>
										<p className="text-muted-foreground text-xs">
											UX/UI Design Fundamentals
										</p>
									</div>
								</div>
								<div className="text-muted-foreground text-xs">Yesterday</div>
							</div>
							<Separator />
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder.svg" alt="Admin" />
										<AvatarFallback>A</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">New Category Added</p>
										<p className="text-muted-foreground text-xs">
											Artificial Intelligence
										</p>
									</div>
								</div>
								<div className="text-muted-foreground text-xs">2 days ago</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline" className="w-full" asChild>
							<Link to="/dashboard/admin/reports">
								<BarChart3 className="mr-2 h-4 w-4" /> View Detailed Reports
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>Common administrative tasks</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<Button
							asChild
							className="h-auto flex-col items-center justify-center gap-2 py-4"
						>
							<Link to="/dashboard/admin/courses/create">
								<BookOpen className="mb-2 h-6 w-6" />
								<div className="text-sm font-medium">Create New Course</div>
								<div className="text-muted-foreground text-xs">
									Add a new course to the platform
								</div>
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="h-auto flex-col items-center justify-center gap-2 py-4"
						>
							<Link to="/dashboard/admin/approvals">
								<Layers className="mb-2 h-6 w-6" />
								<div className="text-sm font-medium">
									Review Pending Courses
								</div>
								<div className="text-muted-foreground text-xs">
									{learningData.pendingReview} courses awaiting review
								</div>
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="h-auto flex-col items-center justify-center gap-2 py-4"
						>
							<Link to="/dashboard/admin/reports">
								<Clock className="mb-2 h-6 w-6" />
								<div className="text-sm font-medium">Learning Analytics</div>
								<div className="text-muted-foreground text-xs">
									View detailed platform metrics
								</div>
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
