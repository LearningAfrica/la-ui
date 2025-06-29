import { useState } from 'react';
import {
	ArrowLeft,
	Filter,
	Search,
	AlertTriangle,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Link, useParams } from 'react-router-dom';

// Mock course data
const courseData = {
	id: 'c1',
	title: 'Complete JavaScript Course',
	instructor: {
		id: 'i1',
		name: 'Jane Doe',
		image: '/instructor-1.jpg',
	},
};

// Mock comments data
const commentsData = [
	{
		id: 'c1',
		lessonId: 'l1',
		lessonTitle: 'Introduction to JavaScript',
		content:
			"Great explanation of JavaScript basics! I was confused about the difference between let and const before, but now it's clear.",
		author: {
			id: 'u1',
			name: 'John Smith',
			image: '/student-1.jpg',
			role: 'student',
		},
		createdAt: '2023-11-15T10:30:00Z',
		status: 'published',
		reported: false,
	},
	{
		id: 'c2',
		lessonId: 'l1',
		lessonTitle: 'Introduction to JavaScript',
		content:
			'Glad you found it helpful! Remember that const prevents reassignment, but the object properties can still be modified.',
		author: {
			id: 'i1',
			name: 'Jane Doe',
			image: '/instructor-1.jpg',
			role: 'instructor',
		},
		createdAt: '2023-11-15T11:15:00Z',
		status: 'published',
		reported: false,
	},
	{
		id: 'c3',
		lessonId: 'l2',
		lessonTitle: 'Setting Up Your Environment',
		content:
			"I'm having trouble with the console.log example. When I try it in my browser, nothing happens. What am I doing wrong?",
		author: {
			id: 'u2',
			name: 'Sarah Johnson',
			image: '/student-2.jpg',
			role: 'student',
		},
		createdAt: '2023-11-16T09:45:00Z',
		status: 'published',
		reported: true,
		reportReason: 'Needs technical help',
	},
	{
		id: 'c4',
		lessonId: 'l4',
		lessonTitle: 'Variables and Data Types',
		content:
			'This content contains inappropriate language and should be removed.',
		author: {
			id: 'u3',
			name: 'Michael Brown',
			image: '/student-3.jpg',
			role: 'student',
		},
		createdAt: '2023-11-17T14:20:00Z',
		status: 'flagged',
		reported: true,
		reportReason: 'Inappropriate content',
	},
];

export default function CourseCommentsPage() {
	const [comments, setComments] = useState(commentsData);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeTab, setActiveTab] = useState('all');
	const params = useParams<{ id: string }>();
	// Filter comments based on search query and active tab
	const filteredComments = comments.filter((comment) => {
		const matchesSearch =
			comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
			comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			comment.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase());

		if (activeTab === 'all') return matchesSearch;
		if (activeTab === 'reported') return matchesSearch && comment.reported;
		if (activeTab === 'flagged')
			return matchesSearch && comment.status === 'flagged';

		return matchesSearch;
	});

	// Handle approving a comment
	const handleApproveComment = (commentId: string) => {
		setComments(
			comments.map((comment) =>
				comment.id === commentId
					? { ...comment, status: 'published', reported: false }
					: comment,
			),
		);
		// toast({
		//   title: "Comment approved",
		//   description: "The comment has been approved and is now visible to all students.",
		// })
		toast.success('Comment approved and is now visible to all students.', {
			description:
				'The comment has been approved and is now visible to all students.',
		});
	};

	// Handle rejecting a comment
	const handleRejectComment = (commentId: string) => {
		setComments(
			comments.map((comment) =>
				comment.id === commentId ? { ...comment, status: 'rejected' } : comment,
			),
		);
		// toast({
		//   title: "Comment rejected",
		//   description: "The comment has been rejected and is no longer visible to students.",
		// })
		toast.error('Comment rejected and is no longer visible to students.', {
			description:
				'The comment has been rejected and is no longer visible to students.',
		});
	};

	// Handle deleting a comment
	const handleDeleteComment = (commentId: string) => {
		setComments(comments.filter((comment) => comment.id !== commentId));
		// toast({
		//   title: "Comment deleted",
		//   description: "The comment has been permanently deleted.",
		// })
		toast.error('Comment deleted permanently.', {
			description: 'The comment has been permanently deleted.',
		});
	};

	return (
		<div className="container max-w-6xl py-6">
			<div className="mb-6">
				<Button variant="ghost" size="sm" asChild className="mb-2">
					<Link to={`/dashboard/instructor/courses/${params.id}`}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to course
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">{courseData.title} - Comments</h1>
				<p className="text-muted-foreground">
					Manage and moderate student comments for this course
				</p>
			</div>

			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full max-w-sm">
					<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
					<Input
						placeholder="Search comments..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Filter className="mr-2 h-4 w-4" />
							Filter
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setActiveTab('all')}>
							All Comments
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setActiveTab('reported')}>
							Reported Comments
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setActiveTab('flagged')}>
							Flagged Comments
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="all">
						All Comments
						<span className="bg-muted ml-1 rounded-full px-2 py-0.5 text-xs">
							{comments.length}
						</span>
					</TabsTrigger>
					<TabsTrigger value="reported">
						Reported
						<span className="bg-muted ml-1 rounded-full px-2 py-0.5 text-xs">
							{comments.filter((c) => c.reported).length}
						</span>
					</TabsTrigger>
					<TabsTrigger value="flagged">
						Flagged
						<span className="bg-muted ml-1 rounded-full px-2 py-0.5 text-xs">
							{comments.filter((c) => c.status === 'flagged').length}
						</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeTab} className="space-y-4">
					{filteredComments.length > 0 ? (
						filteredComments.map((comment) => (
							<Card
								key={comment.id}
								className={
									comment.reported
										? 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/10'
										: ''
								}
							>
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div className="flex items-start gap-2">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={comment.author.image || '/placeholder.svg'}
													alt={comment.author.name}
												/>
												<AvatarFallback>
													{comment.author.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{comment.author.name}
													</span>
													{comment.author.role === 'instructor' && (
														<Badge
															variant="outline"
															className="bg-primary/10 text-primary"
														>
															Instructor
														</Badge>
													)}
													{comment.reported && (
														<Badge
															variant="outline"
															className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
														>
															<AlertTriangle className="mr-1 h-3 w-3" />
															Reported
														</Badge>
													)}
												</div>
												<div className="text-muted-foreground flex items-center gap-2 text-xs">
													<span>
														{formatDistanceToNow(new Date(comment.createdAt), {
															addSuffix: true,
														})}
													</span>
													<span>•</span>
													<Link
														to={`/dashboard/instructor/courses/${params.id}/lessons/${comment.lessonId}`}
														className="hover:text-primary hover:underline"
													>
														{comment.lessonTitle}
													</Link>
												</div>
											</div>
										</div>
										<div className="flex gap-1">
											{comment.status === 'flagged' && (
												<Button
													variant="ghost"
													size="sm"
													className="h-8 text-green-600 hover:bg-green-100 hover:text-green-700"
													onClick={() => handleApproveComment(comment.id)}
												>
													<CheckCircle className="mr-1 h-4 w-4" />
													Approve
												</Button>
											)}
											{comment.status === 'flagged' && (
												<Button
													variant="ghost"
													size="sm"
													className="h-8 text-red-600 hover:bg-red-100 hover:text-red-700"
													onClick={() => handleRejectComment(comment.id)}
												>
													<XCircle className="mr-1 h-4 w-4" />
													Reject
												</Button>
											)}
											<Button
												variant="ghost"
												size="sm"
												className="h-8 text-red-600 hover:bg-red-100 hover:text-red-700"
												onClick={() => handleDeleteComment(comment.id)}
											>
												Delete
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm">{comment.content}</p>

									{comment.reported && comment.reportReason && (
										<div className="mt-2 rounded-md bg-amber-100 p-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
											<p className="font-medium">Report reason:</p>
											<p>{comment.reportReason}</p>
										</div>
									)}
								</CardContent>
							</Card>
						))
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12 text-center">
								<p className="mb-2 text-lg font-medium">No comments found</p>
								<p className="text-muted-foreground">
									{searchQuery
										? 'Try adjusting your search query'
										: activeTab === 'reported'
											? 'No reported comments at this time'
											: activeTab === 'flagged'
												? 'No flagged comments at this time'
												: 'No comments have been posted yet'}
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
