'use client';

import React from 'react';

import {
	ArrowLeft,
	Save,
	User,
	Mail,
	Phone,
	MapPin,
	FileText,
	Calendar,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Define the form schema
const studentFormSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name cannot exceed 100 characters'),
	email: z.string().email('Please enter a valid email address'),
	status: z.enum(['active', 'inactive', 'suspended'], {
		required_error: 'Please select a status',
	}),
	bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
	location: z
		.string()
		.max(100, 'Location cannot exceed 100 characters')
		.optional(),
	phone: z
		.string()
		.max(20, 'Phone number cannot exceed 20 characters')
		.optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

// Define the Student type
type Student = {
	id: string;
	name: string;
	email: string;
	status: 'active' | 'inactive' | 'suspended';
	bio: string;
	location: string;
	phone: string;
	enrolledCourses: number;
	completedCourses: number;
	lastActive: string;
	joinDate: string;
	totalSpent: number;
	averageRating: number;
};

export default function EditStudentPage() {
	const params = useParams();
	const navigate = useNavigate();
	const studentId = params.id as string;
	const [isSubmitting, setIsSubmitting] = useState(false);

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
						status: ['active', 'inactive', 'suspended'][
							Math.floor(Math.random() * 3)
						] as 'active' | 'inactive' | 'suspended',
						bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
						location: 'New York, USA',
						phone: '+1 (555) 123-4567',
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
						totalSpent: Math.floor(Math.random() * 2000) + 100,
						averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
					};
					resolve(mockStudent);
				}, 500);
			});
		},
	});

	// Initialize the form with student data
	const form = useForm<StudentFormValues>({
		resolver: zodResolver(studentFormSchema),
		defaultValues: {
			name: '',
			email: '',
			status: 'active',
			bio: '',
			location: '',
			phone: '',
		},
	});

	// Update form when student data loads
	React.useEffect(() => {
		if (student) {
			form.reset({
				name: student.name,
				email: student.email,
				status: student.status,
				bio: student.bio,
				location: student.location,
				phone: student.phone,
			});
		}
	}, [student, form]);

	// Handle form submission
	const onSubmit = async (values: StudentFormValues) => {
		setIsSubmitting(true);

		try {
			// In a real app, this would be an API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			//   toast({
			//     title: "Student updated",
			//     description: `${values.name}'s profile has been successfully updated.`,
			//   })
			toast.success(`${values.name}'s profile has been successfully updated.`, {
				duration: 3000,
			});

			// Redirect back to student detail page
			navigate(`/dashboard/admin/students/${studentId}`);
		} catch (error) {
			//   toast({
			//     title: "Error",
			//     description: "There was an error updating the student. Please try again.",
			//     variant: "destructive",
			//   })
			toast.error(
				'There was an error updating the student. Please try again.',
				{
					duration: 3000,
				},
			);
			console.error('Error updating student:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex-1 space-y-4 p-6 md:p-8">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to={`/dashboard/admin/students/${studentId}`}>
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Student
						</Link>
					</Button>
				</div>

				<div className="flex flex-col gap-4 md:flex-row">
					<div className="md:w-1/3">
						<Card>
							<CardHeader>
								<div className="bg-muted h-6 w-32 animate-pulse rounded" />
							</CardHeader>
							<CardContent className="flex flex-col items-center text-center">
								<div className="bg-muted h-24 w-24 animate-pulse rounded-full" />
								<div className="bg-muted mt-4 h-6 w-40 animate-pulse rounded" />
								<div className="bg-muted mt-2 h-4 w-48 animate-pulse rounded" />
								<div className="bg-muted mt-2 h-6 w-20 animate-pulse rounded" />
							</CardContent>
						</Card>
					</div>

					<div className="flex-1">
						<Card>
							<CardHeader>
								<div className="bg-muted h-6 w-32 animate-pulse rounded" />
								<div className="bg-muted h-4 w-48 animate-pulse rounded" />
							</CardHeader>
							<CardContent className="space-y-6">
								{Array.from({ length: 6 }).map((_, i) => (
									<div key={i} className="space-y-2">
										<div className="bg-muted h-4 w-20 animate-pulse rounded" />
										<div className="bg-muted h-10 w-full animate-pulse rounded" />
									</div>
								))}
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
					<Link to={`/dashboard/admin/students/${studentId}`}>
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Student
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row">
				{/* Student Info Sidebar */}
				<div className="md:w-1/3">
					<Card>
						<CardHeader>
							<CardTitle>Current Student Info</CardTitle>
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
												? 'secondary'
												: 'destructive'
									}
									className="capitalize"
								>
									{student.status}
								</Badge>
							</div>
						</CardContent>
					</Card>

					<Card className="mt-4">
						<CardHeader>
							<CardTitle>Student Statistics</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<User className="text-muted-foreground h-4 w-4" />
									<span className="text-sm">Enrolled Courses</span>
								</div>
								<span className="font-medium">{student.enrolledCourses}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<span className="text-sm">Completed</span>
								</div>
								<span className="font-medium">{student.completedCourses}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<FileText className="text-muted-foreground h-4 w-4" />
									<span className="text-sm">Total Spent</span>
								</div>
								<span className="font-medium">${student.totalSpent}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<span className="text-sm">Joined</span>
								</div>
								<span className="font-medium">{student.joinDate}</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<span className="text-sm">Last Active</span>
								</div>
								<span className="font-medium">{student.lastActive}</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Edit Form */}
				<div className="flex-1">
					<Card>
						<CardHeader>
							<CardTitle>Edit Student Profile</CardTitle>
							<CardDescription>
								Update the student's profile information and account settings.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<div className="grid gap-6 md:grid-cols-2">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Name</FormLabel>
													<FormControl>
														<div className="relative">
															<User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
															<Input
																placeholder="Enter full name"
																className="pl-10"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email Address</FormLabel>
													<FormControl>
														<div className="relative">
															<Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
															<Input
																placeholder="Enter email address"
																type="email"
																className="pl-10"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Account Status</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select account status" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="active">Active</SelectItem>
														<SelectItem value="inactive">Inactive</SelectItem>
														<SelectItem value="suspended">Suspended</SelectItem>
													</SelectContent>
												</Select>
												<FormDescription>
													Active users can access all features. Inactive users
													cannot log in. Suspended users have limited access.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="bio"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Bio</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Enter student bio..."
														className="min-h-[100px]"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													A brief description about the student (optional).
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-6 md:grid-cols-2">
										<FormField
											control={form.control}
											name="location"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Location</FormLabel>
													<FormControl>
														<div className="relative">
															<MapPin className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
															<Input
																placeholder="Enter location"
																className="pl-10"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<div className="relative">
															<Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
															<Input
																placeholder="Enter phone number"
																className="pl-10"
																{...field}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex gap-4 pt-4">
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? (
												<>
													<div className="border-background border-t-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2" />
													Saving...
												</>
											) : (
												<>
													<Save className="mr-2 h-4 w-4" />
													Save Changes
												</>
											)}
										</Button>
										<Button type="button" variant="outline" asChild>
											<Link to={`/dashboard/admin/students/${studentId}`}>
												Cancel
											</Link>
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
