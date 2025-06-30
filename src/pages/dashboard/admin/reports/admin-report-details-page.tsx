'use client';

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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
	CheckCircle,
	Clock,
	FileText,
	MessageSquare,
	XCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Mock report data
const reportsData = [
	{
		id: '1',
		type: 'content',
		course: 'JavaScript Basics',
		courseId: 'course-1',
		reporter: 'John Doe',
		reporterId: 'user-1',
		reason: 'Outdated content in Module 3',
		details:
			"The JavaScript syntax shown in Module 3 is outdated and no longer recommended practice. Specifically, the examples use var instead of let/const and don't follow modern ES6+ practices. This could confuse new learners about current best practices.",
		date: '2024-02-02',
		status: 'open',
		courseDetails: {
			title: 'JavaScript Basics',
			instructor: 'David Miller',
			instructorId: 'ins-10',
			image: '/javascript-basics.jpg',
			lessons: 24,
			duration: '4h 15m',
		},
		reporterDetails: {
			name: 'John Doe',
			email: 'john.doe@example.com',
			image: '/user-1.jpg',
			joinDate: '2023-05-10',
		},
		messages: [
			{
				id: 'msg-1',
				sender: 'John Doe',
				senderId: 'user-1',
				content: 'I noticed that Module 3 uses outdated JavaScript practices.',
				date: '2024-02-02',
				time: '14:35',
			},
			{
				id: 'msg-2',
				sender: 'Admin',
				senderId: 'admin-1',
				content: "Thank you for reporting this. We'll look into it.",
				date: '2024-02-03',
				time: '09:20',
			},
		],
	},
];

export default function ReportDetailPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
	const [isDismissDialogOpen, setIsDismissDialogOpen] = useState(false);
	const [resolution, setResolution] = useState('');
	const [message, setMessage] = useState('');
	const [activeTab, setActiveTab] = useState('details');

	// Find report by ID
	const report = reportsData.find((r) => r.id === params.id);

	if (!report) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/reports">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Reports
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Report Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested report could not be found.
						</p>
						<Button asChild>
							<Link to="/dashboard/admin/reports">Return to Reports</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Handle report resolution
	const handleResolve = () => {
		setResolution('');
		setIsResolveDialogOpen(true);
	};

	const confirmResolve = () => {
		if (resolution.trim()) {
			toast.success('Report marked as resolved');
			setIsResolveDialogOpen(false);
			navigate('/dashboard/admin/reports');
		}
	};

	// Handle report dismissal
	const handleDismiss = () => {
		setIsDismissDialogOpen(true);
	};

	const confirmDismiss = () => {
		toast.success('Report dismissed');
		setIsDismissDialogOpen(false);
		navigate('/dashboard/admin/reports');
	};

	// Handle sending a message
	const handleSendMessage = () => {
		if (message.trim()) {
			toast.success('Message sent');
			setMessage('');
		}
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/admin/reports">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Reports
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Report #{report.id}
					</h1>
					<div className="mt-2 flex flex-wrap items-center gap-2">
						<Badge
							variant="outline"
							className={
								report.type === 'inappropriate'
									? 'border-red-200 bg-red-50 text-red-700'
									: report.type === 'technical'
										? 'border-blue-200 bg-blue-50 text-blue-700'
										: report.type === 'copyright'
											? 'border-amber-200 bg-amber-50 text-amber-700'
											: 'border-gray-200 bg-gray-50 text-gray-700'
							}
						>
							{report.type.charAt(0).toUpperCase() + report.type.slice(1)}
						</Badge>
						<span className="text-muted-foreground">•</span>
						<Badge
							className={
								report.status === 'open'
									? 'bg-red-100 text-red-800'
									: report.status === 'investigating'
										? 'bg-blue-100 text-blue-800'
										: report.status === 'resolved'
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
							}
						>
							{report.status.charAt(0).toUpperCase() + report.status.slice(1)}
						</Badge>
						<span className="text-muted-foreground">•</span>
						<p className="text-muted-foreground">Reported on {report.date}</p>
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" onClick={handleDismiss}>
						<XCircle className="mr-2 h-4 w-4" /> Dismiss
					</Button>
					<Button
						onClick={handleResolve}
						className="bg-green-600 hover:bg-green-700"
					>
						<CheckCircle className="mr-2 h-4 w-4" /> Resolve
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="pb-0">
							<Tabs
								defaultValue="details"
								value={activeTab}
								onValueChange={setActiveTab}
							>
								<TabsList>
									<TabsTrigger value="details">Details</TabsTrigger>
									<TabsTrigger value="messages">Messages</TabsTrigger>
									<TabsTrigger value="course">Course Info</TabsTrigger>
								</TabsList>
							</Tabs>
						</CardHeader>
						<CardContent className="pt-6">
							<TabsContent value="details" className="space-y-4">
								<div>
									<h3 className="mb-2 text-lg font-medium">Report Details</h3>
									<p className="text-muted-foreground">{report.details}</p>
								</div>
								<div>
									<h3 className="mb-2 text-lg font-medium">
										Reporter Information
									</h3>
									<div className="flex items-center gap-4">
										<div className="h-12 w-12 overflow-hidden rounded-full">
											<img
												src={report.reporterDetails.image || '/placeholder.svg'}
												alt={report.reporterDetails.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div>
											<p className="font-medium">
												{report.reporterDetails.name}
											</p>
											<p className="text-muted-foreground text-sm">
												{report.reporterDetails.email}
											</p>
											<p className="text-muted-foreground text-sm">
												Member since {report.reporterDetails.joinDate}
											</p>
										</div>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="messages" className="space-y-4">
								<div className="space-y-4">
									{report.messages.map((message) => (
										<div
											key={message.id}
											className={`flex gap-4 ${message.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}
										>
											{message.sender !== 'Admin' && (
												<div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
													<MessageSquare className="text-muted-foreground h-5 w-5" />
												</div>
											)}
											<div
												className={`max-w-[80%] rounded-lg p-4 ${
													message.sender === 'Admin'
														? 'bg-primary text-primary-foreground'
														: 'bg-muted'
												}`}
											>
												<p className="text-sm font-medium">{message.sender}</p>
												<p>{message.content}</p>
												<p className="mt-2 text-xs opacity-70">
													{message.date} at {message.time}
												</p>
											</div>
											{message.sender === 'Admin' && (
												<div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
													<MessageSquare className="text-primary-foreground h-5 w-5" />
												</div>
											)}
										</div>
									))}
								</div>
								<div className="mt-4">
									<Textarea
										placeholder="Type your message here..."
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										className="min-h-[100px]"
									/>
									<div className="mt-2 flex justify-end">
										<Button
											onClick={handleSendMessage}
											disabled={!message.trim()}
										>
											Send Message
										</Button>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="course" className="space-y-4">
								<div className="flex gap-4">
									<div className="h-24 w-36 overflow-hidden rounded-md">
										<img
											src={report.courseDetails.image || '/placeholder.svg'}
											alt={report.courseDetails.title}
											className="h-full w-full object-cover"
										/>
									</div>
									<div>
										<h3 className="text-lg font-medium">
											<Link
												to={`/dashboard/admin/courses/${report.courseId}`}
												className="text-primary hover:underline"
											>
												{report.courseDetails.title}
											</Link>
										</h3>
										<p className="text-muted-foreground text-sm">
											Instructor:{' '}
											<Link
												to={`/dashboard/admin/instructors/${report.courseDetails.instructorId}`}
												className="text-primary hover:underline"
											>
												{report.courseDetails.instructor}
											</Link>
										</p>
										<p className="text-muted-foreground text-sm">
											{report.courseDetails.lessons} lessons •{' '}
											{report.courseDetails.duration}
										</p>
										<div className="mt-2">
											<Button variant="outline" size="sm" asChild>
												<Link
													to={`/dashboard/admin/courses/${report.courseId}`}
												>
													View Course
												</Link>
											</Button>
										</div>
									</div>
								</div>
							</TabsContent>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Report Summary</CardTitle>
							<CardDescription>Overview of the reported issue</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="font-medium">Report Type</span>
									<Badge
										variant="outline"
										className={
											report.type === 'inappropriate'
												? 'border-red-200 bg-red-50 text-red-700'
												: report.type === 'technical'
													? 'border-blue-200 bg-blue-50 text-blue-700'
													: report.type === 'copyright'
														? 'border-amber-200 bg-amber-50 text-amber-700'
														: 'border-gray-200 bg-gray-50 text-gray-700'
										}
									>
										{report.type.charAt(0).toUpperCase() + report.type.slice(1)}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Status</span>
									<Badge
										className={
											report.status === 'open'
												? 'bg-red-100 text-red-800'
												: report.status === 'investigating'
													? 'bg-blue-100 text-blue-800'
													: report.status === 'resolved'
														? 'bg-green-100 text-green-800'
														: 'bg-gray-100 text-gray-800'
										}
									>
										{report.status.charAt(0).toUpperCase() +
											report.status.slice(1)}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Date Reported</span>
									<span>{report.date}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Reporter</span>
									<Link
										to={`/dashboard/admin/users/${report.reporterId}`}
										className="text-primary hover:underline"
									>
										{report.reporter}
									</Link>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-medium">Course</span>
									<Link
										to={`/dashboard/admin/courses/${report.courseId}`}
										className="text-primary hover:underline"
									>
										{report.course}
									</Link>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Timeline</CardTitle>
							<CardDescription>Report activity history</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
											<FileText className="h-4 w-4" />
										</div>
										<div className="bg-border mt-2 w-px flex-1"></div>
									</div>
									<div>
										<p className="font-medium">Report Submitted</p>
										<p className="text-muted-foreground text-sm">
											{report.date}
										</p>
										<p className="text-muted-foreground mt-1 text-sm">
											{report.reporter} reported an issue with {report.course}.
										</p>
									</div>
								</div>
								<div className="flex gap-4">
									<div className="flex flex-col items-center">
										<div className="bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full">
											<Clock className="h-4 w-4" />
										</div>
									</div>
									<div>
										<p className="font-medium">Pending Review</p>
										<p className="text-muted-foreground text-sm">
											Awaiting resolution
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Resolve Dialog */}
			<AlertDialog
				open={isResolveDialogOpen}
				onOpenChange={setIsResolveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Resolve Report</AlertDialogTitle>
						<AlertDialogDescription>
							Please provide details on how this report was resolved. This
							information will be recorded for administrative purposes.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="mb-4">
						<Input
							placeholder="Resolution details"
							value={resolution}
							onChange={(e) => setResolution(e.target.value)}
							className="w-full"
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmResolve}
							className="bg-green-600 text-white hover:bg-green-700"
							disabled={!resolution.trim()}
						>
							Mark as Resolved
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Dismiss Dialog */}
			<AlertDialog
				open={isDismissDialogOpen}
				onOpenChange={setIsDismissDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Dismiss Report</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to dismiss this report? This action
							indicates that no further action is needed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDismiss}>
							Dismiss Report
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
