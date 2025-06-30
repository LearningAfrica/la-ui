'use client';

import { useState } from 'react';
import { ArrowLeft, Edit, FileText, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link, useParams } from 'react-router-dom';

// Mock data for a category
const getCategoryById = (id: string) => {
	return {
		id: 'CAT-1',
		name: 'Account Management',
		slug: 'account-management',
		description: 'Articles related to account settings, login, and security.',
		articleCount: 12,
		articles: [
			{
				id: 'KB-101',
				title: 'How to Reset Your Password',
				slug: 'how-to-reset-password',
				status: 'published',
				views: 1245,
				lastUpdated: '2023-10-15',
			},
			{
				id: 'KB-102',
				title: 'Changing Your Email Address',
				slug: 'changing-email-address',
				status: 'published',
				views: 876,
				lastUpdated: '2023-10-10',
			},
			{
				id: 'KB-103',
				title: 'Two-Factor Authentication Setup',
				slug: 'two-factor-authentication-setup',
				status: 'published',
				views: 1032,
				lastUpdated: '2023-10-05',
			},
			{
				id: 'KB-104',
				title: 'Account Deletion Process',
				slug: 'account-deletion-process',
				status: 'draft',
				views: 0,
				lastUpdated: '2023-10-20',
			},
			{
				id: 'KB-105',
				title: 'Managing Notification Preferences',
				slug: 'managing-notification-preferences',
				status: 'published',
				views: 543,
				lastUpdated: '2023-09-28',
			},
		],
	};
};

export default function CategoryDetailPage() {
	const params = useParams<{ id: string }>();
	const [searchQuery, setSearchQuery] = useState('');

	// Get category data
	const category = getCategoryById(params.id!);

	if (!category) {
		return (
			<div className="flex-1 p-6 md:p-8">
				<div className="mb-6 flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/support/categories">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Categories
						</Link>
					</Button>
				</div>
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Category Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested category could not be found.
						</p>
						<Button asChild>
							<Link to="/dashboard/admin/support/categories">
								Return to Categories
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Filter articles based on search query
	const filteredArticles = category.articles.filter((article) =>
		article.title.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Get status badge
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'published':
				return (
					<Badge
						variant="outline"
						className="border-green-200 bg-green-50 text-green-600"
					>
						Published
					</Badge>
				);
			case 'draft':
				return (
					<Badge
						variant="outline"
						className="border-yellow-200 bg-yellow-50 text-yellow-600"
					>
						Draft
					</Badge>
				);
			case 'archived':
				return (
					<Badge
						variant="outline"
						className="border-gray-200 bg-gray-50 text-gray-600"
					>
						Archived
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/support/categories">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Categories
						</Link>
					</Button>
				</div>
				<Button size="sm" asChild>
					<Link to={`/dashboard/admin/support/categories/${category.id}/edit`}>
						<Edit className="mr-2 h-4 w-4" />
						Edit Category
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{category.name}</CardTitle>
					<CardDescription>{category.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-6 grid gap-4 md:grid-cols-3">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">
									Total Articles
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{category.articleCount}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">
									Published Articles
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{
										category.articles.filter((a) => a.status === 'published')
											.length
									}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">
									Total Views
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{category.articles
										.reduce((sum, article) => sum + article.views, 0)
										.toLocaleString()}
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium">Articles in this Category</h3>
							<Button asChild>
								<Link
									to={`/dashboard/admin/support/articles/create?category=${category.slug}`}
								>
									<FileText className="mr-2 h-4 w-4" />
									New Article
								</Link>
							</Button>
						</div>

						<div className="relative">
							<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
							<Input
								type="search"
								placeholder="Search articles..."
								className="w-full pl-8 md:max-w-sm"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-center">Views</TableHead>
										<TableHead>Last Updated</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredArticles.length === 0 ? (
										<TableRow>
											<TableCell colSpan={4} className="h-24 text-center">
												No articles found.
											</TableCell>
										</TableRow>
									) : (
										filteredArticles.map((article) => (
											<TableRow key={article.id}>
												<TableCell>
													<Link
														to={`/dashboard/admin/support/articles/${article.slug}`}
														className="text-primary font-medium hover:underline"
													>
														{article.title}
													</Link>
												</TableCell>
												<TableCell>{getStatusBadge(article.status)}</TableCell>
												<TableCell className="text-center">
													{article.views.toLocaleString()}
												</TableCell>
												<TableCell>{formatDate(article.lastUpdated)}</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
