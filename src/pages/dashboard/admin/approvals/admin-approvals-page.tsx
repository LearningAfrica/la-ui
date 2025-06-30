import { useState } from 'react';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
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
import {
	CheckCircle,
	Eye,
	MoreHorizontal,
	Search,
	XCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for course approvals
const initialCourses = [
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
	},
	{
		id: '2',
		title: 'Financial Planning Essentials',
		instructor: 'Robert Chen',
		instructorId: 'ins-2',
		category: 'Finance',
		submitted: '2024-02-03',
		status: 'pending',
		lessons: 36,
		duration: '6h 45m',
		price: 69.99,
	},
	{
		id: '3',
		title: 'Digital Marketing Masterclass',
		instructor: 'Emily Davis',
		instructorId: 'ins-3',
		category: 'Marketing',
		submitted: '2024-02-05',
		status: 'pending',
		lessons: 58,
		duration: '10h 15m',
		price: 74.99,
	},
	{
		id: '4',
		title: 'UX Research Fundamentals',
		instructor: 'Michael Johnson',
		instructorId: 'ins-4',
		category: 'Design',
		submitted: '2024-02-06',
		status: 'pending',
		lessons: 32,
		duration: '5h 20m',
		price: 59.99,
	},
	{
		id: '5',
		title: 'Machine Learning A-Z',
		instructor: 'Sarah Williams',
		instructorId: 'ins-5',
		category: 'Data Science',
		submitted: '2024-02-07',
		status: 'pending',
		lessons: 76,
		duration: '14h 45m',
		price: 94.99,
	},
	{
		id: '6',
		title: 'Python for Data Analysis',
		instructor: 'David Kim',
		instructorId: 'ins-6',
		category: 'Data Science',
		submitted: '2024-01-28',
		status: 'approved',
		lessons: 48,
		duration: '9h 30m',
		price: 79.99,
	},
	{
		id: '7',
		title: 'Responsive Web Design',
		instructor: 'Lisa Chen',
		instructorId: 'ins-7',
		category: 'Programming',
		submitted: '2024-01-25',
		status: 'approved',
		lessons: 38,
		duration: '7h 15m',
		price: 64.99,
	},
	{
		id: '8',
		title: 'Social Media Strategy',
		instructor: 'Emily Davis',
		instructorId: 'ins-3',
		category: 'Marketing',
		submitted: '2024-01-20',
		status: 'rejected',
		lessons: 28,
		duration: '4h 45m',
		price: 49.99,
		rejectionReason: 'Content needs more depth and practical examples',
	},
	{
		id: '9',
		title: 'Blockchain Fundamentals',
		instructor: 'James Wilson',
		instructorId: 'ins-8',
		category: 'Programming',
		submitted: '2024-01-18',
		status: 'rejected',
		lessons: 22,
		duration: '5h 10m',
		price: 69.99,
		rejectionReason: 'Technical inaccuracies in multiple lessons',
	},
];

export default function ApprovalsPage() {
	const navigate = useNavigate();
	const [courses, setCourses] = useState(initialCourses);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('pending');
	const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
	const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
	const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState('');

	// Filter courses based on search query and active tab
	const filteredCourses = courses.filter(
		(course) =>
			(course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
			(activeTab === 'all' || course.status === activeTab),
	);

	// Handle course approval
	const handleApproveCourse = (id: string) => {
		setSelectedCourse(id);
		setIsApproveDialogOpen(true);
	};

	const confirmApprove = () => {
		if (selectedCourse) {
			setCourses(
				courses.map((course) =>
					course.id === selectedCourse
						? { ...course, status: 'approved' }
						: course,
				),
			);
			toast.success('Course approved successfully');
			setSelectedCourse(null);
			setIsApproveDialogOpen(false);
		}
	};

	// Handle course rejection
	const handleRejectCourse = (id: string) => {
		setSelectedCourse(id);
		setRejectionReason('');
		setIsRejectDialogOpen(true);
	};

	const confirmReject = () => {
		if (selectedCourse && rejectionReason.trim()) {
			setCourses(
				courses.map((course) =>
					course.id === selectedCourse
						? {
								...course,
								status: 'rejected',
								rejectionReason: rejectionReason.trim(),
							}
						: course,
				),
			);
			toast.success('Course rejected');
			setSelectedCourse(null);
			setRejectionReason('');
			setIsRejectDialogOpen(false);
		}
	};

	// Count courses by status
	const pendingCount = courses.filter(
		(course) => course.status === 'pending',
	).length;
	const approvedCount = courses.filter(
		(course) => course.status === 'approved',
	).length;
	const rejectedCount = courses.filter(
		(course) => course.status === 'rejected',
	).length;

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Course Approvals
					</h1>
					<p className="text-muted-foreground">
						Review and approve submitted courses
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Course Review Queue</CardTitle>
					<CardDescription>
						Manage course submissions from instructors
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
						<div className="relative w-full flex-1">
							<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
							<Input
								type="search"
								placeholder="Search courses..."
								className="w-full pl-8"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					<Tabs
						defaultValue="pending"
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-4"
					>
						<TabsList>
							<TabsTrigger value="pending">
								Pending{' '}
								<Badge className="ml-2 bg-yellow-100 text-yellow-800">
									{pendingCount}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="approved">
								Approved{' '}
								<Badge className="ml-2 bg-green-100 text-green-800">
									{approvedCount}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="rejected">
								Rejected{' '}
								<Badge className="ml-2 bg-red-100 text-red-800">
									{rejectedCount}
								</Badge>
							</TabsTrigger>
							<TabsTrigger value="all">All</TabsTrigger>
						</TabsList>

						<TabsContent value={activeTab} className="space-y-4">
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Course</TableHead>
											<TableHead className="hidden md:table-cell">
												Instructor
											</TableHead>
											<TableHead className="hidden md:table-cell">
												Category
											</TableHead>
											<TableHead className="hidden lg:table-cell">
												Submitted
											</TableHead>
											<TableHead className="hidden lg:table-cell">
												Price
											</TableHead>
											<TableHead className="hidden xl:table-cell">
												Lessons
											</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredCourses.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8} className="h-24 text-center">
													No courses found.
												</TableCell>
											</TableRow>
										) : (
											filteredCourses.map((course) => (
												<TableRow key={course.id}>
													<TableCell>
														<div className="font-medium">{course.title}</div>
														<div className="text-muted-foreground text-sm md:hidden">
															{course.instructor}
														</div>
													</TableCell>
													<TableCell className="hidden md:table-cell">
														<Link
															to={`/dashboard/admin/instructors/${course.instructorId}`}
															className="text-primary hover:underline"
														>
															{course.instructor}
														</Link>
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{course.category}
													</TableCell>
													<TableCell className="hidden lg:table-cell">
														{course.submitted}
													</TableCell>
													<TableCell className="hidden lg:table-cell">
														${course.price.toFixed(2)}
													</TableCell>
													<TableCell className="hidden xl:table-cell">
														{course.lessons} ({course.duration})
													</TableCell>
													<TableCell>
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
													</TableCell>
													<TableCell>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<span className="sr-only">Open menu</span>
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuLabel>Actions</DropdownMenuLabel>
																<DropdownMenuItem
																	onClick={() =>
																		navigate(
																			`/dashboard/admin/approvals/${course.id}`,
																		)
																	}
																>
																	<Eye className="mr-2 h-4 w-4" /> View details
																</DropdownMenuItem>
																{course.status === 'pending' && (
																	<>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem
																			onClick={() =>
																				handleApproveCourse(course.id)
																			}
																			className="text-green-600"
																		>
																			<CheckCircle className="mr-2 h-4 w-4" />{' '}
																			Approve
																		</DropdownMenuItem>
																		<DropdownMenuItem
																			onClick={() =>
																				handleRejectCourse(course.id)
																			}
																			className="text-red-600"
																		>
																			<XCircle className="mr-2 h-4 w-4" />{' '}
																			Reject
																		</DropdownMenuItem>
																	</>
																)}
																{course.status === 'rejected' &&
																	course.rejectionReason && (
																		<>
																			<DropdownMenuSeparator />
																			<DropdownMenuLabel className="text-muted-foreground text-xs font-normal normal-case">
																				Rejection reason:{' '}
																				{course.rejectionReason}
																			</DropdownMenuLabel>
																		</>
																	)}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Approve Confirmation Dialog */}
			<AlertDialog
				open={isApproveDialogOpen}
				onOpenChange={setIsApproveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Approve Course</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to approve this course? Once approved, it
							will be published and available to students on the platform.
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
							Please provide a reason for rejecting this course. This feedback
							will be sent to the instructor.
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
