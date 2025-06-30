'use client';

import { useState } from 'react';
import {
	ArrowLeft,
	CheckCircle,
	Flag,
	MessageCircle,
	MoreHorizontal,
	Send,
	Shield,
	Trash2,
	Users,
} from 'lucide-react';

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
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

// Types
type Discussion = {
	id: string;
	title: string;
	course: {
		id: string;
		title: string;
	};
	student: {
		id: string;
		name: string;
		image?: string;
	};
	instructor?: {
		id: string;
		name: string;
		image?: string;
	};
	status: 'open' | 'resolved' | 'flagged' | 'archived';
	messageCount: number;
	lastActivity: string;
	created: string;
	isPrivate: boolean;
	messages: Message[];
};

type Message = {
	id: string;
	sender: {
		id: string;
		name: string;
		image?: string;
		role: 'student' | 'instructor' | 'admin';
	};
	content: string;
	date: string;
	time: string;
	isFlagged?: boolean;
	flagReason?: string;
};

// Sample data
const discussionsData: Discussion[] = [
	{
		id: 'disc-1',
		title: 'Question about JavaScript Promises',
		course: {
			id: 'course-1',
			title: 'Advanced JavaScript',
		},
		student: {
			id: 'student-1',
			name: 'John Smith',
			image: '/student-1.jpg',
		},
		instructor: {
			id: 'instructor-1',
			name: 'Jane Doe',
			image: '/instructor-1.jpg',
		},
		status: 'open',
		messageCount: 5,
		lastActivity: '2024-04-18T14:30:00',
		created: '2024-04-15T10:15:00',
		isPrivate: false,
		messages: [
			{
				id: 'm1',
				sender: {
					id: 'student-1',
					name: 'John Smith',
					image: '/student-1.jpg',
					role: 'student',
				},
				content:
					"Hi, I'm having trouble understanding how JavaScript Promises work. Can someone explain the difference between Promise.all() and Promise.race()?",
				date: '2024-02-05',
				time: '14:30',
			},
			{
				id: 'm2',
				sender: {
					id: 'instructor-1',
					name: 'Jane Doe',
					image: '/instructor-1.jpg',
					role: 'instructor',
				},
				content:
					'Great question, John! Promise.all() takes an array of promises and returns a new promise that resolves when all input promises have resolved, or rejects if any input promise rejects. The resolved value is an array containing the resolved values of the input promises, in the same order.\n\nPromise.race(), on the other hand, returns a promise that resolves or rejects as soon as one of the input promises resolves or rejects, with the value or reason from that promise.',
				date: '2024-02-05',
				time: '15:20',
			},
			{
				id: 'm3',
				sender: {
					id: 'student-1',
					name: 'John Smith',
					image: '/student-1.jpg',
					role: 'student',
				},
				content:
					'That makes sense! So Promise.all() waits for all promises to resolve and returns an array of results in the same order. What happens if one of the promises rejects?',
				date: '2024-02-05',
				time: '15:45',
			},
			{
				id: 'm4',
				sender: {
					id: 'instructor-1',
					name: 'Jane Doe',
					image: '/instructor-1.jpg',
					role: 'instructor',
				},
				content:
					'If any promise in Promise.all() rejects, the entire Promise.all() call will immediately reject with that error, even if other promises are still pending. This is called fail-fast behavior.\n\nIf you want to handle potential rejections differently, you might want to look into using Promise.allSettled() which waits for all promises to settle (either resolve or reject) and returns an array of objects describing the outcome of each promise.',
				date: '2024-02-05',
				time: '16:10',
			},
			{
				id: 'm5',
				sender: {
					id: 'student-1',
					name: 'John Smith',
					image: '/student-1.jpg',
					role: 'student',
				},
				content:
					"Thank you for the explanation! I'll look into Promise.allSettled() as well.",
				date: '2024-02-05',
				time: '16:30',
			},
		],
	},
	{
		id: 'disc-2',
		title: 'Help with React Hooks implementation',
		course: {
			id: 'course-2',
			title: 'React Fundamentals',
		},
		student: {
			id: 'student-2',
			name: 'Emily Johnson',
			image: '/student-2.jpg',
		},
		instructor: {
			id: 'instructor-2',
			name: 'Michael Brown',
			image: '/instructor-2.jpg',
		},
		status: 'resolved',
		messageCount: 8,
		lastActivity: '2024-04-17T16:45:00',
		created: '2024-04-14T09:30:00',
		isPrivate: false,
		messages: [
			{
				id: 'm1',
				sender: {
					id: 'student-2',
					name: 'Emily Johnson',
					image: '/student-2.jpg',
					role: 'student',
				},
				content:
					"I'm having trouble understanding how to use the useEffect hook in React. Can someone explain when cleanup functions are necessary?",
				date: '2024-04-14',
				time: '09:30',
			},
			{
				id: 'm2',
				sender: {
					id: 'instructor-2',
					name: 'Michael Brown',
					image: '/instructor-2.jpg',
					role: 'instructor',
				},
				content:
					'Great question, Emily! Cleanup functions in useEffect are necessary when your effect creates resources that need to be cleaned up before the component unmounts or before the effect runs again.\n\nCommon examples include:\n- Clearing timers (clearTimeout, clearInterval)\n- Removing event listeners\n- Canceling network requests\n- Cleaning up subscriptions',
				date: '2024-04-14',
				time: '10:15',
			},
			{
				id: 'm3',
				sender: {
					id: 'student-2',
					name: 'Emily Johnson',
					image: '/student-2.jpg',
					role: 'student',
				},
				content:
					'That makes sense! So if I set up a subscription or event listener in useEffect, I should return a function that removes it?',
				date: '2024-04-14',
				time: '11:30',
			},
			{
				id: 'm4',
				sender: {
					id: 'instructor-2',
					name: 'Michael Brown',
					image: '/instructor-2.jpg',
					role: 'instructor',
				},
				content:
					"Exactly! Here's a simple example:\n\nuseEffect(() => {\n  const handleResize = () => console.log('window resized');\n  window.addEventListener('resize', handleResize);\n  \n  // Return cleanup function\n  return () => {\n    window.removeEventListener('resize', handleResize);\n  };\n}, []);",
				date: '2024-04-14',
				time: '12:45',
			},
			{
				id: 'm5',
				sender: {
					id: 'student-2',
					name: 'Emily Johnson',
					image: '/student-2.jpg',
					role: 'student',
				},
				content: 'Thank you! This clears things up a lot.',
				date: '2024-04-14',
				time: '13:20',
			},
			{
				id: 'm6',
				sender: {
					id: 'instructor-2',
					name: 'Michael Brown',
					image: '/instructor-2.jpg',
					role: 'instructor',
				},
				content:
					"You're welcome! Let me know if you have any other questions about React hooks.",
				date: '2024-04-14',
				time: '14:05',
			},
		],
	},
];

export default function DiscussionDetailPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [newMessage, setNewMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [showFlagDialog, setShowFlagDialog] = useState(false);
	const [flaggedMessage, setFlaggedMessage] = useState<Message | null>(null);
	const [flagReason, setFlagReason] = useState('');

	// Find discussion by ID with better error handling
	const discussion = discussionsData.find((d) => d.id === params.id) || null;

	// Add console log for debugging
	console.log('Discussion ID:', params.id);
	console.log('Found discussion:', discussion);

	if (!discussion) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate('/dashboard/admin/discussions')}
					>
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Discussions
					</Button>
				</div>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Discussion Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested discussion could not be found.
						</p>
						<Button onClick={() => navigate('/dashboard/admin/discussions')}>
							Return to Discussions
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Combine initial messages with any new ones
	const allMessages = [...discussion.messages, ...messages];

	// Handle sending a new message
	const handleSendMessage = () => {
		if (newMessage.trim()) {
			const newMsg: Message = {
				id: `new-${Date.now()}`,
				sender: {
					id: 'admin-1',
					name: 'Admin User',
					image: '/admin-1.jpg',
					role: 'admin',
				},
				content: newMessage,
				date: new Date().toISOString().split('T')[0],
				time: new Date().toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				}),
			};
			setMessages([...messages, newMsg]);
			setNewMessage('');
			toast.success('Message sent');
		}
	};

	// Handle flagging a message
	const handleFlagMessage = (message: Message) => {
		setFlaggedMessage(message);
		setShowFlagDialog(true);
	};

	// Submit flag
	const submitFlag = () => {
		if (flaggedMessage && flagReason.trim()) {
			// toast({
			// 	title: 'Message flagged',
			// 	description: 'The message has been flagged for review.',
			// });
			toast.success(
				`Message from ${flaggedMessage.sender.name} flagged for review: ${flagReason}`,
			);
			setShowFlagDialog(false);
			setFlagReason('');
		}
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate('/dashboard/admin/discussions')}
				>
					<ArrowLeft className="mr-1 h-4 w-4" />
					Back to Discussions
				</Button>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								Actions <MoreHorizontal className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Discussion Actions</DropdownMenuLabel>
							{discussion.status !== 'resolved' && (
								<DropdownMenuItem
									onClick={() => {
										// toast({
										// 	title: 'Discussion marked as resolved',
										// 	description: `"${discussion.title}" has been marked as resolved.`,
										// });
										toast.success(
											`Discussion "${discussion.title}" marked as resolved.`,
										);
									}}
								>
									<CheckCircle className="mr-2 h-4 w-4" />
									Mark as resolved
								</DropdownMenuItem>
							)}
							{discussion.status !== 'flagged' && (
								<DropdownMenuItem
									onClick={() => {
										// toast({
										// 	title: 'Discussion flagged',
										// 	description: `"${discussion.title}" has been flagged for review.`,
										// });
										toast.success(
											`Discussion "${discussion.title}" flagged for review.`,
										);
									}}
								>
									<Flag className="mr-2 h-4 w-4" />
									Flag for review
								</DropdownMenuItem>
							)}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									// toast({
									// 	title: 'Discussion archived',
									// 	description: `"${discussion.title}" has been archived.`,
									// });
									toast.success(`Discussion "${discussion.title}" archived.`);
								}}
							>
								Archive discussion
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => {
									// toast({
									// 	title: 'Discussion deleted',
									// 	description: `"${discussion.title}" has been deleted.`,
									// 	variant: 'destructive',
									// });
									toast.error(`Discussion "${discussion.title}" deleted.`);
									navigate('/dashboard/admin/discussions');
								}}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete discussion
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<CardTitle>
								{discussion.isPrivate && (
									<span className="text-muted-foreground mr-1">[Private]</span>
								)}
								{discussion.title}
							</CardTitle>
							<CardDescription>
								<div className="flex items-center gap-2">
									<Link
										to={`/dashboard/admin/students/${discussion.student.id}`}
										className="hover:underline"
									>
										{discussion.student.name}
									</Link>
									<span>•</span>
									<Link
										to={`/dashboard/admin/courses/${discussion.course.id}`}
										className="hover:underline"
									>
										{discussion.course.title}
									</Link>
								</div>
							</CardDescription>
						</div>
						<div className="flex items-center gap-2">
							<Badge
								variant={
									discussion.status === 'open'
										? 'default'
										: discussion.status === 'resolved'
											? 'secondary'
											: discussion.status === 'flagged'
												? 'destructive'
												: 'outline'
								}
							>
								{discussion.status.charAt(0).toUpperCase() +
									discussion.status.slice(1)}
							</Badge>
							{discussion.isPrivate && (
								<Badge variant="outline">
									<Shield className="mr-1 h-3 w-3" /> Private
								</Badge>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{allMessages.map((message) => (
							<div key={message.id} className="space-y-2">
								<div className="flex items-start gap-4">
									<Avatar>
										<AvatarImage
											src={message.sender.image || '/placeholder.svg'}
											alt={message.sender.name}
										/>
										<AvatarFallback>
											{message.sender.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<p className="font-medium">{message.sender.name}</p>
												<Badge variant="outline" className="text-xs">
													{message.sender.role}
												</Badge>
											</div>
											<div className="flex items-center gap-2">
												<p className="text-muted-foreground text-xs">
													{message.date} at {message.time}
												</p>
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
														<DropdownMenuLabel>
															Message Actions
														</DropdownMenuLabel>
														<DropdownMenuItem
															onClick={() => handleFlagMessage(message)}
														>
															<Flag className="mr-2 h-4 w-4" />
															Flag message
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive"
															onClick={() => {
																// toast({
																// 	title: 'Message deleted',
																// 	description: 'The message has been deleted.',
																// 	variant: 'destructive',
																// });
																toast.error(
																	`Message from ${message.sender.name} deleted.`,
																);
															}}
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete message
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
										<div className="prose prose-sm dark:prose-invert mt-1 max-w-none">
											{message.content.split('\n').map((paragraph, i) => (
												<p key={i} className="whitespace-pre-wrap">
													{paragraph}
												</p>
											))}
										</div>
										{message.isFlagged && (
											<div className="bg-destructive/10 text-destructive mt-2 rounded-md p-2 text-sm">
												<div className="flex items-center gap-1">
													<Flag className="h-3 w-3" />
													<span className="font-medium">Flagged:</span>
													<span>{message.flagReason}</span>
												</div>
											</div>
										)}
									</div>
								</div>
								{message !== allMessages[allMessages.length - 1] && (
									<Separator className="my-4" />
								)}
							</div>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex w-full items-center space-x-2">
						<Textarea
							placeholder="Type your message here..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							className="flex-1"
						/>
						<Button type="submit" size="icon" onClick={handleSendMessage}>
							<Send className="h-4 w-4" />
							<span className="sr-only">Send</span>
						</Button>
					</div>
				</CardFooter>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Course Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h3 className="font-medium">Course</h3>
								<p className="text-muted-foreground text-sm">
									<Link
										to={`/dashboard/admin/courses/${discussion.course.id}`}
										className="text-primary hover:underline"
									>
										{discussion.course.title}
									</Link>
								</p>
							</div>
							<div>
								<h3 className="font-medium">Instructor</h3>
								{discussion.instructor ? (
									<div className="mt-1 flex items-center gap-2">
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={discussion.instructor.image || '/placeholder.svg'}
												alt={discussion.instructor.name}
											/>
											<AvatarFallback>
												{discussion.instructor.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<Link
											to={`/dashboard/admin/instructors/${discussion.instructor.id}`}
											className="text-primary hover:underline"
										>
											{discussion.instructor.name}
										</Link>
									</div>
								) : (
									<p className="text-muted-foreground text-sm">
										No instructor assigned
									</p>
								)}
							</div>
							<div>
								<h3 className="font-medium">Started</h3>
								<p className="text-muted-foreground text-sm">
									{new Date(discussion.created).toLocaleDateString()} at{' '}
									{new Date(discussion.created).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline" className="w-full" asChild>
							<Link
								to={`/dashboard/admin/courses/${discussion.course.id}/discussions`}
							>
								<MessageCircle className="mr-2 h-4 w-4" /> View All Course
								Discussions
							</Link>
						</Button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Student Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h3 className="font-medium">Student</h3>
								<div className="mt-1 flex items-center gap-2">
									<Avatar className="h-6 w-6">
										<AvatarImage
											src={discussion.student.image || '/placeholder.svg'}
											alt={discussion.student.name}
										/>
										<AvatarFallback>
											{discussion.student.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<Link
										to={`/dashboard/admin/students/${discussion.student.id}`}
										className="text-primary hover:underline"
									>
										{discussion.student.name}
									</Link>
								</div>
							</div>
							<div>
								<h3 className="font-medium">Enrolled Courses</h3>
								<p className="text-muted-foreground text-sm">
									3 active courses
								</p>
							</div>
							<div>
								<h3 className="font-medium">Discussion Activity</h3>
								<p className="text-muted-foreground text-sm">
									7 discussions started
								</p>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button variant="outline" className="w-full" asChild>
							<Link
								to={`/dashboard/admin/students/${discussion.student.id}/discussions`}
							>
								<Users className="mr-2 h-4 w-4" /> View Student's Discussions
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>

			<Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Flag Message</DialogTitle>
						<DialogDescription>
							Please provide a reason for flagging this message. This will be
							reviewed by moderators.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="bg-muted rounded-md p-3">
							<p className="text-sm font-medium">
								{flaggedMessage?.sender.name}
							</p>
							<p className="mt-1 text-sm">{flaggedMessage?.content}</p>
						</div>
						<Textarea
							placeholder="Reason for flagging this message..."
							value={flagReason}
							onChange={(e) => setFlagReason(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowFlagDialog(false)}>
							Cancel
						</Button>
						<Button onClick={submitFlag} disabled={!flagReason.trim()}>
							Submit Flag
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
