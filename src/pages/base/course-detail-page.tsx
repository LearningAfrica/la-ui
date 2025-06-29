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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Header } from '@/components/header';
import {
	Star,
	Clock,
	Users,
	Play,
	FileText,
	Download,
	CheckCircle,
	BookOpen,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Mock course data
const coursesData = [
	{
		id: '1',
		title: 'Complete JavaScript Course',
		description:
			'Master JavaScript with the most comprehensive course available. This course is designed to take you from beginner to advanced level, covering everything from basic syntax to complex design patterns and modern ES6+ features.',
		category: 'Programming',
		level: 'All Levels',
		price: 89.99,
		discountPrice: 49.99,
		image: '/javascript-course.jpg',
		lastUpdated: '2023-10-15',
		language: 'English',
		instructor: {
			id: 'i1',
			name: 'Jane Doe',
			title: 'Senior JavaScript Developer',
			image: '/instructor-1.jpg',
			bio: "Jane has over 10 years of experience in web development and has worked with companies like Google and Facebook. She's passionate about teaching and has helped over 100,000 students learn JavaScript.",
			courses: 12,
			students: 150000,
			rating: 4.8,
		},
		duration: '42h 30m',
		totalLessons: 156,
		totalSections: 12,
		rating: 4.8,
		totalRatings: 15432,
		students: 45678,
		requirements: [
			'Basic understanding of HTML and CSS',
			'No prior JavaScript knowledge needed',
			'A computer with internet access',
			'Willingness to learn and practice',
		],
		goals: [
			'Understand JavaScript from the ground up',
			'Build real-world projects with JavaScript',
			'Master modern ES6+ syntax and features',
			'Learn DOM manipulation and event handling',
			'Understand asynchronous programming with Promises and async/await',
			'Build applications with modern frameworks',
		],
		curriculum: [
			{
				id: 's1',
				title: 'Getting Started',
				lessons: [
					{
						id: 'l1',
						title: 'Course Introduction',
						duration: '10:25',
						type: 'video',
						preview: true,
					},
					{
						id: 'l2',
						title: 'Setting Up Your Environment',
						duration: '15:40',
						type: 'video',
						preview: false,
					},
					{
						id: 'l3',
						title: 'JavaScript Basics Quiz',
						duration: '15:00',
						type: 'quiz',
						preview: false,
					},
				],
			},
			{
				id: 's2',
				title: 'JavaScript Fundamentals',
				lessons: [
					{
						id: 'l4',
						title: 'Variables and Data Types',
						duration: '18:30',
						type: 'video',
						preview: true,
					},
					{
						id: 'l5',
						title: 'Operators and Expressions',
						duration: '22:15',
						type: 'video',
						preview: false,
					},
					{
						id: 'l6',
						title: 'Control Flow',
						duration: '25:45',
						type: 'video',
						preview: false,
					},
					{
						id: 'l7',
						title: 'Functions',
						duration: '30:20',
						type: 'video',
						preview: false,
					},
					{
						id: 'l8',
						title: 'Fundamentals Practice Assignment',
						duration: '45:00',
						type: 'assignment',
						preview: false,
					},
				],
			},
			{
				id: 's3',
				title: 'Advanced JavaScript Concepts',
				lessons: [
					{
						id: 'l9',
						title: 'Objects and Prototypes',
						duration: '28:15',
						type: 'video',
						preview: false,
					},
					{
						id: 'l10',
						title: 'Classes and OOP',
						duration: '32:40',
						type: 'video',
						preview: false,
					},
					{
						id: 'l11',
						title: 'Asynchronous JavaScript',
						duration: '35:10',
						type: 'video',
						preview: false,
					},
					{
						id: 'l12',
						title: 'Advanced Concepts Quiz',
						duration: '20:00',
						type: 'quiz',
						preview: false,
					},
				],
			},
		],
		reviews: [
			{
				id: 'r1',
				student: 'John Smith',
				studentImage: '/student-1.jpg',
				rating: 5,
				date: '2024-01-20',
				content:
					'Excellent course! The explanations are clear and the projects are very practical.',
			},
			{
				id: 'r2',
				student: 'Sarah Johnson',
				studentImage: '/student-2.jpg',
				rating: 4,
				date: '2024-01-15',
				content: 'Great content, but some sections could use more examples.',
			},
			{
				id: 'r3',
				student: 'Michael Brown',
				studentImage: '/student-3.jpg',
				rating: 5,
				date: '2024-01-10',
				content:
					'This course helped me land my first developer job! Highly recommended.',
			},
		],
	},
];

export default function CourseDetailPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const params = useParams<{ id: string }>();

	// Find course by ID
	const course = coursesData.find((c) => c.id === params.id);

	if (!course) {
		return (
			<div className="flex-1">
				<Header />
				<div className="container py-8">
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<h2 className="mb-2 text-xl font-semibold">Course Not Found</h2>
							<p className="text-muted-foreground mb-6">
								The requested course could not be found.
							</p>
							<Button asChild>
								<Link to="/courses">Browse Courses</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Render star rating
	const renderStars = (rating: number) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(
				<Star
					key={`star-${i}`}
					className="h-4 w-4 fill-yellow-400 text-yellow-400"
				/>,
			);
		}

		if (hasHalfStar) {
			stars.push(
				<Star
					key="half-star"
					className="h-4 w-4 fill-yellow-400 text-yellow-400"
				/>,
			);
		}

		const emptyStars = 5 - stars.length;
		for (let i = 0; i < emptyStars; i++) {
			stars.push(
				<Star
					key={`empty-star-${i}`}
					className="text-muted-foreground h-4 w-4"
				/>,
			);
		}

		return stars;
	};

	// Calculate total course content
	const totalVideos = course.curriculum.reduce(
		(acc, section) =>
			acc + section.lessons.filter((lesson) => lesson.type === 'video').length,
		0,
	);
	const totalQuizzes = course.curriculum.reduce(
		(acc, section) =>
			acc + section.lessons.filter((lesson) => lesson.type === 'quiz').length,
		0,
	);
	const totalAssignments = course.curriculum.reduce(
		(acc, section) =>
			acc +
			section.lessons.filter((lesson) => lesson.type === 'assignment').length,
		0,
	);

	return (
		<div className="flex-1">
			<Header />

			{/* Course Hero */}
			<div className="bg-muted py-8">
				<div className="container">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						<div className="lg:col-span-2">
							<h1 className="mb-4 text-3xl font-bold">{course.title}</h1>
							<p className="mb-4 text-lg">{course.description}</p>

							<div className="mb-4 flex flex-wrap items-center gap-4">
								<div className="flex items-center">
									<div className="mr-1 flex">{renderStars(course.rating)}</div>
									<span className="font-medium">{course.rating}</span>
									<span className="text-muted-foreground ml-1">
										({course.totalRatings.toLocaleString()} ratings)
									</span>
								</div>
								<div className="flex items-center">
									<Users className="text-muted-foreground mr-1 h-4 w-4" />
									<span>{course.students.toLocaleString()} students</span>
								</div>
								<div className="flex items-center">
									<Clock className="text-muted-foreground mr-1 h-4 w-4" />
									<span>{course.duration} total length</span>
								</div>
								<Badge>{course.level}</Badge>
								<Badge variant="outline">{course.language}</Badge>
								<div className="text-sm">
									Last updated: {course.lastUpdated}
								</div>
							</div>

							<div className="mb-4 flex items-center gap-3">
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
									<p className="font-medium">Created by</p>
									<Link
										to={`/instructors/${course.instructor.id}`}
										className="text-primary hover:underline"
									>
										{course.instructor.name}
									</Link>
								</div>
							</div>
						</div>

						<div>
							<Card className="sticky top-24">
								<div className="aspect-video w-full overflow-hidden">
									<img
										src={course.image || '/placeholder.svg'}
										alt={course.title}
										className="h-full w-full object-cover"
									/>
								</div>
								<CardContent className="p-6">
									<div className="mb-4">
										<div className="flex items-center justify-between">
											<span className="text-3xl font-bold">
												${course.discountPrice.toFixed(2)}
											</span>
											<span className="text-muted-foreground text-lg line-through">
												${course.price.toFixed(2)}
											</span>
										</div>
										<p className="text-muted-foreground text-sm">
											{Math.round(
												((course.price - course.discountPrice) / course.price) *
													100,
											)}
											% off
										</p>
									</div>

									<Button className="mb-4 w-full">Enroll Now</Button>

									<div className="space-y-4">
										<div className="text-muted-foreground text-center text-sm">
											30-Day Money-Back Guarantee
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<BookOpen className="text-muted-foreground h-4 w-4" />
												<span>{course.totalLessons} lessons</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="text-muted-foreground h-4 w-4" />
												<span>{course.duration} total length</span>
											</div>
											<div className="flex items-center gap-2">
												<Play className="text-muted-foreground h-4 w-4" />
												<span>{totalVideos} videos</span>
											</div>
											<div className="flex items-center gap-2">
												<FileText className="text-muted-foreground h-4 w-4" />
												<span>
													{totalQuizzes} quizzes, {totalAssignments} assignments
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Download className="text-muted-foreground h-4 w-4" />
												<span>Downloadable resources</span>
											</div>
											<div className="flex items-center gap-2">
												<CheckCircle className="text-muted-foreground h-4 w-4" />
												<span>Certificate of completion</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Course Content */}
			<div className="container py-8">
				<Tabs
					defaultValue="overview"
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-8"
				>
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
						<TabsTrigger value="instructor">Instructor</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle>What You'll Learn</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
									{course.goals.map((goal, index) => (
										<li key={index} className="flex items-start gap-2">
											<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
											<span>{goal}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Requirements</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{course.requirements.map((requirement, index) => (
										<li key={index} className="flex items-start gap-2">
											<div className="bg-foreground mt-2 h-1.5 w-1.5 rounded-full" />
											<span>{requirement}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Course Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="whitespace-pre-line">{course.description}</p>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="curriculum" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Course Content</CardTitle>
								<CardDescription>
									{course.totalSections} sections • {course.totalLessons}{' '}
									lessons • {course.duration} total length
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Accordion type="single" collapsible className="w-full">
									{course.curriculum.map((section, sectionIndex) => (
										<AccordionItem key={section.id} value={section.id}>
											<AccordionTrigger>
												<div className="flex flex-col items-start text-left">
													<div>
														Section {sectionIndex + 1}: {section.title}
													</div>
													<div className="text-muted-foreground text-sm">
														{section.lessons.length} lessons •{' '}
														{section.lessons.reduce((acc, lesson) => {
															const [min, sec] = lesson.duration.split(':');
															return (
																acc +
																Number.parseInt(min) * 60 +
																Number.parseInt(sec)
															);
														}, 0) / 60}{' '}
														min
													</div>
												</div>
											</AccordionTrigger>
											<AccordionContent>
												<div className="space-y-2">
													{section.lessons.map((lesson, lessonIndex) => (
														<div
															key={lesson.id}
															className="hover:bg-muted flex items-center justify-between rounded-md p-2"
														>
															<div className="flex items-center gap-2">
																{lesson.type === 'video' ? (
																	<Play className="text-muted-foreground h-4 w-4" />
																) : lesson.type === 'quiz' ? (
																	<FileText className="text-muted-foreground h-4 w-4" />
																) : (
																	<Download className="text-muted-foreground h-4 w-4" />
																)}
																<span>
																	{sectionIndex + 1}.{lessonIndex + 1}{' '}
																	{lesson.title}
																	{lesson.preview && (
																		<Badge variant="outline" className="ml-2">
																			Preview
																		</Badge>
																	)}
																</span>
															</div>
															<span className="text-muted-foreground text-sm">
																{lesson.duration}
															</span>
														</div>
													))}
												</div>
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="instructor" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>About the Instructor</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col gap-6 md:flex-row">
									<div className="md:w-1/4">
										<Avatar className="h-32 w-32">
											<AvatarImage
												src={course.instructor.image || '/placeholder.svg'}
												alt={course.instructor.name}
											/>
											<AvatarFallback>
												{course.instructor.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<h3 className="mt-4 text-lg font-medium">
											{course.instructor.name}
										</h3>
										<p className="text-muted-foreground text-sm">
											{course.instructor.title}
										</p>

										<div className="mt-4 flex items-center gap-4">
											<div>
												<p className="font-semibold">
													{course.instructor.courses}
												</p>
												<p className="text-muted-foreground text-xs">Courses</p>
											</div>
											<div>
												<p className="font-semibold">
													{course.instructor.students.toLocaleString()}
												</p>
												<p className="text-muted-foreground text-xs">
													Students
												</p>
											</div>
											<div>
												<p className="font-semibold">
													{course.instructor.rating}
												</p>
												<p className="text-muted-foreground text-xs">Rating</p>
											</div>
										</div>
									</div>

									<div className="md:w-3/4">
										<p className="whitespace-pre-line">
											{course.instructor.bio}
										</p>

										<Button variant="outline" className="mt-4" asChild>
											<Link to={`/instructors/${course.instructor.id}`}>
												View Profile
											</Link>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="reviews" className="space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Student Reviews</CardTitle>
								<CardDescription>
									{course.totalRatings.toLocaleString()} reviews •{' '}
									{course.rating} average rating
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{course.reviews.map((review) => (
										<div
											key={review.id}
											className="border-b pb-6 last:border-0 last:pb-0"
										>
											<div className="flex items-start justify-between">
												<div className="flex items-start gap-3">
													<Avatar>
														<AvatarImage
															src={review.studentImage || '/placeholder.svg'}
															alt={review.student}
														/>
														<AvatarFallback>
															{review.student.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">{review.student}</div>
														<div className="mt-1 flex items-center gap-1">
															{renderStars(review.rating)}
														</div>
														<p className="mt-2">{review.content}</p>
													</div>
												</div>
												<span className="text-muted-foreground text-sm">
													{review.date}
												</span>
											</div>
										</div>
									))}
								</div>
							</CardContent>
							<CardFooter>
								<Button variant="outline" className="w-full">
									Load More Reviews
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
