'use client';

import { useState } from 'react';
import { ArrowLeft, Loader2, Mail, MapPin, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Sample instructor data
const instructorData = {
	id: 'i1',
	name: 'Dr. Jane Smith',
	email: 'jane.smith@example.com',
	phone: '+1 (555) 123-4567',
	image: '/abstract-blue-burst.png',
	bio: 'Dr. Jane Smith is a renowned data scientist with over 15 years of experience in the field. She has worked with major tech companies and has published numerous research papers on machine learning and artificial intelligence. Her teaching approach focuses on practical applications and real-world problem solving.',
	location: 'San Francisco, CA',
	website: 'https://janesmith.example.com',
	specialization: 'Data Science',
	courses: [
		{
			id: 'c1',
			title: 'Introduction to Data Science',
			students: 450,
			rating: 4.9,
			status: 'published',
		},
		{
			id: 'c2',
			title: 'Advanced Machine Learning',
			students: 320,
			rating: 4.8,
			status: 'published',
		},
		{
			id: 'c3',
			title: 'Python for Data Analysis',
			students: 275,
			rating: 4.7,
			status: 'published',
		},
		{
			id: 'c4',
			title: 'Deep Learning Fundamentals',
			students: 200,
			rating: 4.6,
			status: 'draft',
		},
	],
	education: [
		{
			degree: 'Ph.D. in Computer Science',
			institution: 'Stanford University',
			year: '2008',
		},
		{
			degree: 'M.S. in Computer Science',
			institution: 'MIT',
			year: '2005',
		},
		{
			degree: 'B.S. in Mathematics',
			institution: 'UC Berkeley',
			year: '2003',
		},
	],
	experience: [
		{
			position: 'Lead Data Scientist',
			company: 'Tech Innovations Inc.',
			period: '2015 - Present',
		},
		{
			position: 'Senior Data Scientist',
			company: 'DataCorp',
			period: '2010 - 2015',
		},
		{
			position: 'Research Scientist',
			company: 'AI Research Lab',
			period: '2008 - 2010',
		},
	],
	status: 'active',
	featured: true,
	joinDate: '2020-03-15',
	totalStudents: 1245,
	totalCourses: 12,
	averageRating: 4.8,
	totalRevenue: 125000,
};

export default function InstructorDetailPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: instructorData.name,
		email: instructorData.email,
		phone: instructorData.phone,
		image: instructorData.image,
		bio: instructorData.bio,
		location: instructorData.location,
		website: instructorData.website,
		specialization: instructorData.specialization,
		status: instructorData.status,
		featured: instructorData.featured,
	});

	const handleChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success('Instructor updated successfully');
			setIsEditing(false);
		} catch (error) {
			toast.error('Failed to update instructor');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		setIsSubmitting(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success('Instructor deleted successfully');
			navigate('/dashboard/admin/instructors');
		} catch (error) {
			toast.error('Failed to delete instructor');
		} finally {
			setIsSubmitting(false);
			setDeleteDialogOpen(false);
		}
	};

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/instructors">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Instructors
						</Link>
					</Button>
				</div>
				<div className="flex items-center gap-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								onClick={() => setIsEditing(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button onClick={handleSubmit} disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									'Save Changes'
								)}
							</Button>
						</>
					) : (
						<>
							<Dialog
								open={deleteDialogOpen}
								onOpenChange={setDeleteDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="destructive">
										<Trash2 className="mr-2 h-4 w-4" />
										Delete Instructor
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you sure?</DialogTitle>
										<DialogDescription>
											This will permanently delete the instructor account and
											remove all associated data. This action cannot be undone.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setDeleteDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button
											variant="destructive"
											onClick={handleDelete}
											disabled={isSubmitting}
										>
											{isSubmitting ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Deleting...
												</>
											) : (
												'Delete Instructor'
											)}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							<Button onClick={() => setIsEditing(true)}>
								Edit Instructor
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-7">
				{/* Instructor Profile */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Instructor Profile</CardTitle>
						<CardDescription>
							View and manage instructor information
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col items-center text-center">
						{isEditing ? (
							<>
								<Avatar className="h-32 w-32">
									<AvatarImage
										src={formData.image || '/placeholder.svg'}
										alt={formData.name}
									/>
									<AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className="mt-4 w-full space-y-4">
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="image">Profile Image URL</Label>
										<Input
											id="image"
											placeholder="https://example.com/image.jpg"
											value={formData.image}
											onChange={(e) => handleChange('image', e.target.value)}
										/>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											placeholder="John Doe"
											value={formData.name}
											onChange={(e) => handleChange('name', e.target.value)}
										/>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											placeholder="john.doe@example.com"
											value={formData.email}
											onChange={(e) => handleChange('email', e.target.value)}
										/>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="phone">Phone Number</Label>
										<Input
											id="phone"
											placeholder="+1 (555) 123-4567"
											value={formData.phone}
											onChange={(e) => handleChange('phone', e.target.value)}
										/>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="location">Location</Label>
										<Input
											id="location"
											placeholder="San Francisco, CA"
											value={formData.location}
											onChange={(e) => handleChange('location', e.target.value)}
										/>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="website">Website</Label>
										<Input
											id="website"
											placeholder="https://example.com"
											value={formData.website}
											onChange={(e) => handleChange('website', e.target.value)}
										/>
									</div>
									<div className="grid w-full items-center gap-1.5">
										<Label htmlFor="specialization">Specialization</Label>
										<Input
											id="specialization"
											placeholder="Web Development"
											value={formData.specialization}
											onChange={(e) =>
												handleChange('specialization', e.target.value)
											}
										/>
									</div>
								</div>
							</>
						) : (
							<>
								<Avatar className="h-32 w-32">
									<AvatarImage
										src={instructorData.image || '/placeholder.svg'}
										alt={instructorData.name}
									/>
									<AvatarFallback>
										{instructorData.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="mt-4 space-y-2">
									<h3 className="text-xl font-bold">{instructorData.name}</h3>
									<div className="text-muted-foreground flex items-center justify-center gap-1">
										<MapPin className="h-4 w-4" />
										<span>{instructorData.location}</span>
									</div>
									<div className="text-muted-foreground flex items-center justify-center gap-1">
										<Mail className="h-4 w-4" />
										<span>{instructorData.email}</span>
									</div>
									<div className="flex items-center justify-center gap-1">
										<Badge variant="outline" className="text-xs">
											{instructorData.specialization}
										</Badge>
										{instructorData.featured && (
											<Badge className="bg-amber-500 text-xs hover:bg-amber-500/80">
												<Star className="mr-1 h-3 w-3" />
												Featured
											</Badge>
										)}
									</div>
								</div>
								<div className="mt-6 grid w-full grid-cols-3 gap-4 text-center">
									<div>
										<p className="text-2xl font-bold">
											{instructorData.totalCourses}
										</p>
										<p className="text-muted-foreground text-xs">Courses</p>
									</div>
									<div>
										<p className="text-2xl font-bold">
											{instructorData.totalStudents}
										</p>
										<p className="text-muted-foreground text-xs">Students</p>
									</div>
									<div>
										<p className="text-2xl font-bold">
											{instructorData.averageRating}
										</p>
										<p className="text-muted-foreground text-xs">Rating</p>
									</div>
								</div>
							</>
						)}
					</CardContent>
					<CardFooter className="flex flex-col items-start gap-4">
						{isEditing ? (
							<div className="grid w-full gap-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label htmlFor="status">Status</Label>
										<p className="text-muted-foreground text-sm">
											Set the status of this instructor
										</p>
									</div>
									<Select
										value={formData.status}
										onValueChange={(value) => handleChange('status', value)}
									>
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="active">Active</SelectItem>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="inactive">Inactive</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="featured"
										checked={formData.featured}
										onCheckedChange={(checked) =>
											handleChange('featured', checked)
										}
									/>
									<Label htmlFor="featured">Featured Instructor</Label>
								</div>
							</div>
						) : (
							<div className="grid w-full gap-2">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Status</span>
									<Badge
										variant={
											instructorData.status === 'active'
												? 'default'
												: instructorData.status === 'pending'
													? 'secondary'
													: 'destructive'
										}
									>
										{instructorData.status.charAt(0).toUpperCase() +
											instructorData.status.slice(1)}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Member Since</span>
									<span className="text-muted-foreground text-sm">
										{new Date(instructorData.joinDate).toLocaleDateString()}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Total Revenue</span>
									<span className="text-muted-foreground text-sm">
										${instructorData.totalRevenue.toLocaleString()}
									</span>
								</div>
							</div>
						)}
					</CardFooter>
				</Card>

				{/* Instructor Details */}
				<Card className="md:col-span-4">
					<CardHeader>
						<Tabs defaultValue="bio" className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="bio">Bio</TabsTrigger>
								<TabsTrigger value="courses">Courses</TabsTrigger>
								<TabsTrigger value="education">Education</TabsTrigger>
								<TabsTrigger value="experience">Experience</TabsTrigger>
							</TabsList>
							<TabsContent value="bio" className="mt-4 space-y-4">
								{isEditing ? (
									<div className="space-y-4">
										<div className="grid w-full gap-1.5">
											<Label htmlFor="bio">Biography</Label>
											<Textarea
												id="bio"
												placeholder="Write a short bio about the instructor..."
												className="min-h-[200px]"
												value={formData.bio}
												onChange={(e) => handleChange('bio', e.target.value)}
											/>
										</div>
									</div>
								) : (
									<div className="prose prose-sm dark:prose-invert max-w-none">
										<p>{instructorData.bio}</p>
									</div>
								)}
							</TabsContent>
							<TabsContent value="courses" className="mt-4 space-y-4">
								<div className="rounded-md border">
									<table className="w-full text-sm">
										<thead>
											<tr className="bg-muted/50 border-b">
												<th className="py-2 pr-2 pl-4 text-left font-medium">
													Course
												</th>
												<th className="px-2 py-2 text-left font-medium">
													Students
												</th>
												<th className="px-2 py-2 text-left font-medium">
													Rating
												</th>
												<th className="px-2 py-2 text-left font-medium">
													Status
												</th>
											</tr>
										</thead>
										<tbody>
											{instructorData.courses.map((course) => (
												<tr key={course.id} className="border-b">
													<td className="py-2 pr-2 pl-4">
														<Link
															to={`/dashboard/admin/courses/${course.id}`}
															className="font-medium hover:underline"
														>
															{course.title}
														</Link>
													</td>
													<td className="px-2 py-2">{course.students}</td>
													<td className="px-2 py-2">
														<div className="flex items-center">
															<Star className="fill-primary text-primary mr-1 h-4 w-4" />
															{course.rating}
														</div>
													</td>
													<td className="px-2 py-2">
														<Badge
															variant={
																course.status === 'published'
																	? 'default'
																	: 'secondary'
															}
															className="text-xs"
														>
															{course.status.charAt(0).toUpperCase() +
																course.status.slice(1)}
														</Badge>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</TabsContent>
							<TabsContent value="education" className="mt-4 space-y-4">
								<div className="space-y-4">
									{instructorData.education.map((edu, index) => (
										<div key={index} className="rounded-lg border p-4">
											<h4 className="font-medium">{edu.degree}</h4>
											<p className="text-muted-foreground text-sm">
												{edu.institution} • {edu.year}
											</p>
										</div>
									))}
								</div>
							</TabsContent>
							<TabsContent value="experience" className="mt-4 space-y-4">
								<div className="space-y-4">
									{instructorData.experience.map((exp, index) => (
										<div key={index} className="rounded-lg border p-4">
											<h4 className="font-medium">{exp.position}</h4>
											<p className="text-muted-foreground text-sm">
												{exp.company} • {exp.period}
											</p>
										</div>
									))}
								</div>
							</TabsContent>
						</Tabs>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}
