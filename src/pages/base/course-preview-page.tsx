import { useEffect, useState } from 'react';

import {
	ArrowLeft,
	BookOpen,
	CheckCircle,
	Clock,
	Play,
	Star,
	Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Link, useParams } from 'react-router-dom';

// Mock course data
const mockCourseData = {
	id: '2',
	title: 'Complete Web Development Bootcamp',
	subtitle:
		'From Zero to Hero with HTML, CSS, JavaScript, React, Node.js and more',
	description:
		"This comprehensive web development bootcamp covers everything you need to know to become a full-stack web developer. Starting with the fundamentals of HTML and CSS, you'll progress through JavaScript, React, Node.js, and more advanced topics. By the end of this course, you'll have built several real-world projects and gained the skills needed to land your first web development job.",
	instructor: {
		id: 'i1',
		name: 'Jane Doe',
		title: 'Senior Web Developer',
		bio: 'Jane has over 10 years of experience in web development and has worked with companies like Google and Microsoft.',
		image: '/instructor-1.jpg',
	},
	price: 129.99,
	originalPrice: 199.99,
	discount: 35,
	rating: 4.7,
	totalRatings: 328,
	students: 1245,
	lastUpdated: 'December 2023',
	language: 'English',
	level: 'All Levels',
	duration: '42h 30m',
	image: '/javascript-code-abstract.png',
	goals: [
		'Build responsive websites with HTML5 and CSS3',
		'Master JavaScript including ES6+ features',
		'Create interactive front-end applications with React',
		'Develop back-end APIs with Node.js and Express',
		'Work with databases including MongoDB and SQL',
		'Deploy full-stack applications to production',
	],
	prerequisites: [
		'Basic computer skills',
		'No prior programming experience required',
	],
	targetAudience:
		'This course is perfect for beginners with no coding experience, as well as intermediate developers looking to expand their skills into full-stack development. Anyone interested in learning web development from scratch or enhancing their existing knowledge will benefit from this comprehensive bootcamp.',
	curriculum: [
		{
			id: 's1',
			title: 'Introduction to Web Development',
			duration: '2h 15m',
			contents: [
				{
					id: 'c1',
					title: 'Welcome to the Course',
					type: 'video',
					duration: '10:25',
					isPreview: true,
					isCompleted: false,
				},
				{
					id: 'c2',
					title: 'How the Internet Works',
					type: 'video',
					duration: '15:40',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c3',
					title: 'Setting Up Your Development Environment',
					type: 'video',
					duration: '20:15',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c4',
					title: 'Web Development Overview Quiz',
					type: 'quiz',
					duration: '15:00',
					isPreview: false,
					isCompleted: false,
				},
			],
		},
		{
			id: 's2',
			title: 'HTML Fundamentals',
			duration: '4h 30m',
			contents: [
				{
					id: 'c5',
					title: 'HTML Document Structure',
					type: 'video',
					duration: '18:30',
					isPreview: true,
					isCompleted: false,
				},
				{
					id: 'c6',
					title: 'HTML Tags and Elements',
					type: 'video',
					duration: '25:45',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c7',
					title: 'Forms and Input Elements',
					type: 'video',
					duration: '22:10',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c8',
					title: 'HTML5 Semantic Elements',
					type: 'video',
					duration: '19:50',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c9',
					title: 'HTML Project: Build a Personal Website',
					type: 'project',
					duration: '45:00',
					isPreview: false,
					isCompleted: false,
				},
			],
		},
		{
			id: 's3',
			title: 'CSS Styling',
			duration: '6h 45m',
			contents: [
				{
					id: 'c10',
					title: 'CSS Selectors and Properties',
					type: 'video',
					duration: '24:15',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c11',
					title: 'Box Model and Layout',
					type: 'video',
					duration: '28:30',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c12',
					title: 'Flexbox and Grid',
					type: 'video',
					duration: '35:20',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c13',
					title: 'Responsive Design',
					type: 'video',
					duration: '30:45',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c14',
					title: 'CSS Animations and Transitions',
					type: 'video',
					duration: '22:10',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c15',
					title: 'CSS Project: Styling Your Personal Website',
					type: 'project',
					duration: '50:00',
					isPreview: false,
					isCompleted: false,
				},
			],
		},
		{
			id: 's4',
			title: 'JavaScript Basics',
			duration: '8h 20m',
			contents: [
				{
					id: 'c16',
					title: 'Introduction to JavaScript',
					type: 'video',
					duration: '15:30',
					isPreview: true,
					isCompleted: false,
				},
				{
					id: 'c17',
					title: 'Variables and Data Types',
					type: 'video',
					duration: '22:45',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c18',
					title: 'Operators and Expressions',
					type: 'video',
					duration: '18:20',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c19',
					title: 'Control Flow: Conditionals',
					type: 'video',
					duration: '25:10',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c20',
					title: 'Control Flow: Loops',
					type: 'video',
					duration: '23:40',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c21',
					title: 'Functions',
					type: 'video',
					duration: '30:15',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c22',
					title: 'Arrays and Objects',
					type: 'video',
					duration: '35:30',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c23',
					title: 'JavaScript Basics Quiz',
					type: 'quiz',
					duration: '20:00',
					isPreview: false,
					isCompleted: false,
				},
				{
					id: 'c24',
					title: 'JavaScript Project: Interactive Website',
					type: 'project',
					duration: '1:15:00',
					isPreview: false,
					isCompleted: false,
				},
			],
		},
	],
};

export default function CoursePreviewPage() {
	// const _navigate = useNavigate()
	const params = useParams<{ id: string }>();
	const [course, setCourse] = useState<typeof mockCourseData | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchCourse = async () => {
			setIsLoading(true);
			try {
				// In a real app, fetch from API
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setCourse(mockCourseData);
			} catch (error) {
				console.error('Error fetching course:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCourse();
	}, [params.id]);

	if (isLoading) {
		return (
			<div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10 md:px-6">
				<div className="text-center">
					<div className="border-primary mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
					<h2 className="mb-2 text-2xl font-bold">Loading course preview...</h2>
					<p className="text-muted-foreground">
						Please wait while we load the course details.
					</p>
				</div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="container mx-auto px-4 py-10 md:px-6">
				<div className="py-20 text-center">
					<h2 className="mb-2 text-2xl font-bold">Course Not Found</h2>
					<p className="text-muted-foreground mb-6">
						The course you're looking for doesn't exist or has been removed.
					</p>
					<Button asChild>
						<Link to="/courses">Browse Courses</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Calculate total lectures and total duration
	const totalLectures = course.curriculum.reduce(
		(total, section) =>
			total +
			section.contents.filter((content) => content.type === 'video').length,
		0,
	);

	// Format the content type with proper icon
	const getContentTypeIcon = (type: string) => {
		switch (type) {
			case 'video':
				return <Play className="h-4 w-4" />;
			case 'quiz':
				return <BookOpen className="h-4 w-4" />;
			case 'project':
				return <BookOpen className="h-4 w-4" />;
			default:
				return <BookOpen className="h-4 w-4" />;
		}
	};

	return (
		<div className="container mx-auto px-4 py-10 md:px-6">
			<div className="mb-6">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/courses">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Courses
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Main Content */}
				<div className="space-y-8 lg:col-span-2">
					{/* Course Header */}
					<div>
						<h1 className="mb-2 text-3xl font-bold tracking-tight">
							{course.title}
						</h1>
						<p className="text-muted-foreground mb-4 text-xl">
							{course.subtitle}
						</p>

						<div className="mb-6 flex flex-wrap items-center gap-4">
							<div className="flex items-center">
								<Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
								<span className="ml-1 font-medium">{course.rating}</span>
								<span className="text-muted-foreground ml-1">
									({course.totalRatings} ratings)
								</span>
							</div>
							<div className="flex items-center">
								<Users className="text-muted-foreground h-5 w-5" />
								<span className="ml-1">{course.students} students</span>
							</div>
							<div className="flex items-center">
								<Clock className="text-muted-foreground h-5 w-5" />
								<span className="ml-1">{course.duration} total</span>
							</div>
							<div>
								<Badge variant="outline">{course.level}</Badge>
							</div>
						</div>

						<div className="mb-6 flex items-center gap-3">
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
								<p className="font-medium">
									Created by {course.instructor.name}
								</p>
								<p className="text-muted-foreground text-sm">
									{course.instructor.title}
								</p>
							</div>
						</div>

						<div className="mb-6 lg:hidden">
							<Card>
								<CardContent className="p-0">
									<div className="aspect-video w-full overflow-hidden">
										<img
											src={course.image || '/placeholder.svg'}
											alt={course.title}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="p-6">
										<div className="mb-4">
											<div className="mb-2 text-3xl font-bold">
												${course.price}
											</div>
											<div className="flex items-center gap-2">
												<span className="text-muted-foreground line-through">
													${course.originalPrice}
												</span>
												<span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-sm">
													{course.discount}% off
												</span>
											</div>
										</div>
										<Button className="mb-3 w-full">Enroll Now</Button>
										<p className="text-muted-foreground mb-4 text-center text-sm">
											30-Day Money-Back Guarantee
										</p>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Full lifetime access</span>
											</div>
											<div className="flex justify-between">
												<span>Access on mobile and TV</span>
											</div>
											<div className="flex justify-between">
												<span>Certificate of completion</span>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Tabs for course content */}
					<Tabs defaultValue="overview">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
							<TabsTrigger value="instructor">Instructor</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-6 pt-6">
							<div>
								<h2 className="mb-4 text-xl font-semibold">
									About This Course
								</h2>
								<div className="prose dark:prose-invert max-w-none">
									<p>{course.description}</p>
								</div>
							</div>

							<Separator />

							<div>
								<h2 className="mb-4 text-xl font-semibold">
									What You'll Learn
								</h2>
								<ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
									{course.goals.map((goal, index) => (
										<li key={index} className="flex items-start gap-2">
											<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
											<span>{goal}</span>
										</li>
									))}
								</ul>
							</div>

							<Separator />

							<div>
								<h2 className="mb-4 text-xl font-semibold">Requirements</h2>
								<ul className="space-y-2">
									{course.prerequisites.map((prerequisite, index) => (
										<li key={index} className="flex items-start gap-2">
											<div className="bg-foreground mt-2 h-1.5 w-1.5 rounded-full" />
											<span>{prerequisite}</span>
										</li>
									))}
								</ul>
							</div>

							<Separator />

							<div>
								<h2 className="mb-4 text-xl font-semibold">
									Who This Course is For
								</h2>
								<p>{course.targetAudience}</p>
							</div>
						</TabsContent>

						<TabsContent value="curriculum" className="pt-6">
							<div className="mb-4">
								<h2 className="text-xl font-semibold">Course Content</h2>
								<p className="text-muted-foreground">
									{course.curriculum.length} sections • {totalLectures} lectures
									• {course.duration} total length
								</p>
							</div>

							<Accordion type="multiple" className="w-full">
								{course.curriculum.map((section, sectionIndex) => (
									<AccordionItem key={section.id} value={section.id}>
										<AccordionTrigger className="hover:bg-muted/50 rounded-md px-4 py-2">
											<div className="flex flex-col items-start text-left">
												<div className="font-medium">
													Section {sectionIndex + 1}: {section.title}
												</div>
												<div className="text-muted-foreground text-sm">
													{section.contents.length} lectures •{' '}
													{section.duration}
												</div>
											</div>
										</AccordionTrigger>
										<AccordionContent className="px-4">
											<ul className="space-y-1">
												{section.contents.map((content, contentIndex) => (
													<li
														key={content.id}
														className="border-b py-2 last:border-0"
													>
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																{getContentTypeIcon(content.type)}
																<span>
																	{sectionIndex + 1}.{contentIndex + 1}{' '}
																	{content.title}
																</span>
																{content.isPreview && (
																	<Badge variant="outline" className="ml-2">
																		Preview
																	</Badge>
																)}
															</div>
															<div className="text-muted-foreground text-sm">
																{content.duration}
															</div>
														</div>
													</li>
												))}
											</ul>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</TabsContent>

						<TabsContent value="instructor" className="pt-6">
							<div className="mb-6 flex items-start gap-4">
								<Avatar className="h-16 w-16">
									<AvatarImage
										src={course.instructor.image || '/placeholder.svg'}
										alt={course.instructor.name}
									/>
									<AvatarFallback>
										{course.instructor.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="text-xl font-semibold">
										{course.instructor.name}
									</h2>
									<p className="text-muted-foreground">
										{course.instructor.title}
									</p>
								</div>
							</div>
							<div className="prose dark:prose-invert max-w-none">
								<p>{course.instructor.bio}</p>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				{/* Sidebar */}
				<div className="hidden lg:block">
					<div className="sticky top-20">
						<Card>
							<CardContent className="p-0">
								<div className="aspect-video w-full overflow-hidden">
									<img
										src={course.image || '/placeholder.svg'}
										alt={course.title}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="p-6">
									<div className="mb-4">
										<div className="mb-2 text-3xl font-bold">
											${course.price}
										</div>
										<div className="flex items-center gap-2">
											<span className="text-muted-foreground line-through">
												${course.originalPrice}
											</span>
											<span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-sm">
												{course.discount}% off
											</span>
										</div>
									</div>
									<Button className="mb-3 w-full">Enroll Now</Button>
									<p className="text-muted-foreground mb-4 text-center text-sm">
										30-Day Money-Back Guarantee
									</p>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span>Full lifetime access</span>
										</div>
										<div className="flex justify-between">
											<span>Access on mobile and TV</span>
										</div>
										<div className="flex justify-between">
											<span>Certificate of completion</span>
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className="bg-muted/50 p-4">
								<Button variant="outline" className="w-full">
									Gift this course
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
