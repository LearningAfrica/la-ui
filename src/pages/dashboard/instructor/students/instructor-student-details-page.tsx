import { useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Mail, MessageSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Mock student data
const studentsData = [
	{
		id: '1',
		name: 'John Smith',
		email: 'john.smith@example.com',
		image: '/student-1.jpg',
		joinDate: '2023-09-15',
		lastActive: '2024-02-05',
		enrolledCourses: [
			{
				id: 'c1',
				title: 'Complete JavaScript Course',
				progress: 68,
				lastAccessed: '2024-02-05',
				enrollmentDate: '2023-09-20',
			},
			{
				id: 'c2',
				title: 'React Native for Beginners',
				progress: 42,
				lastAccessed: '2024-02-03',
				enrollmentDate: '2023-11-10',
			},
			{
				id: 'c3',
				title: 'Advanced TypeScript Patterns',
				progress: 15,
				lastAccessed: '2024-01-28',
				enrollmentDate: '2024-01-15',
			},
		],
		messages: [
			{
				id: 'm1',
				content: "I'm having trouble with the async/await section in Module 5.",
				date: '2024-02-05',
				time: '14:35',
			},
			{
				id: 'm2',
				content: 'Thanks for the clarification on Promises!',
				date: '2024-01-28',
				time: '10:20',
			},
		],
	},
];

export default function StudentDetailPage() {
	const [activeTab, setActiveTab] = useState('courses');
	const params = useParams<{
		id: string;
	}>();
	// Find student by ID
	const student = studentsData.find((s) => s.id === params.id);

	if (!student) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/instructor/students">
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
							<Link to="/dashboard/instructor/students">
								Return to Students
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/instructor/students">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Students
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				<Card className="md:col-span-1">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center text-center">
							<Avatar className="h-24 w-24">
								<AvatarImage
									src={student.image || '/placeholder.svg'}
									alt={student.name}
								/>
								<AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<h2 className="mt-4 text-xl font-bold">{student.name}</h2>
							<div className="mt-1 flex items-center gap-2">
								<Mail className="text-muted-foreground h-4 w-4" />
								<span className="text-muted-foreground text-sm">
									{student.email}
								</span>
							</div>
							<div className="mt-1 flex items-center gap-2">
								<Calendar className="text-muted-foreground h-4 w-4" />
								<span className="text-muted-foreground text-sm">
									Joined {student.joinDate}
								</span>
							</div>
							<div className="mt-6 w-full">
								<Button className="w-full" asChild>
									<Link
										to={`/dashboard/instructor/messages?student=${student.id}`}
									>
										<MessageSquare className="mr-2 h-4 w-4" /> Send Message
									</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="md:col-span-2">
					<CardHeader className="pb-0">
						<Tabs
							defaultValue="courses"
							value={activeTab}
							onValueChange={setActiveTab}
						>
							<TabsList>
								<TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
								<TabsTrigger value="messages">Messages</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardHeader>
					<CardContent className="pt-6">
						<TabsContent value="courses" className="space-y-4">
							{student.enrolledCourses.length === 0 ? (
								<div className="py-6 text-center">
									<p className="text-muted-foreground">No courses enrolled.</p>
								</div>
							) : (
								<div className="space-y-4">
									{student.enrolledCourses.map((course) => (
										<div key={course.id} className="rounded-lg border p-4">
											<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
												<div>
													<h3 className="font-medium">{course.title}</h3>
													<p className="text-muted-foreground text-sm">
														Enrolled: {course.enrollmentDate} • Last accessed:{' '}
														{course.lastAccessed}
													</p>
												</div>
												<Badge>{course.progress}% Complete</Badge>
											</div>
											<div className="mt-4">
												<Progress value={course.progress} className="h-2" />
											</div>
										</div>
									))}
								</div>
							)}
						</TabsContent>
						<TabsContent value="messages" className="space-y-4">
							{student.messages.length === 0 ? (
								<div className="py-6 text-center">
									<p className="text-muted-foreground">No messages yet.</p>
								</div>
							) : (
								<div className="space-y-4">
									{student.messages.map((message) => (
										<div key={message.id} className="rounded-lg border p-4">
											<p className="text-sm">{message.content}</p>
											<p className="text-muted-foreground mt-2 text-xs">
												{message.date} at {message.time}
											</p>
										</div>
									))}
								</div>
							)}
							<div className="mt-4">
								<Button asChild>
									<Link
										to={`/dashboard/instructor/messages?student=${student.id}`}
									>
										View All Messages
									</Link>
								</Button>
							</div>
						</TabsContent>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
