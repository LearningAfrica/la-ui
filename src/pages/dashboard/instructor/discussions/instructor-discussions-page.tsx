import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';

// Mock data for discussions
const initialDiscussions = [
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
		message:
			"I'm having trouble understanding how async/await works with Promise.all(). Can you explain?",
		date: '2024-02-05',
		time: '14:35',
		status: 'unread',
		replies: 0,
	},
	{
		id: '2',
		student: {
			id: 's2',
			name: 'Sarah Johnson',
			image: '/student-2.jpg',
		},
		course: {
			id: 'c2',
			title: 'React Native for Beginners',
		},
		title: 'Installation issues on Windows',
		message:
			"I'm getting errors when trying to set up the development environment on Windows. Can you help?",
		date: '2024-02-04',
		time: '10:20',
		status: 'read',
		replies: 2,
	},
	{
		id: '3',
		student: {
			id: 's3',
			name: 'Michael Brown',
			image: '/student-3.jpg',
		},
		course: {
			id: 'c3',
			title: 'Advanced TypeScript Patterns',
		},
		title: 'Feedback on my project',
		message:
			"I've completed the project and would appreciate your feedback on my implementation.",
		date: '2024-02-03',
		time: '16:45',
		status: 'read',
		replies: 1,
	},
	{
		id: '4',
		student: {
			id: 's4',
			name: 'Emily Davis',
			image: '/student-4.jpg',
		},
		course: {
			id: 'c1',
			title: 'Complete JavaScript Course',
		},
		title: 'Module 3 content outdated?',
		message:
			'I noticed that some of the syntax in Module 3 seems outdated. Is there updated material?',
		date: '2024-02-02',
		time: '09:15',
		status: 'read',
		replies: 3,
	},
	{
		id: '5',
		student: {
			id: 's5',
			name: 'David Wilson',
			image: '/student-5.jpg',
		},
		course: {
			id: 'c2',
			title: 'React Native for Beginners',
		},
		title: 'Extra resources for animations',
		message:
			'Do you have any recommended resources for learning more about React Native animations?',
		date: '2024-02-01',
		time: '11:30',
		status: 'read',
		replies: 1,
	},
];

export default function InstructorDiscussionsPage() {
	const { user } = useAuth();
	const [discussions, _setDiscussions] = useState(initialDiscussions);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('all');

	// Filter discussions based on search query and active tab
	const filteredDiscussions = discussions.filter(
		(discussion) =>
			(discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				discussion.student.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				discussion.course.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase())) &&
			(activeTab === 'all' ||
				(activeTab === 'unread' && discussion.status === 'unread')),
	);

	// Count unread discussions
	const unreadCount = discussions.filter(
		(discussion) => discussion.status === 'unread',
	).length;

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
					<p className="text-muted-foreground">
						Manage and respond to student questions and discussions
					</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Student Discussions</CardTitle>
					<CardDescription>
						Questions and discussions from your students
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
							<Input
								type="search"
								placeholder="Search discussions..."
								className="w-full pl-8 md:max-w-sm"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					<Tabs
						defaultValue="all"
						value={activeTab}
						onValueChange={setActiveTab}
						className="space-y-4"
					>
						<TabsList>
							<TabsTrigger value="all">All</TabsTrigger>
							<TabsTrigger value="unread">
								Unread <Badge className="bg-primary ml-2">{unreadCount}</Badge>
							</TabsTrigger>
						</TabsList>

						<TabsContent value={activeTab} className="space-y-4">
							{filteredDiscussions.length === 0 ? (
								<div className="py-10 text-center">
									<MessageSquare className="text-muted-foreground/50 mx-auto h-12 w-12" />
									<h3 className="mt-4 text-lg font-medium">
										No discussions found
									</h3>
									<p className="text-muted-foreground mt-2 text-sm">
										{activeTab === 'unread'
											? 'You have no unread discussions.'
											: 'No discussions match your search criteria.'}
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{filteredDiscussions.map((discussion) => (
										<Link
											key={discussion.id}
											to={`/dashboard/instructor/discussions/${discussion.id}`}
											className="block"
										>
											<div
												className={`hover:bg-muted/50 rounded-lg border p-4 transition-colors ${
													discussion.status === 'unread' ? 'bg-muted/30' : ''
												}`}
											>
												<div className="flex items-start justify-between">
													<div className="flex items-start gap-3">
														<Avatar>
															<AvatarImage
																src={
																	discussion.student.image || '/placeholder.svg'
																}
																alt={discussion.student.name}
															/>
															<AvatarFallback>
																{discussion.student.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<div>
															<div className="flex items-center gap-2">
																<h3 className="font-medium">
																	{discussion.title}
																</h3>
																{discussion.status === 'unread' && (
																	<Badge className="bg-primary">New</Badge>
																)}
															</div>
															<p className="text-muted-foreground text-sm">
																{discussion.student.name} •{' '}
																{discussion.course.title}
															</p>
															<p className="mt-1 line-clamp-2 text-sm">
																{discussion.message}
															</p>
														</div>
													</div>
													<div className="flex flex-col items-end gap-1">
														<p className="text-muted-foreground text-xs">
															{discussion.date} at {discussion.time}
														</p>
														<Badge variant="outline" className="mt-1">
															{discussion.replies}{' '}
															{discussion.replies === 1 ? 'reply' : 'replies'}
														</Badge>
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
