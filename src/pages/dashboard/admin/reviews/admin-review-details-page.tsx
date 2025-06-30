import {
	ArrowLeft,
	Play,
	FileText,
	Users,
	Star,
	CheckCircle,
	XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseStatusBadge } from '@/components/courses/course-status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CourseReviewForm } from '@/components/courses/course-review-form';
import { Link } from 'react-router-dom';

// Mock data for a course submission
const courseSubmission = {
	id: '1',
	title: 'Advanced JavaScript Concepts',
	description:
		'Master advanced JavaScript concepts including closures, prototypes, async/await, and more. This comprehensive course will take you from intermediate to advanced level JavaScript development.',
	instructor: {
		id: 'i1',
		name: 'Jane Doe',
		image: '/instructor-1.jpg',
		bio: 'Senior JavaScript Developer with 10+ years of experience',
		rating: 4.8,
		totalStudents: 15420,
		totalCourses: 12,
	},
	submittedAt: '2023-09-15',
	status: 'submitted',
	category: 'Programming',
	subcategory: 'JavaScript',
	level: 'Advanced',
	price: 49.99,
	duration: '12 hours',
	sections: 8,
	lessons: 42,
	thumbnail: '/course-thumbnail.jpg',
	requirements: [
		'Intermediate knowledge of JavaScript',
		'Understanding of ES6+ features',
		'Basic knowledge of DOM manipulation',
		'Familiarity with async programming concepts',
	],
	learningOutcomes: [
		'Master advanced JavaScript concepts like closures and prototypes',
		'Understand asynchronous programming patterns',
		'Learn modern JavaScript best practices',
		'Build complex applications with confidence',
		'Debug and optimize JavaScript code effectively',
	],
	curriculum: [
		{
			id: 's1',
			title: 'Advanced Functions and Closures',
			lessons: [
				{
					id: 'l1',
					title: 'Understanding Closures',
					duration: '15 min',
					type: 'video',
				},
				{
					id: 'l2',
					title: 'Higher-Order Functions',
					duration: '20 min',
					type: 'video',
				},
				{
					id: 'l3',
					title: 'Function Composition',
					duration: '18 min',
					type: 'video',
				},
				{
					id: 'l4',
					title: 'Practice Exercise',
					duration: '30 min',
					type: 'exercise',
				},
			],
		},
		{
			id: 's2',
			title: 'Prototypes and Inheritance',
			lessons: [
				{
					id: 'l5',
					title: 'Prototype Chain',
					duration: '22 min',
					type: 'video',
				},
				{
					id: 'l6',
					title: 'Constructor Functions',
					duration: '18 min',
					type: 'video',
				},
				{ id: 'l7', title: 'ES6 Classes', duration: '25 min', type: 'video' },
				{
					id: 'l8',
					title: 'Inheritance Patterns',
					duration: '20 min',
					type: 'video',
				},
			],
		},
		{
			id: 's3',
			title: 'Asynchronous JavaScript',
			lessons: [
				{
					id: 'l9',
					title: 'Promises Deep Dive',
					duration: '28 min',
					type: 'video',
				},
				{
					id: 'l10',
					title: 'Async/Await Patterns',
					duration: '24 min',
					type: 'video',
				},
				{
					id: 'l11',
					title: 'Error Handling',
					duration: '16 min',
					type: 'video',
				},
				{
					id: 'l12',
					title: 'Async Project',
					duration: '45 min',
					type: 'project',
				},
			],
		},
	],
	notes:
		'This course is designed for intermediate JavaScript developers who want to take their skills to the next level. The instructor has provided comprehensive examples and practical exercises.',
	previousReviews: [
		{
			id: 'r1',
			reviewerId: 'admin1',
			reviewerName: 'Admin User',
			date: '2023-09-10',
			status: 'rejected',
			comments:
				'The course content needs more practical examples. Please add more hands-on exercises and real-world projects.',
			checklist: {
				contentQuality: false,
				technicalAccuracy: true,
				appropriateLength: true,
				clearExplanations: false,
				engagingDelivery: true,
			},
		},
	],
};

export default function CourseReviewPage() {
	// const _params = useParams<{ id: string }>();
	const course = courseSubmission; // In real app, fetch by params.id

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/admin/reviews">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Reviews
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
					<div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-sm">
						<span>By {course.instructor.name}</span>
						<span>•</span>
						<span>Submitted on {course.submittedAt}</span>
						<span>•</span>
						<CourseStatusBadge status={course.status as any} />
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline">
						<Play className="mr-2 h-4 w-4" />
						Preview Course
					</Button>
					<Button variant="outline">
						<FileText className="mr-2 h-4 w-4" />
						Download Materials
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="pb-0">
							<Tabs defaultValue="overview" className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
									<TabsTrigger value="history">Review History</TabsTrigger>
								</TabsList>
								<TabsContent value="overview" className="mt-6">
									<div className="space-y-6">
										<div>
											<h3 className="mb-3 text-lg font-semibold">
												Course Description
											</h3>
											<p className="text-muted-foreground leading-relaxed">
												{course.description}
											</p>
										</div>

										<Separator />

										<div>
											<h3 className="mb-3 text-lg font-semibold">
												Learning Outcomes
											</h3>
											<ul className="space-y-2">
												{course.learningOutcomes.map((outcome, index) => (
													<li key={index} className="flex items-start gap-2">
														<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
														<span className="text-sm">{outcome}</span>
													</li>
												))}
											</ul>
										</div>

										<Separator />

										<div>
											<h3 className="mb-3 text-lg font-semibold">
												Requirements
											</h3>
											<ul className="space-y-2">
												{course.requirements.map((requirement, index) => (
													<li key={index} className="flex items-start gap-2">
														<div className="bg-muted-foreground mt-2 h-2 w-2 flex-shrink-0 rounded-full" />
														<span className="text-sm">{requirement}</span>
													</li>
												))}
											</ul>
										</div>

										{course.notes && (
											<>
												<Separator />
												<div>
													<h3 className="mb-3 text-lg font-semibold">
														Instructor Notes
													</h3>
													<p className="text-muted-foreground bg-muted rounded-lg p-4 text-sm">
														{course.notes}
													</p>
												</div>
											</>
										)}
									</div>
								</TabsContent>

								<TabsContent value="curriculum" className="mt-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="text-lg font-semibold">
												Course Curriculum
											</h3>
											<div className="text-muted-foreground text-sm">
												{course.sections} sections • {course.lessons} lessons •{' '}
												{course.duration}
											</div>
										</div>

										<div className="space-y-4">
											{course.curriculum.map((section, sectionIndex) => (
												<Card key={section.id}>
													<CardHeader className="pb-3">
														<CardTitle className="text-base">
															Section {sectionIndex + 1}: {section.title}
														</CardTitle>
													</CardHeader>
													<CardContent>
														<div className="space-y-2">
															{section.lessons.map((lesson, lessonIndex) => (
																<div
																	key={lesson.id}
																	className="hover:bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2"
																>
																	<div className="flex items-center gap-3">
																		<span className="text-muted-foreground w-6 text-sm">
																			{lessonIndex + 1}.
																		</span>
																		<div className="flex items-center gap-2">
																			{lesson.type === 'video' && (
																				<Play className="h-4 w-4 text-blue-500" />
																			)}
																			{lesson.type === 'exercise' && (
																				<FileText className="h-4 w-4 text-green-500" />
																			)}
																			{lesson.type === 'project' && (
																				<Users className="h-4 w-4 text-purple-500" />
																			)}
																			<span className="text-sm font-medium">
																				{lesson.title}
																			</span>
																		</div>
																	</div>
																	<div className="flex items-center gap-2">
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			{lesson.type}
																		</Badge>
																		<span className="text-muted-foreground text-xs">
																			{lesson.duration}
																		</span>
																	</div>
																</div>
															))}
														</div>
													</CardContent>
												</Card>
											))}
										</div>
									</div>
								</TabsContent>

								<TabsContent value="history" className="mt-6">
									<div className="space-y-4">
										<h3 className="text-lg font-semibold">Review History</h3>

										{course.previousReviews.length === 0 ? (
											<div className="py-8 text-center">
												<FileText className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
												<p className="text-muted-foreground">
													No previous reviews
												</p>
											</div>
										) : (
											<div className="space-y-4">
												{course.previousReviews.map((review) => (
													<Card key={review.id}>
														<CardHeader>
															<div className="flex items-center justify-between">
																<div className="flex items-center gap-3">
																	<Avatar className="h-8 w-8">
																		<AvatarFallback>
																			{review.reviewerName.charAt(0)}
																		</AvatarFallback>
																	</Avatar>
																	<div>
																		<p className="font-medium">
																			{review.reviewerName}
																		</p>
																		<p className="text-muted-foreground text-sm">
																			{review.date}
																		</p>
																	</div>
																</div>
																<Badge
																	variant={
																		review.status === 'approved'
																			? 'default'
																			: 'destructive'
																	}
																>
																	{review.status === 'approved' ? (
																		<CheckCircle className="mr-1 h-3 w-3" />
																	) : (
																		<XCircle className="mr-1 h-3 w-3" />
																	)}
																	{review.status}
																</Badge>
															</div>
														</CardHeader>
														<CardContent>
															<p className="mb-4 text-sm">{review.comments}</p>

															<div className="grid grid-cols-2 gap-4 text-sm">
																<div className="space-y-2">
																	<h4 className="font-medium">
																		Review Checklist:
																	</h4>
																	<div className="space-y-1">
																		{Object.entries(review.checklist).map(
																			([key, value]) => (
																				<div
																					key={key}
																					className="flex items-center gap-2"
																				>
																					{value ? (
																						<CheckCircle className="h-4 w-4 text-green-500" />
																					) : (
																						<XCircle className="h-4 w-4 text-red-500" />
																					)}
																					<span className="capitalize">
																						{key
																							.replace(/([A-Z])/g, ' $1')
																							.toLowerCase()}
																					</span>
																				</div>
																			),
																		)}
																	</div>
																</div>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										)}
									</div>
								</TabsContent>
							</Tabs>
						</CardHeader>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Course Details</CardTitle>
							<CardDescription>
								Basic information about this course
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Category</span>
									<Badge variant="outline">{course.category}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Subcategory</span>
									<Badge variant="outline">{course.subcategory}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Level</span>
									<Badge variant="outline">{course.level}</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Price</span>
									<span className="text-sm font-medium">${course.price}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Duration</span>
									<span className="text-sm">{course.duration}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Sections</span>
									<span className="text-sm">{course.sections}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Lessons</span>
									<span className="text-sm">{course.lessons}</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Instructor Information</CardTitle>
							<CardDescription>About the course instructor</CardDescription>
						</CardHeader>
						<CardContent>
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
									<p className="font-medium">{course.instructor.name}</p>
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<span className="text-sm">{course.instructor.rating}</span>
									</div>
								</div>
							</div>

							<p className="text-muted-foreground mb-4 text-sm">
								{course.instructor.bio}
							</p>

							<div className="space-y-2 text-sm">
								<div className="flex items-center justify-between">
									<span>Total Students</span>
									<span className="font-medium">
										{course.instructor.totalStudents.toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Total Courses</span>
									<span className="font-medium">
										{course.instructor.totalCourses}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					<CourseReviewForm courseId={course.id} courseName={course.title} />
				</div>
			</div>
		</div>
	);
}
