'use client';

import { useState } from 'react';
import {
	ArrowLeft,
	Award,
	Calendar,
	Download,
	FileText,
	MoreHorizontal,
	Pencil,
	Share2,
	Trash2,
	Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Certificate template data
const certificateTemplate = {
	id: 'cert-001',
	name: 'Course Completion',
	description: 'Standard certificate awarded upon successful course completion',
	image:
		'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
	status: 'active',
	courses: 24,
	issued: 1458,
	createdAt: '2023-06-15',
	updatedAt: '2023-11-02',
	orientation: 'landscape',
	showLogo: true,
	showSignature: true,
	showDate: true,
	showQrCode: false,
	expiryEnabled: false,
	expiryPeriod: null,
	backgroundColor: '#ffffff',
	borderColor: '#000000',
	textColor: '#000000',
	accentColor: '#3b82f6',
};

// Courses using this certificate
const coursesUsingCertificate = [
	{
		id: 'course-001',
		name: 'JavaScript Fundamentals',
		category: 'Programming',
		students: 245,
		certificatesIssued: 198,
		lastIssued: '2023-11-01',
	},
	{
		id: 'course-002',
		name: 'CSS Mastery',
		category: 'Web Development',
		students: 187,
		certificatesIssued: 142,
		lastIssued: '2023-10-28',
	},
	{
		id: 'course-003',
		name: 'Advanced React Development',
		category: 'Programming',
		students: 156,
		certificatesIssued: 89,
		lastIssued: '2023-10-15',
	},
	{
		id: 'course-004',
		name: 'Introduction to Programming',
		category: 'Programming',
		students: 312,
		certificatesIssued: 287,
		lastIssued: '2023-11-02',
	},
	{
		id: 'course-005',
		name: 'Full Stack Web Development',
		category: 'Web Development',
		students: 178,
		certificatesIssued: 124,
		lastIssued: '2023-10-22',
	},
];

// Recent issuances
const recentIssuances = [
	{
		id: 'issue-001',
		studentName: 'Alex Johnson',
		studentEmail: 'alex.j@example.com',
		courseName: 'JavaScript Fundamentals',
		issuedAt: '2023-11-02',
		status: 'active',
	},
	{
		id: 'issue-002',
		studentName: 'Jamie Smith',
		studentEmail: 'jamie.s@example.com',
		courseName: 'Advanced React Development',
		issuedAt: '2023-11-01',
		status: 'active',
	},
	{
		id: 'issue-003',
		studentName: 'Taylor Wilson',
		studentEmail: 'taylor.w@example.com',
		courseName: 'Full Stack Web Development',
		issuedAt: '2023-10-30',
		status: 'active',
	},
	{
		id: 'issue-004',
		studentName: 'Morgan Lee',
		studentEmail: 'morgan.l@example.com',
		courseName: 'CSS Mastery',
		issuedAt: '2023-10-29',
		status: 'active',
	},
	{
		id: 'issue-005',
		studentName: 'Casey Brown',
		studentEmail: 'casey.b@example.com',
		courseName: 'Introduction to Programming',
		issuedAt: '2023-10-28',
		status: 'active',
	},
];

export default function CertificateDetailPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [_activeTab, setActiveTab] = useState('overview');

	// Stats data
	const statsData = [
		{
			title: 'Total Issued',
			value: certificateTemplate.issued.toString(),
			description: 'All time',
			icon: Award,
		},
		{
			title: 'Courses Using',
			value: certificateTemplate.courses.toString(),
			description: 'Active courses',
			icon: FileText,
		},
		{
			title: 'Last Updated',
			value: certificateTemplate.updatedAt,
			description: 'Last modified',
			icon: Calendar,
		},
	];

	return (
		<div className="flex-1 space-y-4 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/certificates">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Certificates
						</Link>
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" asChild>
						<Link to={`/dashboard/admin/certificates/${params.id}/edit`}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Template
						</Link>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<MoreHorizontal className="mr-2 h-4 w-4" />
								Actions
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: 'Certificate template duplicated',
									// 	description: `${certificateTemplate.name} has been duplicated.`,
									// });
									toast.success('Certificate template duplicated');
								}}
							>
								<FileText className="mr-2 h-4 w-4" />
								Duplicate
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: 'Certificate template downloaded',
									// 	description: `${certificateTemplate.name} has been downloaded.`,
									// });
									toast.success('Certificate template downloaded');
								}}
							>
								<Download className="mr-2 h-4 w-4" />
								Download Template
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: 'Certificate template shared',
									// 	description: `Share link copied to clipboard.`,
									// });
									toast.success('Certificate template shared');
								}}
							>
								<Share2 className="mr-2 h-4 w-4" />
								Share Template
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: 'Certificate template deleted',
									// 	description: `${certificateTemplate.name} has been deleted.`,
									// 	variant: 'destructive',
									// });
									toast.error('Certificate template deleted');
									navigate('/dashboard/admin/certificates');
								}}
								className="text-red-600 dark:text-red-400"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-7">
				{/* Left column - Certificate details */}
				<div className="space-y-4 md:col-span-5">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<div>
								<CardTitle className="text-2xl">
									{certificateTemplate.name}
								</CardTitle>
								<CardDescription>
									{certificateTemplate.description}
								</CardDescription>
							</div>
							<Badge
								variant="outline"
								className={
									certificateTemplate.status === 'active'
										? 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
										: certificateTemplate.status === 'draft'
											? 'border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
											: 'border-gray-200 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
								}
							>
								{certificateTemplate.status.charAt(0).toUpperCase() +
									certificateTemplate.status.slice(1)}
							</Badge>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-3">
								{statsData.map((stat, index) => (
									<div key={index} className="flex items-center gap-4">
										<div className="bg-primary/10 rounded-full p-3">
											<stat.icon className="text-primary h-6 w-6" />
										</div>
										<div>
											<p className="text-muted-foreground text-sm font-medium">
												{stat.title}
											</p>
											<h3 className="text-2xl font-bold">{stat.value}</h3>
											<p className="text-muted-foreground text-xs">
												{stat.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Tabs
						defaultValue="overview"
						className="space-y-4"
						onValueChange={setActiveTab}
					>
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="courses">Courses</TabsTrigger>
							<TabsTrigger value="issuances">Recent Issuances</TabsTrigger>
						</TabsList>
						<TabsContent value="overview" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Certificate Details</CardTitle>
									<CardDescription>
										Technical details about this certificate template
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<h4 className="text-muted-foreground mb-2 text-sm font-medium">
												Basic Information
											</h4>
											<div className="space-y-2">
												<div className="flex justify-between">
													<span className="text-sm">Template ID</span>
													<span className="text-sm font-medium">
														{certificateTemplate.id}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Created On</span>
													<span className="text-sm font-medium">
														{certificateTemplate.createdAt}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Last Updated</span>
													<span className="text-sm font-medium">
														{certificateTemplate.updatedAt}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Orientation</span>
													<span className="text-sm font-medium capitalize">
														{certificateTemplate.orientation}
													</span>
												</div>
											</div>
										</div>
										<div>
											<h4 className="text-muted-foreground mb-2 text-sm font-medium">
												Certificate Elements
											</h4>
											<div className="space-y-2">
												<div className="flex justify-between">
													<span className="text-sm">Organization Logo</span>
													<span className="text-sm font-medium">
														{certificateTemplate.showLogo ? 'Yes' : 'No'}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Signature</span>
													<span className="text-sm font-medium">
														{certificateTemplate.showSignature ? 'Yes' : 'No'}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">Issue Date</span>
													<span className="text-sm font-medium">
														{certificateTemplate.showDate ? 'Yes' : 'No'}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm">QR Code</span>
													<span className="text-sm font-medium">
														{certificateTemplate.showQrCode ? 'Yes' : 'No'}
													</span>
												</div>
											</div>
										</div>
									</div>
									<Separator className="my-4" />
									<div>
										<h4 className="text-muted-foreground mb-2 text-sm font-medium">
											Expiration Settings
										</h4>
										<div className="space-y-2">
											<div className="flex justify-between">
												<span className="text-sm">Certificate Expiration</span>
												<span className="text-sm font-medium">
													{certificateTemplate.expiryEnabled ? 'Yes' : 'No'}
												</span>
											</div>
											{certificateTemplate.expiryEnabled && (
												<div className="flex justify-between">
													<span className="text-sm">Expiry Period</span>
													<span className="text-sm font-medium">
														{certificateTemplate.expiryPeriod}
													</span>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="courses" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Courses Using This Certificate</CardTitle>
									<CardDescription>
										List of courses that issue this certificate
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Course Name</TableHead>
												<TableHead>Category</TableHead>
												<TableHead className="text-center">Students</TableHead>
												<TableHead className="text-center">
													Certificates Issued
												</TableHead>
												<TableHead>Last Issued</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{coursesUsingCertificate.map((course) => (
												<TableRow key={course.id}>
													<TableCell className="font-medium">
														{course.name}
													</TableCell>
													<TableCell>{course.category}</TableCell>
													<TableCell className="text-center">
														{course.students}
													</TableCell>
													<TableCell className="text-center">
														{course.certificatesIssued}
													</TableCell>
													<TableCell>{course.lastIssued}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="issuances" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Recent Certificate Issuances</CardTitle>
									<CardDescription>
										Recently issued certificates using this template
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Student</TableHead>
												<TableHead>Course</TableHead>
												<TableHead>Issue Date</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{recentIssuances.map((issuance) => (
												<TableRow key={issuance.id}>
													<TableCell>
														<div className="flex items-center gap-3">
															<div className="h-8 w-8 overflow-hidden rounded-full">
																<img
																	src={`https://i.pravatar.cc/32?u=${issuance.id}`}
																	alt={issuance.studentName}
																	width={32}
																	height={32}
																	className="h-full w-full object-cover"
																/>
															</div>
															<div>
																<div className="font-medium">
																	{issuance.studentName}
																</div>
																<div className="text-muted-foreground text-xs">
																	{issuance.studentEmail}
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell>{issuance.courseName}</TableCell>
													<TableCell>{issuance.issuedAt}</TableCell>
													<TableCell>
														<Badge
															variant="outline"
															className="border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
														>
															{issuance.status.charAt(0).toUpperCase() +
																issuance.status.slice(1)}
														</Badge>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
								<CardFooter>
									<Button variant="outline" className="w-full">
										View All Issuances
									</Button>
								</CardFooter>
							</Card>
						</TabsContent>
					</Tabs>
				</div>

				{/* Right column - Certificate preview */}
				<div className="md:col-span-2">
					<div className="sticky top-4 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Certificate Preview</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-background relative aspect-[1.414/1] w-full overflow-hidden rounded-md border">
									<div
										className="absolute inset-4 flex flex-col items-center justify-center border-8 p-8 text-center"
										style={{
											backgroundColor: certificateTemplate.backgroundColor,
											borderColor: certificateTemplate.borderColor,
											color: certificateTemplate.textColor,
										}}
									>
										{certificateTemplate.showLogo && (
											<div className="mb-4">
												<Award
													className="h-16 w-16"
													style={{ color: certificateTemplate.accentColor }}
												/>
											</div>
										)}
										<h1 className="mb-2 text-2xl font-bold">
											Certificate of Completion
										</h1>
										<p className="mb-6 text-lg">This certifies that</p>
										<p
											className="mb-1 text-xl font-bold"
											style={{ color: certificateTemplate.accentColor }}
										>
											Student Name
										</p>
										<div
											className="mb-6 h-0.5 w-48"
											style={{
												backgroundColor: certificateTemplate.accentColor,
											}}
										></div>
										<p className="mb-1 text-lg">has successfully completed</p>
										<p className="mb-6 text-xl font-bold">Course Title</p>

										<div className="mt-auto flex w-full items-end justify-between">
											{certificateTemplate.showDate && (
												<div className="text-sm">
													<p>Issue Date</p>
													<p>April 20, 2025</p>
												</div>
											)}

											{certificateTemplate.showSignature && (
												<div className="text-sm">
													<div className="mb-2 flex h-12 w-32 items-end justify-center">
														<img
															src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Signature_of_Ann_Miller.svg/1280px-Signature_of_Ann_Miller.svg.png"
															alt="Signature"
															className="h-full object-contain"
														/>
													</div>
													<div
														className="mb-1 h-0.5 w-32"
														style={{
															backgroundColor: certificateTemplate.textColor,
														}}
													></div>
													<p>Instructor Name</p>
												</div>
											)}

											{certificateTemplate.showQrCode && (
												<div className="text-sm">
													<div className="mb-1 h-16 w-16 bg-white p-1">
														<img
															src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example.com/verify"
															alt="QR Code"
															className="h-full w-full"
														/>
													</div>
													<p>Verify</p>
												</div>
											)}
										</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex flex-col gap-2">
								<Button className="w-full">
									<Download className="mr-2 h-4 w-4" />
									Download Sample
								</Button>
								<Button variant="outline" className="w-full">
									<Users className="mr-2 h-4 w-4" />
									Issue Certificate
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
