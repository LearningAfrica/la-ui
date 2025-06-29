'use client';

import { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Mock data for student courses
const mockCourses = [
	{
		id: 'course-1',
		title: 'Introduction to JavaScript',
		instructor: 'Alex Johnson',
		category: 'Programming',
		progress: 65,
		lastAccessed: '2 days ago',
		image: '/javascript-code-abstract.png',
		status: 'in-progress',
	},
	{
		id: 'course-2',
		title: 'Machine Learning Fundamentals',
		instructor: 'Sarah Miller',
		category: 'Data Science',
		progress: 32,
		lastAccessed: '1 week ago',
		image: '/machine-learning-concept.png',
		status: 'in-progress',
	},
	{
		id: 'course-3',
		title: 'Web Design Principles',
		instructor: 'David Wilson',
		category: 'Design',
		progress: 89,
		lastAccessed: 'Yesterday',
		image: '/abstract-blue-curves.png',
		status: 'in-progress',
	},
	{
		id: 'course-4',
		title: 'Advanced React Development',
		instructor: 'Emily Chen',
		category: 'Programming',
		progress: 0,
		lastAccessed: 'Not started',
		image: '/abstract-geometric-shapes.png',
		status: 'not-started',
	},
	{
		id: 'course-5',
		title: 'Digital Marketing Essentials',
		instructor: 'Michael Brown',
		category: 'Marketing',
		progress: 100,
		lastAccessed: '3 weeks ago',
		image: '/abstract-aj.png',
		status: 'completed',
	},
];

export default function StudentCoursesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('all');

	// Filter courses based on search query and active tab
	const filteredCourses = mockCourses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.category.toLowerCase().includes(searchQuery.toLowerCase());

		if (activeTab === 'all') return matchesSearch;
		if (activeTab === 'in-progress')
			return matchesSearch && course.status === 'in-progress';
		if (activeTab === 'completed')
			return matchesSearch && course.status === 'completed';
		if (activeTab === 'not-started')
			return matchesSearch && course.status === 'not-started';

		return matchesSearch;
	});

	return (
		<div className="space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<h1 className="text-3xl font-bold">My Courses</h1>
				<div className="relative w-full md:w-64">
					<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
					<Input
						type="search"
						placeholder="Search courses..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
				<TabsList>
					<TabsTrigger value="all">All Courses</TabsTrigger>
					<TabsTrigger value="in-progress">In Progress</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
					<TabsTrigger value="not-started">Not Started</TabsTrigger>
				</TabsList>
				<TabsContent value="all" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredCourses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</TabsContent>
				<TabsContent value="in-progress" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredCourses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</TabsContent>
				<TabsContent value="completed" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredCourses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</TabsContent>
				<TabsContent value="not-started" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredCourses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function CourseCard({ course }: { course: (typeof mockCourses)[number] }) {
	return (
		<Card className="overflow-hidden">
			<div className="aspect-video w-full overflow-hidden">
				<img
					src={course.image || '/placeholder.svg'}
					alt={course.title}
					className="h-full w-full object-cover transition-all hover:scale-105"
					onError={(e) => {
						e.currentTarget.src = '/winding-mountain-road.png';
					}}
				/>
			</div>
			<CardHeader>
				<div className="flex items-start justify-between">
					<CardTitle className="line-clamp-2">{course.title}</CardTitle>
					{course.status === 'completed' && (
						<Badge
							variant="outline"
							className="border-green-200 bg-green-50 text-green-700"
						>
							Completed
						</Badge>
					)}
				</div>
				<div className="text-muted-foreground text-sm">
					Instructor: {course.instructor}
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Progress</span>
					<span className="text-muted-foreground text-sm">
						{course.progress}%
					</span>
				</div>
				<Progress value={course.progress} className="h-2" />
				<div className="text-muted-foreground mt-2 flex items-center text-xs">
					<Clock className="mr-1 h-3 w-3" />
					<span>Last accessed {course.lastAccessed}</span>
				</div>
			</CardContent>
			<CardFooter>
				<Button asChild className="w-full">
					<Link to={`/dashboard/student/courses/${course.id}`}>
						{course.progress === 0 ? 'Start Course' : 'Continue Learning'}
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
