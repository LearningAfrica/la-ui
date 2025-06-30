'use client';

import { useState } from 'react';
import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Download,
	Edit,
	Eye,
	FileText,
	Globe,
	GraduationCap,
	LayoutGrid,
	MessageSquare,
	MoreHorizontal,
	PenLine,
	PlusCircle,
	Star,
	Tag,
	Trash2,
	Users,
	XCircle,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Sample course data
const course = {
	id: 'c1',
	title: 'JavaScript Fundamentals',
	description:
		'Learn the core concepts of JavaScript programming from the ground up. This comprehensive course covers everything from basic syntax to advanced topics like closures, promises, and async/await.',
	instructor: {
		id: 'i1',
		name: 'Jane Doe',
		image: '/diverse-classroom-instructor.png',
		bio: 'Senior JavaScript Developer with 10+ years of experience',
	},
	category: {
		id: 'cat1',
		name: 'Programming',
	},
	subcategory: {
		id: 'subcat1',
		name: 'JavaScript',
	},
	price: 49.99,
	salePrice: 39.99,
	status: 'published',
	featured: true,
	students: 1245,
	rating: 4.8,
	reviews: 328,
	lastUpdated: '2023-12-15',
	createdAt: '2023-10-05',
	language: 'English',
	level: 'Beginner',
	duration: '10 hours',
	sections: 8,
	lessons: 42,
	thumbnail: '/coding-javascript.png',
	requirements: [
		'Basic understanding of HTML and CSS',
		'A computer with internet access',
		'No prior JavaScript knowledge required',
	],
	objectives: [
		'Understand JavaScript fundamentals and syntax',
		'Work with variables, data types, and functions',
		'Manipulate the DOM and handle events',
		'Use modern ES6+ features',
		'Work with asynchronous JavaScript',
		'Build small JavaScript applications',
	],
	curriculum: [
		{
			id: 's1',
			title: 'Introduction to JavaScript',
			lessons: [
				{
					id: 'l1',
					title: 'What is JavaScript?',
					duration: '10:25',
					type: 'video',
				},
				{
					id: 'l2',
					title: 'Setting Up Your Development Environment',
					duration: '15:40',
					type: 'video',
				},
				{
					id: 'l3',
					title: 'Your First JavaScript Program',
					duration: '12:15',
					type: 'video',
				},
			],
		},
		{
			id: 's2',
			title: 'JavaScript Basics',
			lessons: [
				{
					id: 'l4',
					title: 'Variables and Data Types',
					duration: '18:30',
					type: 'video',
				},
				{
					id: 'l5',
					title: 'Operators and Expressions',
					duration: '14:45',
					type: 'video',
				},
				{
					id: 'l6',
					title: 'Control Flow: Conditionals',
					duration: '16:20',
					type: 'video',
				},
				{
					id: 'l7',
					title: 'Control Flow: Loops',
					duration: '15:10',
					type: 'video',
				},
				{
					id: 'l8',
					title: 'JavaScript Basics Quiz',
					duration: '20:00',
					type: 'quiz',
				},
			],
		},
		{
			id: 's3',
			title: 'Functions and Scope',
			lessons: [
				{
					id: 'l9',
					title: 'Declaring and Calling Functions',
					duration: '17:35',
					type: 'video',
				},
				{
					id: 'l10',
					title: 'Function Parameters and Return Values',
					duration: '14:50',
					type: 'video',
				},
				{
					id: 'l11',
					title: 'Function Expressions and Arrow Functions',
					duration: '16:40',
					type: 'video',
				},
				{
					id: 'l12',
					title: 'Scope and Closures',
					duration: '22:15',
					type: 'video',
				},
			],
		},
	],
	resources: [
		{
			id: 'r1',
			title: 'JavaScript Cheat Sheet',
			type: 'pdf',
			size: '1.2 MB',
		},
		{
			id: 'r2',
			title: 'Code Examples',
			type: 'zip',
			size: '4.5 MB',
		},
		{
			id: 'r3',
			title: 'Additional Exercises',
			type: 'pdf',
			size: '2.8 MB',
		},
	],
	recentStudents: [
		{
			id: 's1',
			name: 'Alex Johnson',
			image: '/diverse-students-studying.png',
			enrolledDate: '2024-01-15',
		},
		{
			id: 's2',
			name: 'Maria Garcia',
			image: '/diverse-students-studying.png',
			enrolledDate: '2024-01-12',
		},
		{
			id: 's3',
			name: 'James Wilson',
			image: '/diverse-students-studying.png',
			enrolledDate: '2024-01-10',
		},
		{
			id: 's4',
			name: 'Sarah Lee',
			image: '/diverse-students-studying.png',
			enrolledDate: '2024-01-08',
		},
		{
			id: 's5',
			name: 'Robert Brown',
			image: '/diverse-students-studying.png',
			enrolledDate: '2024-01-05',
		},
	],
	topReviews: [
		{
			id: 'r1',
			student: {
				id: 's6',
				name: 'Emily Davis',
				image: '/thoughtful-reviewer.png',
			},
			rating: 5,
			date: '2023-12-20',
			content:
				"This course is excellent! The instructor explains complex concepts in a way that's easy to understand. I've learned so much and feel confident in my JavaScript skills now.",
		},
		{
			id: 'r2',
			student: {
				id: 's7',
				name: 'Michael Thompson',
				image: '/constructive-feedback.png',
			},
			rating: 4,
			date: '2023-12-15',
			content:
				"Very comprehensive course with great examples. The only reason I'm not giving 5 stars is that some sections could use more practical exercises.",
		},
		{
			id: 'r3',
			student: {
				id: 's8',
				name: 'Sophia Martinez',
				image: '/critical-assessment.png',
			},
			rating: 5,
			date: '2023-12-10',
			content:
				'Jane is an amazing instructor! Her explanations are clear and the course structure makes learning JavaScript enjoyable. Highly recommended for beginners.',
		},
	],
};

export default function CourseDetailPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState('overview');

	// Calculate total duration
	const totalDuration = course.curriculum.reduce(
		(total, section) =>
			total +
			section.lessons.reduce(
				(sectionTotal, lesson) =>
					sectionTotal +
					Number.parseInt(lesson.duration.split(':')[0]) * 60 +
					Number.parseInt(lesson.duration.split(':')[1]),
				0,
			),
		0,
	);

	const hours = Math.floor(totalDuration / 3600);
	const minutes = Math.floor((totalDuration % 3600) / 60);

	// Calculate video and quiz counts
	const videoCount = course.curriculum.reduce(
		(count, section) =>
			count +
			section.lessons.filter((lesson) => lesson.type === 'video').length,
		0,
	);
	const quizCount = course.curriculum.reduce(
		(count, section) =>
			count + section.lessons.filter((lesson) => lesson.type === 'quiz').length,
		0,
	);

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/courses">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Courses
						</Link>
					</Button>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Button variant="outline" size="sm" asChild>
						<Link to={`/courses/${params.id}`} target="_blank">
							<Eye className="mr-2 h-4 w-4" />
							Preview
						</Link>
					</Button>
					<Button variant="outline" size="sm" asChild>
						<Link to={`/dashboard/admin/courses/${params.id}/edit`}>
							<Edit className="mr-2 h-4 w-4" />
							Edit
						</Link>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<MoreHorizontal className="mr-2 h-4 w-4" />
								Actions
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Course Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: course.featured
									// 		? 'Removed from Featured'
									// 		: 'Added to Featured',
									// 	description: `${course.title} has been ${
									// 		course.featured ? 'removed from' : 'added to'
									// 	} featured courses.`,
									// });
									toast.info(
										`${course.title} has been ${
											course.featured ? 'removed from' : 'added to'
										} featured courses.`,
									);
								}}
							>
								{course.featured ? 'Remove from Featured' : 'Add to Featured'}
							</DropdownMenuItem>
							{course.status === 'pending' && (
								<>
									<DropdownMenuItem
										onClick={() => {
											// toast({
											// 	title: 'Course Approved',
											// 	description: `${course.title} has been approved and published.`,
											// });
											toast.success(
												`${course.title} has been approved and published.`,
											);
										}}
									>
										<CheckCircle className="mr-2 h-4 w-4" />
										Approve
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											// toast({
											// 	title: 'Course Rejected',
											// 	description: `${course.title} has been rejected.`,
											// 	variant: 'destructive',
											// });
											toast.error(`${course.title} has been rejected.`);
										}}
									>
										<XCircle className="mr-2 h-4 w-4" />
										Reject
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: 'Course Deleted',
									// 	description: `${course.title} has been deleted.`,
									// 	variant: 'destructive',
									// });
									toast.error(`${course.title} has been deleted.`);
									navigate('/dashboard/admin/courses');
								}}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Course
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div className="space-y-6 md:col-span-2">
					<Card>
						<CardHeader>
							<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div>
									<div className="flex items-center gap-2">
										<CardTitle className="text-2xl">{course.title}</CardTitle>
										{course.featured && (
											<Badge variant="outline" className="ml-2">
												Featured
											</Badge>
										)}
									</div>
									<CardDescription className="mt-2">
										<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
											<div className="flex items-center">
												<Tag className="mr-1 h-4 w-4" />
												<Link
													to={`/dashboard/admin/categories/${course.category.id}`}
													className="text-primary hover:underline"
												>
													{course.category.name}
												</Link>
												{' > '}
												<Link
													to={`/dashboard/admin/categories/${course.category.id}/${course.subcategory.id}`}
													className="text-primary hover:underline"
												>
													{course.subcategory.name}
												</Link>
											</div>
											<div className="flex items-center">
												<Clock className="mr-1 h-4 w-4" />
												{hours > 0 ? `${hours}h ` : ''}
												{minutes}m
											</div>
											<div className="flex items-center">
												<LayoutGrid className="mr-1 h-4 w-4" />
												{course.sections} sections
											</div>
											<div className="flex items-center">
												<FileText className="mr-1 h-4 w-4" />
												{course.lessons} lessons
											</div>
											<div className="flex items-center">
												<Globe className="mr-1 h-4 w-4" />
												{course.language}
											</div>
											<div className="flex items-center">
												<GraduationCap className="mr-1 h-4 w-4" />
												{course.level}
											</div>
										</div>
									</CardDescription>
								</div>
								<Badge
									className={
										course.status === 'published'
											? 'bg-green-500'
											: course.status === 'pending'
												? 'bg-yellow-500'
												: course.status === 'rejected'
													? 'bg-red-500'
													: 'bg-slate-500'
									}
								>
									{course.status.charAt(0).toUpperCase() +
										course.status.slice(1)}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage
											src={course.instructor.image || '/placeholder.svg'}
											alt={course.instructor.name}
										/>
										<AvatarFallback>
											{course.instructor.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">Instructor</p>
										<Link
											to={`/dashboard/admin/instructors/${course.instructor.id}`}
											className="text-primary hover:underline"
										>
											{course.instructor.name}
										</Link>
									</div>
								</div>
								<Separator
									orientation="vertical"
									className="hidden h-10 md:block"
								/>
								<div>
									<p className="text-sm font-medium">Created</p>
									<p className="text-muted-foreground text-sm">
										{new Date(course.createdAt).toLocaleDateString()}
									</p>
								</div>
								<Separator
									orientation="vertical"
									className="hidden h-10 md:block"
								/>
								<div>
									<p className="text-sm font-medium">Last Updated</p>
									<p className="text-muted-foreground text-sm">
										{new Date(course.lastUpdated).toLocaleDateString()}
									</p>
								</div>
							</div>

							<Tabs
								defaultValue="overview"
								value={activeTab}
								onValueChange={setActiveTab}
								className="space-y-4"
							>
								<TabsList className="grid grid-cols-4 md:grid-cols-5 lg:w-[600px]">
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
									<TabsTrigger value="students">Students</TabsTrigger>
									<TabsTrigger value="reviews">Reviews</TabsTrigger>
									<TabsTrigger value="resources">Resources</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="space-y-6">
									<div>
										<h3 className="mb-2 text-lg font-medium">Description</h3>
										<p className="text-muted-foreground">
											{course.description}
										</p>
									</div>

									<div>
										<h3 className="mb-2 text-lg font-medium">
											What You'll Learn
										</h3>
										<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
											{course.objectives.map((objective, index) => (
												<li key={index} className="flex items-start gap-2">
													<CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
													<span>{objective}</span>
												</li>
											))}
										</ul>
									</div>

									<div>
										<h3 className="mb-2 text-lg font-medium">Requirements</h3>
										<ul className="list-disc space-y-1 pl-5">
											{course.requirements.map((requirement, index) => (
												<li key={index}>{requirement}</li>
											))}
										</ul>
									</div>

									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<Card>
											<CardHeader>
												<CardTitle className="text-lg">Pricing</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div className="flex justify-between">
														<span>Regular Price:</span>
														<span className="font-medium">
															${course.price.toFixed(2)}
														</span>
													</div>
													{course.salePrice && (
														<div className="flex justify-between">
															<span>Sale Price:</span>
															<span className="font-medium text-green-600">
																${course.salePrice.toFixed(2)}
															</span>
														</div>
													)}
													{course.salePrice && (
														<div className="flex justify-between">
															<span>Discount:</span>
															<span className="font-medium text-green-600">
																{(
																	((course.price - course.salePrice) /
																		course.price) *
																	100
																).toFixed(0)}
																% off
															</span>
														</div>
													)}
												</div>
											</CardContent>
										</Card>

										<Card>
											<CardHeader>
												<CardTitle className="text-lg">Course Stats</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div className="flex justify-between">
														<span>Total Students:</span>
														<span className="font-medium">
															{course.students.toLocaleString()}
														</span>
													</div>
													<div className="flex justify-between">
														<span>Rating:</span>
														<span className="flex items-center font-medium">
															{course.rating}
															<Star className="ml-1 h-4 w-4 text-yellow-500" />
															<span className="text-muted-foreground ml-1 text-sm">
																({course.reviews} reviews)
															</span>
														</span>
													</div>
													<div className="flex justify-between">
														<span>Content:</span>
														<span className="font-medium">
															{videoCount} videos, {quizCount} quizzes
														</span>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</TabsContent>

								<TabsContent value="curriculum" className="space-y-6">
									<div className="space-y-4">
										{course.curriculum.map((section, index) => (
											<Card key={section.id}>
												<CardHeader className="py-3">
													<CardTitle className="text-lg">
														Section {index + 1}: {section.title}
													</CardTitle>
												</CardHeader>
												<CardContent className="py-0">
													<div className="space-y-2">
														{section.lessons.map((lesson, lessonIndex) => (
															<div
																key={lesson.id}
																className="flex items-center justify-between border-b py-2 last:border-0"
															>
																<div className="flex items-center gap-2">
																	<span className="text-muted-foreground text-sm">
																		{lessonIndex + 1}.
																	</span>
																	<span>{lesson.title}</span>
																	{lesson.type === 'quiz' && (
																		<Badge variant="outline">Quiz</Badge>
																	)}
																</div>
																<span className="text-muted-foreground text-sm">
																	{lesson.duration}
																</span>
															</div>
														))}
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</TabsContent>

								<TabsContent value="students" className="space-y-6">
									<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-lg font-medium">Enrolled Students</h3>
											<p className="text-muted-foreground">
												Total: {course.students.toLocaleString()} students
											</p>
										</div>
										<Button variant="outline" size="sm" asChild>
											<Link
												to={`/dashboard/admin/courses/${params.id}/students`}
											>
												<Users className="mr-2 h-4 w-4" />
												View All Students
											</Link>
										</Button>
									</div>

									<div className="space-y-4">
										<h4 className="text-md font-medium">Recently Enrolled</h4>
										{course.recentStudents.map((student) => (
											<div
												key={student.id}
												className="flex items-center justify-between border-b pb-2 last:border-0"
											>
												<div className="flex items-center gap-2">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={student.image || '/placeholder.svg'}
															alt={student.name}
														/>
														<AvatarFallback>
															{student.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<Link
														to={`/dashboard/admin/students/${student.id}`}
														className="text-primary hover:underline"
													>
														{student.name}
													</Link>
												</div>
												<div className="flex items-center gap-2">
													<Calendar className="text-muted-foreground h-4 w-4" />
													<span className="text-muted-foreground text-sm">
														Enrolled on{' '}
														{new Date(
															student.enrolledDate,
														).toLocaleDateString()}
													</span>
												</div>
											</div>
										))}
									</div>

									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Enrollment Statistics
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div>
													<div className="mb-1 flex justify-between">
														<span className="text-sm font-medium">
															Monthly Enrollments
														</span>
														<span className="text-muted-foreground text-sm">
															+15% from last month
														</span>
													</div>
													<Progress value={65} className="h-2" />
												</div>
												<div>
													<div className="mb-1 flex justify-between">
														<span className="text-sm font-medium">
															Completion Rate
														</span>
														<span className="text-muted-foreground text-sm">
															72%
														</span>
													</div>
													<Progress value={72} className="h-2" />
												</div>
												<div>
													<div className="mb-1 flex justify-between">
														<span className="text-sm font-medium">
															Average Progress
														</span>
														<span className="text-muted-foreground text-sm">
															58%
														</span>
													</div>
													<Progress value={58} className="h-2" />
												</div>
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value="reviews" className="space-y-6">
									<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-lg font-medium">Course Reviews</h3>
											<p className="text-muted-foreground">
												{course.reviews} reviews with an average rating of{' '}
												{course.rating}
											</p>
										</div>
										<Button variant="outline" size="sm" asChild>
											<Link
												to={`/dashboard/admin/courses/${params.id}/reviews`}
											>
												<MessageSquare className="mr-2 h-4 w-4" />
												View All Reviews
											</Link>
										</Button>
									</div>

									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Rating Breakdown
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-2">
												{[5, 4, 3, 2, 1].map((rating) => (
													<div key={rating} className="flex items-center gap-2">
														<div className="flex w-12 items-center">
															<span>{rating}</span>
															<Star className="ml-1 h-4 w-4 text-yellow-500" />
														</div>
														<Progress
															value={
																rating === 5
																	? 70
																	: rating === 4
																		? 20
																		: rating === 3
																			? 7
																			: rating === 2
																				? 2
																				: 1
															}
															className="h-2 flex-1"
														/>
														<div className="text-muted-foreground w-12 text-right text-sm">
															{rating === 5
																? '70%'
																: rating === 4
																	? '20%'
																	: rating === 3
																		? '7%'
																		: rating === 2
																			? '2%'
																			: '1%'}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>

									<div className="space-y-4">
										<h4 className="text-md font-medium">Top Reviews</h4>
										{course.topReviews.map((review) => (
											<Card key={review.id}>
												<CardContent className="pt-6">
													<div className="mb-2 flex items-center justify-between">
														<div className="flex items-center gap-2">
															<Avatar className="h-8 w-8">
																<AvatarImage
																	src={
																		review.student.image || '/placeholder.svg'
																	}
																	alt={review.student.name}
																/>
																<AvatarFallback>
																	{review.student.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<div>
																<Link
																	to={`/dashboard/admin/students/${review.student.id}`}
																	className="text-primary hover:underline"
																>
																	{review.student.name}
																</Link>
																<div className="flex items-center">
																	{Array.from({ length: 5 }).map((_, i) => (
																		<Star
																			key={i}
																			className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
																			fill={
																				i < review.rating
																					? 'currentColor'
																					: 'none'
																			}
																		/>
																	))}
																</div>
															</div>
														</div>
														<div className="text-muted-foreground text-sm">
															{new Date(review.date).toLocaleDateString()}
														</div>
													</div>
													<p className="text-sm">{review.content}</p>
												</CardContent>
											</Card>
										))}
									</div>
								</TabsContent>

								<TabsContent value="resources" className="space-y-6">
									<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-lg font-medium">Course Resources</h3>
											<p className="text-muted-foreground">
												{course.resources.length} resources available for
												download
											</p>
										</div>
										<Button variant="outline" size="sm">
											<PlusCircle className="mr-2 h-4 w-4" />
											Add Resource
										</Button>
									</div>

									<div className="space-y-2">
										{course.resources.map((resource) => (
											<Card key={resource.id}>
												<CardContent className="flex items-center justify-between p-4">
													<div className="flex items-center gap-2">
														<FileText className="text-muted-foreground h-5 w-5" />
														<div>
															<p className="font-medium">{resource.title}</p>
															<p className="text-muted-foreground text-sm">
																{resource.type.toUpperCase()} • {resource.size}
															</p>
														</div>
													</div>
													<Button variant="ghost" size="sm">
														<Download className="h-4 w-4" />
														<span className="sr-only">Download</span>
													</Button>
												</CardContent>
											</Card>
										))}
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Course Thumbnail</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="aspect-video overflow-hidden rounded-md">
								<img
									src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1469&auto=format&fit=crop"
									alt={course.title}
									className="h-full w-full object-cover"
								/>
							</div>
						</CardContent>
						<CardFooter>
							<Button variant="outline" className="w-full">
								<PenLine className="mr-2 h-4 w-4" />
								Change Thumbnail
							</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Button className="w-full justify-start" asChild>
								<Link to={`/dashboard/admin/courses/${params.id}/edit`}>
									<Edit className="mr-2 h-4 w-4" />
									Edit Course
								</Link>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								asChild
							>
								<Link to={`/dashboard/admin/courses/${params.id}/curriculum`}>
									<LayoutGrid className="mr-2 h-4 w-4" />
									Manage Curriculum
								</Link>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								asChild
							>
								<Link to={`/dashboard/admin/courses/${params.id}/students`}>
									<Users className="mr-2 h-4 w-4" />
									View Students
								</Link>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								asChild
							>
								<Link to={`/dashboard/admin/courses/${params.id}/reviews`}>
									<MessageSquare className="mr-2 h-4 w-4" />
									Manage Reviews
								</Link>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-start"
								asChild
							>
								<Link to={`/dashboard/admin/courses/${params.id}/pricing`}>
									<DollarSign className="mr-2 h-4 w-4" />
									Update Pricing
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Related Courses</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="hover:bg-muted flex items-center gap-2 rounded-md p-2">
								<div className="h-12 w-12 overflow-hidden rounded">
									<img
										src="https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1470&auto=format&fit=crop"
										alt="Advanced JavaScript"
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">
										Advanced JavaScript Concepts
									</p>
									<p className="text-muted-foreground text-sm">Jane Doe</p>
								</div>
							</div>
							<div className="hover:bg-muted flex items-center gap-2 rounded-md p-2">
								<div className="h-12 w-12 overflow-hidden rounded">
									<img
										src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop"
										alt="React Hooks"
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">
										React Hooks Masterclass
									</p>
									<p className="text-muted-foreground text-sm">John Smith</p>
								</div>
							</div>
							<div className="hover:bg-muted flex items-center gap-2 rounded-md p-2">
								<div className="h-12 w-12 overflow-hidden rounded">
									<img
										src="https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?q=80&w=1470&auto=format&fit=crop"
										alt="TypeScript"
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">
										TypeScript for JavaScript Developers
									</p>
									<p className="text-muted-foreground text-sm">
										Sarah Williams
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
