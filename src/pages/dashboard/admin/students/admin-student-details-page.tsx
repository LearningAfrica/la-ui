'use client';
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	Check,
	Clock,
	Edit,
	FileText,
	GraduationCap,
	Mail,
	MoreHorizontal,
	Shield,
	Trash,
	User,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AddNoteDialog } from './_components/add-note-dialog';
import { EditNoteDialog } from './_components/edit-note-dialog';
import { DeleteNoteDialog } from './_components/delete-note-dialog';

// Define the Student type
type Student = {
	id: string;
	name: string;
	email: string;
	enrolledCourses: number;
	completedCourses: number;
	lastActive: string;
	joinDate: string;
	status: 'active' | 'inactive' | 'suspended';
	bio: string;
	location: string;
	phone: string;
	courses: {
		id: string;
		title: string;
		progress: number;
		lastAccessed: string;
		instructor: string;
	}[];
	certificates: {
		id: string;
		title: string;
		issueDate: string;
		course: string;
	}[];
	payments: {
		id: string;
		amount: number;
		date: string;
		method: string;
		status: 'completed' | 'pending' | 'failed';
		description: string;
	}[];
	notes: {
		id: string;
		content: string;
		date: string;
		author: string;
	}[];
};

export default function StudentDetailPage() {
	const params = useParams();
	const navigate = useNavigate();
	const studentId = params.id as string;

	const [studentNotes, setStudentNotes] = useState<
		{
			id: string;
			content: string;
			date: string;
			author: string;
		}[]
	>([]);

	const handleStatusChange = (
		newStatus: 'active' | 'inactive' | 'suspended',
	) => {
		// toast({
		// 	title: 'Student status updated',
		// 	description: `${student?.name}'s status has been changed to ${newStatus}.`,
		// });
		toast.success(
			`${student?.name}'s status has been changed to ${newStatus}.`,
			{
				duration: 3000,
			},
		);
	};

	const handleDeleteStudent = () => {
		// toast({
		// 	title: 'Student deleted',
		// 	description: `${student?.name}'s account has been deleted.`,
		// 	variant: 'destructive',
		// });
		toast.success(`${student?.name}'s account has been deleted.`, {
			duration: 3000,
		});
		navigate('/dashboard/admin/students');
	};

	const handleAddNote = useCallback(
		(note: { id: string; content: string; date: string; author: string }) => {
			setStudentNotes((prev) => [note, ...prev]);
		},
		[],
	);

	const handleUpdateNote = useCallback(
		(noteId: string, updatedContent: string) => {
			setStudentNotes((prev) =>
				prev.map((note) =>
					note.id === noteId ? { ...note, content: updatedContent } : note,
				),
			);
		},
		[],
	);

	const handleDeleteNote = useCallback((noteId: string) => {
		setStudentNotes((prev) => prev.filter((note) => note.id !== noteId));
	}, []);

	// Fetch student data
	const { data: student, isLoading } = useQuery({
		queryKey: ['student', studentId],
		queryFn: async () => {
			// In a real app, this would be an API call
			return new Promise<Student>((resolve) => {
				setTimeout(() => {
					// Generate mock data for the specific student
					const mockStudent: Student = {
						id: studentId,
						name: `Student ${studentId.slice(-3)}`,
						email: `student${studentId.slice(-3)}@example.com`,
						enrolledCourses: Math.floor(Math.random() * 10) + 1,
						completedCourses: Math.floor(Math.random() * 5),
						lastActive: new Date(
							Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
						)
							.toISOString()
							.split('T')[0],
						joinDate: new Date(
							Date.now() -
								Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000,
						)
							.toISOString()
							.split('T')[0],
						status: ['active', 'inactive', 'suspended'][
							Math.floor(Math.random() * 3)
						] as 'active' | 'inactive' | 'suspended',
						bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
						location: 'New York, USA',
						phone: '+1 (555) 123-4567',
						courses: Array.from(
							{ length: Math.floor(Math.random() * 5) + 1 },
							(_, i) => ({
								id: `CRS${1000 + i}`,
								title: `Course ${i + 1}`,
								progress: Math.floor(Math.random() * 100),
								lastAccessed: new Date(
									Date.now() -
										Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000,
								)
									.toISOString()
									.split('T')[0],
								instructor: `Instructor ${i + 1}`,
							}),
						),
						certificates: Array.from(
							{ length: Math.floor(Math.random() * 3) },
							(_, i) => ({
								id: `CERT${1000 + i}`,
								title: `Certificate ${i + 1}`,
								issueDate: new Date(
									Date.now() -
										Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000,
								)
									.toISOString()
									.split('T')[0],
								course: `Course ${i + 1}`,
							}),
						),
						payments: Array.from(
							{ length: Math.floor(Math.random() * 4) + 1 },
							(_, i) => ({
								id: `PAY${1000 + i}`,
								amount: Math.floor(Math.random() * 200) + 50,
								date: new Date(
									Date.now() -
										Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000,
								)
									.toISOString()
									.split('T')[0],
								method: ['Credit Card', 'PayPal', 'Bank Transfer'][
									Math.floor(Math.random() * 3)
								],
								status: ['completed', 'pending', 'failed'][
									Math.floor(Math.random() * 3)
								] as 'completed' | 'pending' | 'failed',
								description: `Payment for Course ${i + 1}`,
							}),
						),
						notes: Array.from(
							{ length: Math.floor(Math.random() * 3) },
							(_, i) => ({
								id: `NOTE${1000 + i}`,
								content:
									'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
								date: new Date(
									Date.now() -
										Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
								)
									.toISOString()
									.split('T')[0],
								author: 'Admin User',
							}),
						),
					};
					resolve(mockStudent);
				}, 500);
			}).then((student) => {
				// Initialize the studentNotes state with the fetched data
				setStudentNotes(student.notes);
				return student;
			});
		},
	});

	if (isLoading) {
		return (
			<div className="flex-1 space-y-4 p-6 md:p-8">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/students">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Students
						</Link>
					</Button>
				</div>

				<div className="flex flex-col gap-4 md:flex-row">
					<div className="md:w-1/3">
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-[150px]" />
							</CardHeader>
							<CardContent className="flex flex-col items-center text-center">
								<Skeleton className="h-24 w-24 rounded-full" />
								<Skeleton className="mt-4 h-6 w-[180px]" />
								<Skeleton className="mt-2 h-4 w-[220px]" />
								<div className="mt-4 flex w-full justify-center gap-2">
									<Skeleton className="h-9 w-[100px]" />
									<Skeleton className="h-9 w-[100px]" />
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="flex-1 space-y-4">
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-[150px]" />
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{Array.from({ length: 4 }).map((_, i) => (
										<div key={i} className="flex justify-between">
											<Skeleton className="h-4 w-[100px]" />
											<Skeleton className="h-4 w-[150px]" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-[150px]" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-20 w-full" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (!student) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/students">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Students
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Student Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested student could not be found.
						</p>
						<Button asChild>
							<Link to="/dashboard/admin/students">Return to Students</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/admin/students">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Students
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				<div className="md:w-1/3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Student Profile</CardTitle>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Actions</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem
										onClick={() =>
											// toast({
											// 	title: 'Edit profile',
											// 	description: 'Editing student profile',
											// })
											toast.success('Editing student profile', {
												duration: 3000,
											})
										}
									>
										<Edit className="mr-2 h-4 w-4" />
										Edit Profile
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											// toast({
											// 	title: 'Email sent',
											// 	description: `Email sent to ${student.email}`,
											// })
											toast.success(`Email sent to ${student.email}`, {
												duration: 3000,
											})
										}
									>
										<Mail className="mr-2 h-4 w-4" />
										Send Email
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() =>
											handleStatusChange(
												student.status === 'active' ? 'suspended' : 'active',
											)
										}
										className={
											student.status === 'active'
												? 'text-destructive'
												: 'text-green-600'
										}
									>
										{student.status === 'active' ? (
											<>
												<Shield className="mr-2 h-4 w-4" />
												Suspend Account
											</>
										) : (
											<>
												<Check className="mr-2 h-4 w-4" />
												Activate Account
											</>
										)}
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={handleDeleteStudent}
										className="text-destructive"
									>
										<Trash className="mr-2 h-4 w-4" />
										Delete Account
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardHeader>
						<CardContent className="flex flex-col items-center text-center">
							<Avatar className="h-24 w-24">
								<AvatarImage
									src={`/abstract-geometric-shapes.png?height=96&width=96&query=${student.name}`}
									alt={student.name}
								/>
								<AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<h2 className="mt-4 text-xl font-bold">{student.name}</h2>
							<p className="text-muted-foreground text-sm">{student.email}</p>
							<div className="mt-2">
								<Badge
									variant={
										student.status === 'active'
											? 'default'
											: student.status === 'inactive'
												? 'outline'
												: 'destructive'
									}
									className="capitalize"
								>
									{student.status}
								</Badge>
							</div>
							<div className="mt-4 flex w-full justify-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										// toast({
										// 	title: 'Email sent',
										// 	description: `Email sent to ${student.email}`,
										// })
										toast.success(`Email sent to ${student.email}`, {
											duration: 3000,
										})
									}
								>
									<Mail className="mr-2 h-4 w-4" />
									Contact
								</Button>
								<Button size="sm" asChild>
									<Link to={`/dashboard/admin/students/${student.id}/edit`}>
										<Edit className="mr-2 h-4 w-4" />
										Edit
									</Link>
								</Button>
							</div>
						</CardContent>
						<Separator />
						<CardContent className="pt-4">
							<div className="space-y-4">
								<div>
									<h3 className="font-medium">Bio</h3>
									<p className="text-muted-foreground text-sm">{student.bio}</p>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<h3 className="font-medium">Location</h3>
										<p className="text-muted-foreground text-sm">
											{student.location}
										</p>
									</div>
									<div>
										<h3 className="font-medium">Phone</h3>
										<p className="text-muted-foreground text-sm">
											{student.phone}
										</p>
									</div>
									<div>
										<h3 className="font-medium">Joined</h3>
										<p className="text-muted-foreground text-sm">
											{student.joinDate}
										</p>
									</div>
									<div>
										<h3 className="font-medium">Last Active</h3>
										<p className="text-muted-foreground text-sm">
											{student.lastActive}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex-1 space-y-4">
					<Tabs defaultValue="courses">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="courses">Courses</TabsTrigger>
							<TabsTrigger value="certificates">Certificates</TabsTrigger>
							<TabsTrigger value="payments">Payments</TabsTrigger>
							<TabsTrigger value="notes">Admin Notes</TabsTrigger>
						</TabsList>

						<TabsContent value="courses" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Enrolled Courses</CardTitle>
									<CardDescription>
										Courses this student is currently enrolled in or has
										completed.
									</CardDescription>
								</CardHeader>
								<CardContent>
									{student.courses.length > 0 ? (
										<div className="space-y-4">
											{student.courses.map((course) => (
												<div key={course.id} className="rounded-lg border p-4">
													<div className="flex items-center justify-between">
														<div>
															<h3 className="font-medium">{course.title}</h3>
															<p className="text-muted-foreground text-sm">
																Instructor: {course.instructor}
															</p>
														</div>
														<Badge
															variant={
																course.progress === 100 ? 'default' : 'outline'
															}
														>
															{course.progress === 100
																? 'Completed'
																: 'In Progress'}
														</Badge>
													</div>
													<div className="mt-4">
														<div className="flex items-center justify-between text-sm">
															<span>Progress</span>
															<span>{course.progress}%</span>
														</div>
														<Progress
															value={course.progress}
															className="mt-2"
														/>
													</div>
													<div className="mt-4 flex items-center justify-between text-sm">
														<div className="flex items-center">
															<Clock className="text-muted-foreground mr-1 h-4 w-4" />
															<span className="text-muted-foreground">
																Last accessed: {course.lastAccessed}
															</span>
														</div>
														<Button variant="ghost" size="sm" asChild>
															<Link
																to={`/dashboard/admin/courses/${course.id}`}
															>
																View Course
															</Link>
														</Button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="flex flex-col items-center justify-center py-8 text-center">
											<BookOpen className="text-muted-foreground/50 h-12 w-12" />
											<h3 className="mt-4 text-lg font-medium">
												No Courses Enrolled
											</h3>
											<p className="text-muted-foreground mt-2 text-sm">
												This student is not enrolled in any courses yet.
											</p>
										</div>
									)}
								</CardContent>
								{student.courses.length > 0 && (
									<CardFooter>
										<Button variant="outline" className="w-full" asChild>
											<Link
												to={`/dashboard/admin/students/${student.id}/courses`}
											>
												View All Course Details
											</Link>
										</Button>
									</CardFooter>
								)}
							</Card>
						</TabsContent>

						<TabsContent value="certificates" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Certificates</CardTitle>
									<CardDescription>
										Certificates earned by this student.
									</CardDescription>
								</CardHeader>
								<CardContent>
									{student.certificates.length > 0 ? (
										<div className="space-y-4">
											{student.certificates.map((certificate) => (
												<div
													key={certificate.id}
													className="flex items-center justify-between rounded-lg border p-4"
												>
													<div className="flex items-center gap-3">
														<div className="bg-primary/10 rounded-md p-2">
															<GraduationCap className="text-primary h-6 w-6" />
														</div>
														<div>
															<h3 className="font-medium">
																{certificate.title}
															</h3>
															<p className="text-muted-foreground text-sm">
																Course: {certificate.course}
															</p>
														</div>
													</div>
													<div className="flex items-center gap-4">
														<div className="text-right">
															<p className="text-sm font-medium">Issued</p>
															<p className="text-muted-foreground text-sm">
																{certificate.issueDate}
															</p>
														</div>
														<Button variant="outline" size="sm">
															View
														</Button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="flex flex-col items-center justify-center py-8 text-center">
											<GraduationCap className="text-muted-foreground/50 h-12 w-12" />
											<h3 className="mt-4 text-lg font-medium">
												No Certificates
											</h3>
											<p className="text-muted-foreground mt-2 text-sm">
												This student has not earned any certificates yet.
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="payments" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Payment History</CardTitle>
									<CardDescription>
										Record of all payments made by this student.
									</CardDescription>
								</CardHeader>
								<CardContent>
									{student.payments.length > 0 ? (
										<div className="space-y-4">
											{student.payments.map((payment) => (
												<div
													key={payment.id}
													className="flex items-center justify-between rounded-lg border p-4"
												>
													<div>
														<h3 className="font-medium">
															{payment.description}
														</h3>
														<p className="text-muted-foreground text-sm">
															{payment.date} • {payment.method}
														</p>
													</div>
													<div className="flex items-center gap-4">
														<Badge
															variant={
																payment.status === 'completed'
																	? 'default'
																	: payment.status === 'pending'
																		? 'outline'
																		: 'destructive'
															}
															className="capitalize"
														>
															{payment.status}
														</Badge>
														<div className="text-right">
															<p className="text-lg font-bold">
																${payment.amount}
															</p>
														</div>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="flex flex-col items-center justify-center py-8 text-center">
											<FileText className="text-muted-foreground/50 h-12 w-12" />
											<h3 className="mt-4 text-lg font-medium">
												No Payment History
											</h3>
											<p className="text-muted-foreground mt-2 text-sm">
												This student has not made any payments yet.
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="notes" className="space-y-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between">
									<div>
										<CardTitle>Admin Notes</CardTitle>
										<CardDescription>
											Internal notes about this student (not visible to the
											student).
										</CardDescription>
									</div>
									<AddNoteDialog
										studentId={student.id}
										studentName={student.name}
										onNoteAdded={handleAddNote}
									/>
								</CardHeader>
								<CardContent>
									{studentNotes.length > 0 ? (
										<div className="space-y-4">
											{studentNotes.map((note) => (
												<div key={note.id} className="rounded-lg border p-4">
													<div className="flex items-center justify-between">
														<p className="text-muted-foreground text-sm">
															Added by {note.author} on {note.date}
														</p>
														<div className="flex items-center gap-2">
															<EditNoteDialog
																note={note}
																studentName={student.name}
																onNoteUpdated={handleUpdateNote}
															/>
															<DeleteNoteDialog
																noteId={note.id}
																studentName={student.name}
																onNoteDeleted={handleDeleteNote}
															/>
														</div>
													</div>
													<p className="mt-2">{note.content}</p>
												</div>
											))}
										</div>
									) : (
										<div className="flex flex-col items-center justify-center py-8 text-center">
											<FileText className="text-muted-foreground/50 h-12 w-12" />
											<h3 className="mt-4 text-lg font-medium">
												No Admin Notes
											</h3>
											<p className="text-muted-foreground mt-2 text-sm">
												There are no admin notes for this student yet.
											</p>
										</div>
									)}
								</CardContent>
								{studentNotes.length > 0 && (
									<CardFooter>
										<Button
											variant="outline"
											className="w-full"
											onClick={() =>
												document
													.querySelector<HTMLButtonElement>(
														'[aria-label="Add Note"]',
													)
													?.click()
											}
										>
											Add New Note
										</Button>
									</CardFooter>
								)}
							</Card>
						</TabsContent>
					</Tabs>

					<Card>
						<CardHeader>
							<CardTitle>Student Statistics</CardTitle>
							<CardDescription>
								Overview of student activity and performance.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-3">
								<div className="rounded-lg border p-3">
									<div className="flex items-center gap-2">
										<BookOpen className="text-muted-foreground h-4 w-4" />
										<h4 className="text-sm font-medium">Enrolled Courses</h4>
									</div>
									<p className="mt-2 text-2xl font-bold">
										{student.enrolledCourses}
									</p>
									<p className="text-muted-foreground text-xs">
										{student.completedCourses} completed
									</p>
								</div>
								<div className="rounded-lg border p-3">
									<div className="flex items-center gap-2">
										<Calendar className="text-muted-foreground h-4 w-4" />
										<h4 className="text-sm font-medium">Average Engagement</h4>
									</div>
									<p className="mt-2 text-2xl font-bold">
										{Math.floor(Math.random() * 5) + 1} hrs/week
									</p>
									<p className="text-muted-foreground text-xs">Last 30 days</p>
								</div>
								<div className="rounded-lg border p-3">
									<div className="flex items-center gap-2">
										<User className="text-muted-foreground h-4 w-4" />
										<h4 className="text-sm font-medium">Account Age</h4>
									</div>
									<p className="mt-2 text-2xl font-bold">
										{Math.floor(
											(new Date().getTime() -
												new Date(student.joinDate).getTime()) /
												(1000 * 60 * 60 * 24 * 30),
										)}{' '}
										months
									</p>
									<p className="text-muted-foreground text-xs">
										Since {student.joinDate}
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
