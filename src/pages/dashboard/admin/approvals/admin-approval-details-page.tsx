'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, CheckCircle, Clock, Play, XCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Mock course data
const coursesData = [
	{
		id: '1',
		title: 'Advanced React Patterns',
		instructor: 'Jane Smith',
		instructorId: 'ins-1',
		category: 'Programming',
		submitted: '2024-02-01',
		status: 'pending',
		lessons: 42,
		duration: '8h 30m',
		price: 89.99,
		description:
			'Master advanced React patterns and techniques used by top developers. Learn how to build scalable, maintainable React applications using the latest best practices.',
		curriculum: [
			{
				title: 'Introduction to Advanced Patterns',
				lessons: [
					{ title: 'Course Overview', duration: '10:25' },
					{ title: 'Setting Up Your Environment', duration: '15:40' },
				],
			},
			{
				title: 'Compound Components',
				lessons: [
					{ title: 'Understanding Compound Components', duration: '18:30' },
					{ title: 'Building a Compound Component', duration: '22:15' },
					{ title: 'Advanced Usage Patterns', duration: '16:45' },
				],
			},
			{
				title: 'Render Props Pattern',
				lessons: [
					{ title: 'Introduction to Render Props', duration: '14:20' },
					{ title: 'Implementing Render Props', duration: '20:10' },
					{ title: 'Comparing with Other Patterns', duration: '17:35' },
				],
			},
		],
		requirements: [
			'Intermediate knowledge of React',
			'Familiarity with JavaScript ES6+',
			'Basic understanding of TypeScript',
			'Node.js and npm installed on your computer',
		],
		goals: [
			'Master advanced React patterns',
			'Build scalable component architectures',
			'Implement state management strategies',
			'Create reusable custom hooks',
			'Optimize React applications for performance',
		],
		preview: '/advanced-react-preview.jpg',
	},
];

export default function CourseApprovalDetailPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
	const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState('');
	const [activeTab, setActiveTab] = useState('overview');

	// Find course by ID
	const course = coursesData.find((c) => c.id === params.id);

	if (!course) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/approvals">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Approvals
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Course Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested course could not be found.
						</p>
						<Button asChild>
							<Link to="/dashboard/admin/approvals">Return to Approvals</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Handle course approval
	const handleApprove = () => {
		setIsApproveDialogOpen(true);
	};

	const confirmApprove = () => {
		toast.success(`Course "${course.title}" has been approved`);
		setIsApproveDialogOpen(false);
		navigate('/dashboard/admin/approvals');
	};

	// Handle course rejection
	const handleReject = () => {
		setRejectionReason('');
		setIsRejectDialogOpen(true);
	};

	const confirmReject = () => {
		if (rejectionReason.trim()) {
			toast.success(`Course "${course.title}" has been rejected`);
			setIsRejectDialogOpen(false);
			navigate('/dashboard/admin/approvals');
		}
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/admin/approvals">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Approvals
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
					<div className="mt-2 flex flex-wrap items-center gap-2">
						<p className="text-muted-foreground">
							By{' '}
							<Link
								to={`/dashboard/admin/instructors/${course.instructorId}`}
								className="text-primary hover:underline"
							>
								{course.instructor}
							</Link>
						</p>
						<span className="text-muted-foreground">•</span>
						<p className="text-muted-foreground">{course.category}</p>
						<span className="text-muted-foreground">•</span>
						<Badge
							className={
								course.status === 'pending'
									? 'bg-yellow-100 text-yellow-800'
									: course.status === 'approved'
										? 'bg-green-100 text-green-800'
										: 'bg-red-100 text-red-800'
							}
						>
							{course.status.charAt(0).toUpperCase() + course.status.slice(1)}
						</Badge>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={handleReject}
						className="text-red-600"
					>
						<XCircle className="mr-2 h-4 w-4" /> Reject
					</Button>
					<Button
						onClick={handleApprove}
						className="bg-green-600 hover:bg-green-700"
					>
						<CheckCircle className="mr-2 h-4 w-4" /> Approve
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="pb-0">
							<Tabs
								defaultValue="overview"
								value={activeTab}
								onValueChange={setActiveTab}
							>
								<TabsList>
									<TabsTrigger value="overview">Overview</TabsTrigger>
									<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
									<TabsTrigger value="requirements">Requirements</TabsTrigger>
								</TabsList>
							</Tabs>
						</CardHeader>
						<CardContent className="pt-6">
							<Tabs value={activeTab} onValueChange={setActiveTab}>
								<TabsContent value="overview" className="mt-0 space-y-4">
									<div>
										<h3 className="mb-2 text-lg font-medium">
											Course Description
										</h3>
										<p className="text-muted-foreground">
											{course.description}
										</p>
									</div>
									<div>
										<h3 className="mb-2 text-lg font-medium">
											What You'll Learn
										</h3>
										<ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
											{course.goals.map((goal, index) => (
												<li key={index} className="flex items-start gap-2">
													<CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
													<span>{goal}</span>
												</li>
											))}
										</ul>
									</div>
								</TabsContent>
								<TabsContent value="curriculum" className="mt-0 space-y-4">
									<div>
										<h3 className="mb-4 text-lg font-medium">Course Content</h3>
										<div className="space-y-4">
											{course.curriculum.map((section, sectionIndex) => (
												<div
													key={sectionIndex}
													className="overflow-hidden rounded-md border"
												>
													<div className="bg-muted p-4">
														<h4 className="font-medium">
															Section {sectionIndex + 1}: {section.title}
														</h4>
													</div>
													<div className="divide-y">
														{section.lessons.map((lesson, lessonIndex) => (
															<div
																key={lessonIndex}
																className="flex items-center justify-between p-4"
															>
																<div className="flex items-center gap-2">
																	<Play className="text-muted-foreground h-4 w-4" />
																	<span>
																		{sectionIndex + 1}.{lessonIndex + 1}{' '}
																		{lesson.title}
																	</span>
																</div>
																<span className="text-muted-foreground text-sm">
																	{lesson.duration}
																</span>
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									</div>
								</TabsContent>
								<TabsContent value="requirements" className="mt-0 space-y-4">
									<div>
										<h3 className="mb-2 text-lg font-medium">Requirements</h3>
										<ul className="space-y-2">
											{course.requirements.map((requirement, index) => (
												<li key={index} className="flex items-start gap-2">
													<div className="bg-foreground mt-2 h-1.5 w-1.5 rounded-full" />
													<span>{requirement}</span>
												</li>
											))}
										</ul>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<div className="aspect-video w-full overflow-hidden">
							<img
								src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop"
								alt={course.title}
								className="h-full w-full object-cover"
							/>
						</div>
						<CardContent className="p-6">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="font-medium">Price</span>
									<span className="text-xl font-bold">
										${course.price.toFixed(2)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Lessons</span>
									<span>{course.lessons} lessons</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Duration</span>
									<span>{course.duration}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Submitted</span>
									<span>{course.submitted}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Status</span>
									<Badge
										className={
											course.status === 'pending'
												? 'bg-yellow-100 text-yellow-800'
												: course.status === 'approved'
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
										}
									>
										{course.status.charAt(0).toUpperCase() +
											course.status.slice(1)}
									</Badge>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-2 pt-0">
							<Button className="w-full" asChild>
								<Link
									to={`/dashboard/admin/instructors/${course.instructorId}`}
								>
									View Instructor Profile
								</Link>
							</Button>
						</CardFooter>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Review Timeline</CardTitle>
							<CardDescription>
								Course submission and review history
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
											<Clock className="h-4 w-4" />
										</div>
										<div className="bg-border mt-2 w-px flex-1"></div>
									</div>
									<div>
										<p className="font-medium">Course Submitted</p>
										<p className="text-muted-foreground text-sm">
											{course.submitted}
										</p>
										<p className="text-muted-foreground mt-1 text-sm">
											{course.instructor} submitted this course for review.
										</p>
									</div>
								</div>
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full">
											<CheckCircle className="h-4 w-4" />
										</div>
									</div>
									<div>
										<p className="font-medium">Pending Review</p>
										<p className="text-muted-foreground text-sm">
											Awaiting admin approval
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Approve Confirmation Dialog */}
			<AlertDialog
				open={isApproveDialogOpen}
				onOpenChange={setIsApproveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Approve Course</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to approve "{course.title}"? Once approved,
							it will be published and available to students on the platform.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmApprove}
							className="bg-green-600 text-white hover:bg-green-700"
						>
							Approve
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Reject Dialog */}
			<AlertDialog
				open={isRejectDialogOpen}
				onOpenChange={setIsRejectDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Reject Course</AlertDialogTitle>
						<AlertDialogDescription>
							Please provide a reason for rejecting "{course.title}". This
							feedback will be sent to the instructor.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="mb-4">
						<Input
							placeholder="Reason for rejection"
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							className="w-full"
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmReject}
							className="bg-red-600 text-white hover:bg-red-700"
							disabled={!rejectionReason.trim()}
						>
							Reject
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
