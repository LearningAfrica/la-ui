import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Mock discussion data
const discussionsData = [
	{
		id: '1',
		student: {
			id: 's1',
			name: 'John Smith',
			image: '/student-1.jpg',
		},
		course: {
			id: 'c1',
			title: 'Complete JavaScript Course',
		},
		title: 'Question about async/await',
		initialMessage:
			"I'm having trouble understanding how async/await works with Promise.all(). Can you explain?",
		date: '2024-02-05',
		time: '14:35',
		status: 'unread',
		messages: [
			{
				id: 'm1',
				sender: {
					id: 's1',
					name: 'John Smith',
					image: '/student-1.jpg',
					role: 'student',
				},
				content:
					"I'm having trouble understanding how async/await works with Promise.all(). Can you explain?",
				date: '2024-02-05',
				time: '14:35',
			},
			{
				id: 'm2',
				sender: {
					id: 'i1',
					name: 'Jane Doe',
					image: '/instructor-1.jpg',
					role: 'instructor',
				},
				content:
					"Great question! Promise.all() takes an array of promises and returns a new promise that resolves when all of the promises in the array have resolved. You can use it with async/await like this:\n\n```javascript\nasync function fetchData() {\n  const promises = [\n    fetch('url1').then(res => res.json()),\n    fetch('url2').then(res => res.json()),\n  ];\n  \n  const results = await Promise.all(promises);\n  console.log(results); // Array of results\n}\n```\n\nDoes that help?",
				date: '2024-02-05',
				time: '15:20',
			},
			{
				id: 'm3',
				sender: {
					id: 's1',
					name: 'John Smith',
					image: '/student-1.jpg',
					role: 'student',
				},
				content:
					'That makes sense! So Promise.all() waits for all promises to resolve and returns an array of results in the same order. What happens if one of the promises rejects?',
				date: '2024-02-05',
				time: '15:45',
			},
		],
	},
];

export default function DiscussionDetailPage() {
	const [newMessage, setNewMessage] = useState('');
	const [messages, setMessages] = useState<any[]>([]);
	const params = useParams<{
		id: string;
	}>();
	// Find discussion by ID
	const discussion = discussionsData.find((d) => d.id === params.id);

	if (!discussion) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/instructor/discussions">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Discussions
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Discussion Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested discussion could not be found.
						</p>
						<Button asChild>
							<Link to="/dashboard/instructor/discussions">
								Return to Discussions
							</Link>
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
			const newMsg = {
				id: `new-${Date.now()}`,
				sender: {
					id: 'i1',
					name: 'Jane Doe',
					image: '/instructor-1.jpg',
					role: 'instructor',
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

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/instructor/discussions">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Discussions
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div>
							<CardTitle>{discussion.title}</CardTitle>
							<CardDescription>
								{discussion.student.name} • {discussion.course.title}
							</CardDescription>
						</div>
						<Badge className="w-fit">
							{allMessages.length} message{allMessages.length !== 1 ? 's' : ''}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{allMessages.map((message) => (
							<div
								key={message.id}
								className={`flex gap-4 ${message.sender.role === 'instructor' ? 'justify-end' : 'justify-start'}`}
							>
								{message.sender.role !== 'instructor' && (
									<Avatar>
										<AvatarImage
											src={message.sender.image || '/placeholder.svg'}
											alt={message.sender.name}
										/>
										<AvatarFallback>
											{message.sender.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
								)}
								<div
									className={`max-w-[80%] rounded-lg p-4 ${
										message.sender.role === 'instructor'
											? 'bg-primary text-primary-foreground'
											: 'bg-muted'
									}`}
								>
									<div className="mb-1 flex items-center justify-between">
										<p className="text-sm font-medium">{message.sender.name}</p>
										<p className="text-xs opacity-70">
											{message.date} at {message.time}
										</p>
									</div>
									<div className="prose prose-sm dark:prose-invert max-w-none">
										{message.content
											.split('\n')
											.map((paragraph: string, i: number) => (
												<p key={i} className="whitespace-pre-wrap">
													{paragraph}
												</p>
											))}
									</div>
								</div>
								{message.sender.role === 'instructor' && (
									<Avatar>
										<AvatarImage
											src={message.sender.image || '/placeholder.svg'}
											alt={message.sender.name}
										/>
										<AvatarFallback>
											{message.sender.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
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

			<Card>
				<CardHeader>
					<CardTitle>Course Information</CardTitle>
					<CardDescription>
						Details about the course related to this discussion
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h3 className="font-medium">Course</h3>
							<p className="text-muted-foreground text-sm">
								<Link
									to={`/dashboard/instructor/courses/${discussion.course.id}`}
									className="text-primary hover:underline"
								>
									{discussion.course.title}
								</Link>
							</p>
						</div>
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
									to={`/dashboard/instructor/students/${discussion.student.id}`}
									className="text-primary hover:underline"
								>
									{discussion.student.name}
								</Link>
							</div>
						</div>
						<div>
							<h3 className="font-medium">Started</h3>
							<p className="text-muted-foreground text-sm">
								{discussion.date} at {discussion.time}
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button variant="outline" className="w-full" asChild>
						<Link
							to={`/dashboard/instructor/courses/${discussion.course.id}/discussions`}
						>
							<MessageSquare className="mr-2 h-4 w-4" /> View All Course
							Discussions
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
