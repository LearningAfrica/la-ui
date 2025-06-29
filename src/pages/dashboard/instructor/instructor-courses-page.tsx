'use client';

import { useState } from 'react';
import {
	BookOpen,
	Edit,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

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
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for courses
const coursesData = [
	{
		id: '1',
		title: 'Introduction to JavaScript',
		description: 'Learn the fundamentals of JavaScript programming',
		thumbnail: '/javascript-code-abstract.png',
		students: 128,
		rating: 4.7,
		reviews: 45,
		status: 'published',
		lastUpdated: '2023-11-15',
	},
	{
		id: '2',
		title: 'Advanced React Patterns',
		description: 'Master advanced React patterns and techniques',
		thumbnail: '/abstract-geometric-shapes.png',
		students: 89,
		rating: 4.9,
		reviews: 32,
		status: 'published',
		lastUpdated: '2023-10-22',
	},
	{
		id: '3',
		title: 'CSS Grid Mastery',
		description: 'Everything you need to know about CSS Grid',
		thumbnail: '/abstract-blue-burst.png',
		students: 64,
		rating: 4.5,
		reviews: 28,
		status: 'draft',
		lastUpdated: '2023-11-02',
	},
	{
		id: '4',
		title: 'TypeScript for Beginners',
		description: 'Start your journey with TypeScript',
		thumbnail: '/abstract-geometric-sm.png',
		students: 0,
		rating: 0,
		reviews: 0,
		status: 'draft',
		lastUpdated: '2023-11-10',
	},
	{
		id: '5',
		title: 'Node.js API Development',
		description: 'Build robust APIs with Node.js and Express',
		thumbnail: '/abstract-aj.png',
		students: 42,
		rating: 4.6,
		reviews: 18,
		status: 'review',
		lastUpdated: '2023-11-05',
	},
];

export default function InstructorCoursesPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('all');
	const [courses, setCourses] = useState(coursesData);

	// Filter courses based on search query and active tab
	const filteredCourses = courses.filter((course) => {
		const matchesSearch = course.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());

		if (activeTab === 'all') return matchesSearch;
		if (activeTab === 'published')
			return matchesSearch && course.status === 'published';
		if (activeTab === 'drafts')
			return matchesSearch && course.status === 'draft';
		if (activeTab === 'review')
			return matchesSearch && course.status === 'review';

		return matchesSearch;
	});

	// Handle course deletion
	const handleDeleteCourse = (courseId: string) => {
		setCourses(courses.filter((course) => course.id !== courseId));
		toast.success('Course deleted successfully');
	};

	// Get counts for tabs
	const publishedCount = courses.filter(
		(course) => course.status === 'published',
	).length;
	const draftsCount = courses.filter(
		(course) => course.status === 'draft',
	).length;
	const reviewCount = courses.filter(
		(course) => course.status === 'review',
	).length;

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Your Courses</h1>
					<p className="text-muted-foreground">
						Manage and create your courses
					</p>
				</div>
				<Button asChild>
					<Link to="/dashboard/instructor/courses/create">
						<Plus className="mr-2 h-4 w-4" />
						Create New Course
					</Link>
				</Button>
			</div>

			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div className="relative w-full md:w-96">
					<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
					<Input
						type="search"
						placeholder="Search courses..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full md:w-auto"
				>
					<TabsList>
						<TabsTrigger value="all">
							All Courses
							<Badge variant="secondary" className="ml-2">
								{courses.length}
							</Badge>
						</TabsTrigger>
						<TabsTrigger value="published">
							Published
							<Badge variant="secondary" className="ml-2">
								{publishedCount}
							</Badge>
						</TabsTrigger>
						<TabsTrigger value="drafts">
							Drafts
							<Badge variant="secondary" className="ml-2">
								{draftsCount}
							</Badge>
						</TabsTrigger>
						<TabsTrigger value="review">
							In Review
							<Badge variant="secondary" className="ml-2">
								{reviewCount}
							</Badge>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{filteredCourses.length > 0 ? (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredCourses.map((course) => (
						<Card key={course.id} className="overflow-hidden">
							<div className="aspect-video w-full overflow-hidden">
								<img
									src={course.thumbnail || '/placeholder.svg'}
									alt={course.title}
									className="h-full w-full object-cover transition-all hover:scale-105"
								/>
							</div>
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between">
									<CardTitle className="line-clamp-1">{course.title}</CardTitle>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Open menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={() =>
													navigate(`/dashboard/instructor/courses/${course.id}`)
												}
											>
												<BookOpen className="mr-2 h-4 w-4" />
												View Details
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													navigate(
														`/dashboard/instructor/courses/${course.id}/edit`,
													)
												}
											>
												<Edit className="mr-2 h-4 w-4" />
												Edit Course
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													navigate(`/courses/preview/${course.id}`)
												}
											>
												<Eye className="mr-2 h-4 w-4" />
												Preview
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<DropdownMenuItem
														onSelect={(e) => e.preventDefault()}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete Course
													</DropdownMenuItem>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Are you absolutely sure?
														</AlertDialogTitle>
														<AlertDialogDescription>
															This action cannot be undone. This will
															permanently delete your course and remove it from
															our This will permanently delete your course and
															remove it from our servers.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDeleteCourse(course.id)}
														>
															Delete Course
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<CardDescription className="line-clamp-2">
									{course.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="pb-2">
								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-2">
										<Avatar className="h-6 w-6">
											<AvatarImage src="/placeholder.svg" alt="Avatar" />
											<AvatarFallback>U</AvatarFallback>
										</Avatar>
										<span className="text-muted-foreground">You</span>
									</div>
									<div>
										{course.status === 'published' ? (
											<Badge
												variant="default"
												className="bg-green-500 hover:bg-green-600"
											>
												Published
											</Badge>
										) : course.status === 'draft' ? (
											<Badge variant="outline">Draft</Badge>
										) : (
											<Badge
												variant="secondary"
												className="bg-amber-500 text-white hover:bg-amber-600"
											>
												In Review
											</Badge>
										)}
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex items-center justify-between border-t pt-4">
								<div className="text-muted-foreground text-sm">
									Last updated: {course.lastUpdated}
								</div>
								<div className="flex items-center gap-4 text-sm">
									<div className="flex items-center gap-1">
										<BookOpen className="h-4 w-4" />
										<span>{course.students}</span>
									</div>
									{course.rating > 0 && (
										<div className="flex items-center gap-1">
											<span>⭐</span>
											<span>{course.rating}</span>
										</div>
									)}
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="mb-2 text-lg font-medium">No courses found</h3>
						<p className="text-muted-foreground mb-6 text-center">
							{searchQuery
								? 'No courses match your search criteria. Try a different search term.'
								: "You haven't created any courses yet. Get started by creating your first course."}
						</p>
						<Button asChild>
							<Link to="/dashboard/instructor/courses/create">
								<Plus className="mr-2 h-4 w-4" />
								Create Your First Course
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
