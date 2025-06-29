import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
	ArrowLeft,
	Eye,
	MessageSquare,
	MoreHorizontal,
	Search,
	UserPlus,
	X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';

// Mock course data
const coursesData = [
	{
		id: '1',
		title: 'Complete JavaScript Course',
		students: [
			{
				id: 's1',
				name: 'John Smith',
				email: 'john.smith@example.com',
				image: '/student-1.jpg',
				enrollmentDate: '2024-01-15',
				lastActive: '2024-02-05',
				progress: 68,
				completedLessons: 24,
				totalLessons: 36,
				status: 'active',
			},
			{
				id: 's2',
				name: 'Sarah Johnson',
				email: 'sarah.johnson@example.com',
				image: '/student-2.jpg',
				enrollmentDate: '2024-01-10',
				lastActive: '2024-02-04',
				progress: 42,
				completedLessons: 15,
				totalLessons: 36,
				status: 'active',
			},
			{
				id: 's3',
				name: 'Michael Brown',
				email: 'michael.brown@example.com',
				image: '/student-3.jpg',
				enrollmentDate: '2024-01-05',
				lastActive: '2024-02-01',
				progress: 85,
				completedLessons: 31,
				totalLessons: 36,
				status: 'active',
			},
			{
				id: 's4',
				name: 'Emily Davis',
				email: 'emily.davis@example.com',
				image: '/student-4.jpg',
				enrollmentDate: '2023-12-20',
				lastActive: '2024-01-28',
				progress: 23,
				completedLessons: 8,
				totalLessons: 36,
				status: 'inactive',
			},
			{
				id: 's5',
				name: 'David Wilson',
				email: 'david.wilson@example.com',
				image: '/student-5.jpg',
				enrollmentDate: '2023-12-15',
				lastActive: '2024-01-25',
				progress: 56,
				completedLessons: 20,
				totalLessons: 36,
				status: 'active',
			},
		],
	},
];

export default function CourseStudentsPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('all');
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
	const [students, setStudents] = useState<any[]>([]);
	const params = useParams<{ id: string }>();
	// Find course by ID
	const course = coursesData.find((c) => c.id === params.id);

	if (!course) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/instructor/courses">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Courses
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
							<Link to="/dashboard/instructor/courses">Return to Courses</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Combine initial students with any new ones
	const allStudents = [...course.students, ...students];

	// Filter students based on search query and active tab
	const filteredStudents = allStudents.filter(
		(student) =>
			(student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				student.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
			(activeTab === 'all' || student.status === activeTab),
	);

	// Count students by status
	const activeCount = allStudents.filter(
		(student) => student.status === 'active',
	).length;
	const inactiveCount = allStudents.filter(
		(student) => student.status === 'inactive',
	).length;

	// Handle removing a student
	const handleRemoveStudent = (id: string) => {
		setSelectedStudent(id);
		setIsRemoveDialogOpen(true);
	};

	const confirmRemove = () => {
		if (selectedStudent) {
			setStudents(
				allStudents
					.filter((student) => student.id !== selectedStudent)
					.map((student) => ({
						...student,
						status:
							student.id === selectedStudent ? 'inactive' : student.status,
					})),
			);
			toast.success('Student removed from course');
			setSelectedStudent(null);
			setIsRemoveDialogOpen(false);
		}
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to={`/dashboard/instructor/courses/${params.id}`}>
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Course
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Course Students</h1>
					<p className="text-muted-foreground">
						Manage students enrolled in{' '}
						<span className="font-medium">{course.title}</span>
					</p>
				</div>
				<Button>
					<UserPlus className="mr-2 h-4 w-4" /> Add Students
				</Button>
			</div>

			<Tabs
				defaultValue="all"
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList>
					<TabsTrigger value="all">
						All Students <Badge className="ml-2">{allStudents.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="active">
						Active{' '}
						<Badge className="ml-2 bg-green-100 text-green-800">
							{activeCount}
						</Badge>
					</TabsTrigger>
					<TabsTrigger value="inactive">
						Inactive{' '}
						<Badge className="ml-2 bg-gray-100 text-gray-800">
							{inactiveCount}
						</Badge>
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Student Management</CardTitle>
							<CardDescription>
								View and manage students enrolled in this course
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="mb-6 flex items-center gap-4">
								<div className="relative flex-1">
									<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
									<Input
										type="search"
										placeholder="Search students..."
										className="w-full pl-8 md:max-w-sm"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Student</TableHead>
											<TableHead className="hidden md:table-cell">
												Enrollment Date
											</TableHead>
											<TableHead className="hidden md:table-cell">
												Last Active
											</TableHead>
											<TableHead>Progress</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="w-[100px]">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredStudents.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} className="h-24 text-center">
													No students found.
												</TableCell>
											</TableRow>
										) : (
											filteredStudents.map((student) => (
												<TableRow key={student.id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<Avatar>
																<AvatarImage
																	src={student.image || '/placeholder.svg'}
																	alt={student.name}
																/>
																<AvatarFallback>
																	{student.name.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<div>
																<div className="font-medium">
																	{student.name}
																</div>
																<div className="text-muted-foreground text-sm">
																	{student.email}
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{student.enrollmentDate}
													</TableCell>
													<TableCell className="hidden md:table-cell">
														{student.lastActive}
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Progress
																value={student.progress}
																className="h-2 w-[100px]"
															/>
															<span className="text-sm">
																{student.progress}% ({student.completedLessons}/
																{student.totalLessons})
															</span>
														</div>
													</TableCell>
													<TableCell>
														<Badge
															className={
																student.status === 'active'
																	? 'bg-green-100 text-green-800'
																	: 'bg-gray-100 text-gray-800'
															}
														>
															{student.status.charAt(0).toUpperCase() +
																student.status.slice(1)}
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
																<DropdownMenuItem asChild>
																	<Link
																		to={`/dashboard/instructor/students/${student.id}`}
																	>
																		<Eye className="mr-2 h-4 w-4" /> View
																		Profile
																	</Link>
																</DropdownMenuItem>
																<DropdownMenuItem asChild>
																	<Link
																		to={`/dashboard/instructor/messages?student=${student.id}&course=${params.id}`}
																	>
																		<MessageSquare className="mr-2 h-4 w-4" />{' '}
																		Send Message
																	</Link>
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	onClick={() =>
																		handleRemoveStudent(student.id)
																	}
																	className="text-destructive focus:text-destructive"
																>
																	<X className="mr-2 h-4 w-4" /> Remove from
																	Course
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Remove Student Confirmation Dialog */}
			<AlertDialog
				open={isRemoveDialogOpen}
				onOpenChange={setIsRemoveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Student from Course</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove this student from the course? They
							will lose access to course materials, but their progress data will
							be retained.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmRemove}
							className="bg-destructive text-destructive-foreground"
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
