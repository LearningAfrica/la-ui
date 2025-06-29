import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Mock data for knowledge base articles
const knowledgeBaseArticles = [
	{
		id: 'kb-1',
		title: 'How to reset your password',
		category: 'Account',
		views: 1245,
		excerpt:
			"Learn how to reset your password if you've forgotten it or want to update it for security reasons.",
	},
	{
		id: 'kb-2',
		title: 'Downloading course materials for offline viewing',
		category: 'Courses',
		views: 982,
		excerpt:
			'This guide explains how to download course videos, slides, and other materials for offline access.',
	},
	{
		id: 'kb-3',
		title: 'Certificate verification process',
		category: 'Certificates',
		views: 756,
		excerpt:
			'Understanding how employers can verify the authenticity of your course completion certificates.',
	},
	{
		id: 'kb-4',
		title: 'Troubleshooting video playback issues',
		category: 'Technical',
		views: 1389,
		excerpt:
			'Solutions for common video playback problems including buffering, quality issues, and audio sync.',
	},
	{
		id: 'kb-5',
		title: 'How to get a refund',
		category: 'Billing',
		views: 643,
		excerpt:
			'Information about our refund policy and the process to request a refund for eligible courses.',
	},
];

// Mock data for FAQs
const faqs = [
	{
		id: 'faq-1',
		question: 'How do I access my course after purchase?',
		answer:
			"After purchasing a course, it will immediately appear in your 'My Courses' section. You can access it by clicking on the course card or by navigating to the 'My Courses' tab in your dashboard.",
	},
	{
		id: 'faq-2',
		question: 'Can I download videos for offline viewing?',
		answer:
			'Yes, most courses allow you to download videos for offline viewing. Look for the download icon next to the video player. Note that downloaded content is still protected by our DRM and is only available through our app.',
	},
	{
		id: 'faq-3',
		question: 'How long do I have access to a course?',
		answer:
			'Once you purchase a course, you have lifetime access to it. This means you can revisit the content whenever you need to refresh your knowledge or check for updates that the instructor may have added.',
	},
	{
		id: 'faq-4',
		question: 'How do I get my completion certificate?',
		answer:
			"Certificates are automatically generated when you complete all required components of a course. You can find your certificates in the 'Certificates' section of your dashboard. You can download them as PDF or share them directly to LinkedIn.",
	},
	{
		id: 'faq-5',
		question: 'What payment methods do you accept?',
		answer:
			'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and in select regions, we also support local payment methods like bank transfers and mobile payments.',
	},
];

// Mock data for recent tickets
const recentTickets = [
	{
		id: 'ticket-1',
		subject: 'Cannot access course videos',
		status: 'open',
		date: '2023-09-15',
		lastUpdate: '2023-09-16',
	},
	{
		id: 'ticket-2',
		subject: 'Certificate not generating after course completion',
		status: 'closed',
		date: '2023-09-10',
		lastUpdate: '2023-09-12',
	},
	{
		id: 'ticket-3',
		subject: 'Billing question about subscription',
		status: 'in-progress',
		date: '2023-09-05',
		lastUpdate: '2023-09-07',
	},
];

export default function StudentSupportPage() {
	const [searchQuery, setSearchQuery] = useState('');

	// Filter articles based on search query
	const filteredArticles = knowledgeBaseArticles.filter(
		(article) =>
			article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
			article.category.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Filter FAQs based on search query
	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
					<p className="text-muted-foreground">
						Find answers or get help with your questions
					</p>
				</div>
				<Button asChild>
					<Link to="/dashboard/student/support/tickets/create">
						<PlusCircle className="mr-2 h-4 w-4" />
						Create Support Ticket
					</Link>
				</Button>
			</div>

			<div className="relative">
				<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
				<Input
					placeholder="Search for help articles, FAQs, or topics..."
					className="pl-10"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<Tabs defaultValue="knowledge-base">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
					<TabsTrigger value="faqs">FAQs</TabsTrigger>
					<TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
				</TabsList>

				<TabsContent value="knowledge-base" className="space-y-4 pt-4">
					{filteredArticles.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<p className="text-muted-foreground text-center">
									No articles found matching your search criteria.
								</p>
								<Button variant="link" onClick={() => setSearchQuery('')}>
									Clear search
								</Button>
							</CardContent>
						</Card>
					) : (
						filteredArticles.map((article) => (
							<Card key={article.id}>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-xl">{article.title}</CardTitle>
											<CardDescription className="mt-1">
												{article.views} views
											</CardDescription>
										</div>
										<Badge variant="outline">{article.category}</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<p>{article.excerpt}</p>
								</CardContent>
								<CardFooter>
									<Button variant="outline" asChild className="w-full">
										<Link to={`/support/articles/${article.id}`}>
											Read Full Article
										</Link>
									</Button>
								</CardFooter>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent value="faqs" className="space-y-4 pt-4">
					{filteredFaqs.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<p className="text-muted-foreground text-center">
									No FAQs found matching your search criteria.
								</p>
								<Button variant="link" onClick={() => setSearchQuery('')}>
									Clear search
								</Button>
							</CardContent>
						</Card>
					) : (
						filteredFaqs.map((faq) => (
							<Card key={faq.id}>
								<CardHeader>
									<CardTitle className="text-xl">{faq.question}</CardTitle>
								</CardHeader>
								<CardContent>
									<p>{faq.answer}</p>
								</CardContent>
							</Card>
						))
					)}
				</TabsContent>

				<TabsContent value="my-tickets" className="space-y-4 pt-4">
					<div className="flex justify-between">
						<h2 className="text-xl font-semibold">Recent Support Tickets</h2>
						<Button asChild>
							<Link to="/dashboard/student/support/tickets">
								View All Tickets
							</Link>
						</Button>
					</div>

					{recentTickets.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<p className="text-muted-foreground text-center">
									You haven't created any support tickets yet.
								</p>
								<Button asChild className="mt-4">
									<Link to="/dashboard/student/support/tickets/create">
										Create Your First Ticket
									</Link>
								</Button>
							</CardContent>
						</Card>
					) : (
						recentTickets.map((ticket) => (
							<Card key={ticket.id}>
								<CardHeader>
									<div className="flex items-start justify-between">
										<CardTitle>{ticket.subject}</CardTitle>
										<Badge
											variant={
												ticket.status === 'open'
													? 'default'
													: ticket.status === 'in-progress'
														? 'outline'
														: 'secondary'
											}
										>
											{ticket.status === 'open'
												? 'Open'
												: ticket.status === 'in-progress'
													? 'In Progress'
													: 'Closed'}
										</Badge>
									</div>
									<CardDescription>
										Created on {ticket.date} • Last updated {ticket.lastUpdate}
									</CardDescription>
								</CardHeader>
								<CardFooter>
									<Button variant="outline" asChild className="w-full">
										<Link
											to={`/dashboard/student/support/tickets/${ticket.id}`}
										>
											View Ticket
										</Link>
									</Button>
								</CardFooter>
							</Card>
						))
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
