'use client';

import { useState } from 'react';

import {
	MoreHorizontal,
	Plus,
	Search,
	Edit,
	Trash2,
	Eye,
	FileText,
} from 'lucide-react';

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Mock data for support categories
const categoriesData = [
	{
		id: 'cat-1',
		name: 'Account Management',
		slug: 'account-management',
		description: 'Articles related to account settings, login, and security.',
		articleCount: 12,
		publishedArticles: 10,
		draftArticles: 2,
		totalViews: 15420,
		createdAt: '2023-09-15',
		updatedAt: '2023-12-10',
		status: 'active',
	},
	{
		id: 'cat-2',
		name: 'Billing & Payments',
		slug: 'billing-payments',
		description:
			'Information about billing cycles, payment methods, and invoices.',
		articleCount: 8,
		publishedArticles: 7,
		draftArticles: 1,
		totalViews: 9876,
		createdAt: '2023-09-20',
		updatedAt: '2023-12-08',
		status: 'active',
	},
	{
		id: 'cat-3',
		name: 'Course Creation',
		slug: 'course-creation',
		description: 'Guides for instructors on creating and managing courses.',
		articleCount: 15,
		publishedArticles: 13,
		draftArticles: 2,
		totalViews: 23450,
		createdAt: '2023-08-10',
		updatedAt: '2023-12-12',
		status: 'active',
	},
	{
		id: 'cat-4',
		name: 'Student Resources',
		slug: 'student-resources',
		description: 'Resources and guides for students using the platform.',
		articleCount: 10,
		publishedArticles: 8,
		draftArticles: 2,
		totalViews: 18230,
		createdAt: '2023-09-05',
		updatedAt: '2023-12-05',
		status: 'active',
	},
	{
		id: 'cat-5',
		name: 'Technical Support',
		slug: 'technical-support',
		description: 'Troubleshooting common technical issues and platform bugs.',
		articleCount: 7,
		publishedArticles: 5,
		draftArticles: 2,
		totalViews: 12100,
		createdAt: '2023-10-01',
		updatedAt: '2023-12-01',
		status: 'active',
	},
	{
		id: 'cat-6',
		name: 'Mobile App',
		slug: 'mobile-app',
		description: 'Help articles specific to mobile app usage and features.',
		articleCount: 6,
		publishedArticles: 4,
		draftArticles: 2,
		totalViews: 8750,
		createdAt: '2023-10-15',
		updatedAt: '2023-11-20',
		status: 'inactive',
	},
];

export default function SupportCategoriesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [categories, setCategories] = useState(categoriesData);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<any>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Filter categories based on search query
	const filteredCategories = categories.filter(
		(category) =>
			category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			category.slug.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Calculate totals
	const totalCategories = categories.length;
	const totalArticles = categories.reduce(
		(sum, cat) => sum + cat.articleCount,
		0,
	);
	const totalViews = categories.reduce((sum, cat) => sum + cat.totalViews, 0);
	const activeCategories = categories.filter(
		(cat) => cat.status === 'active',
	).length;

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
			case 'active':
				return (
					<Badge
						variant="outline"
						className="border-green-200 bg-green-50 text-green-600"
					>
						Active
					</Badge>
				);
			case 'inactive':
				return (
					<Badge
						variant="outline"
						className="border-gray-200 bg-gray-50 text-gray-600"
					>
						Inactive
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	// Handle opening the delete dialog
	const handleOpenDeleteDialog = (category: any) => {
		setSelectedCategory(category);
		setIsDeleteDialogOpen(true);
	};

	// Handle deleting a category
	const handleDeleteCategory = async () => {
		setIsDeleting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Remove the category from the list
			const updatedCategories = categories.filter(
				(category) => category.id !== selectedCategory.id,
			);
			setCategories(updatedCategories);

			//   toast({
			//     title: "Category deleted",
			//     description: `${selectedCategory.name} has been deleted successfully.`,
			//   })
			toast.success(`${selectedCategory.name} has been deleted successfully.`);

			setIsDeleteDialogOpen(false);
		} catch (error) {
			console.error('Error deleting category:', error);
			//   toast({
			//     title: "Error",
			//     description: "Failed to delete category. Please try again.",
			//     variant: "destructive",
			//   })
			toast.error('Failed to delete category. Please try again.');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="flex-1 space-y-4 p-4 md:p-8">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">
						Support Categories
					</h2>
					<p className="text-muted-foreground">
						Manage knowledge base categories and articles
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" asChild>
						<Link to="/dashboard/admin/support/categories/manage">
							<Edit className="mr-2 h-4 w-4" />
							Manage Categories
						</Link>
					</Button>
					<Button asChild>
						<Link to="/dashboard/admin/support/categories/create">
							<Plus className="mr-2 h-4 w-4" />
							New Category
						</Link>
					</Button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalCategories}</div>
						<p className="text-muted-foreground text-xs">
							{activeCategories} active
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Articles
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalArticles}</div>
						<p className="text-muted-foreground text-xs">
							Across all categories
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalViews.toLocaleString()}
						</div>
						<p className="text-muted-foreground text-xs">All time views</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Avg Articles/Category
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round(totalArticles / totalCategories)}
						</div>
						<p className="text-muted-foreground text-xs">
							Articles per category
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Knowledge Base Categories</CardTitle>
					<CardDescription>
						View and manage all support categories
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="relative max-w-sm">
								<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
								<Input
									type="search"
									placeholder="Search categories..."
									className="w-full pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" asChild>
									<Link to="/dashboard/admin/support/articles">
										<FileText className="mr-2 h-4 w-4" />
										View All Articles
									</Link>
								</Button>
							</div>
						</div>

						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Category</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-center">Articles</TableHead>
										<TableHead className="text-center">Views</TableHead>
										<TableHead>Last Updated</TableHead>
										<TableHead className="w-[80px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredCategories.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="h-24 text-center">
												No categories found.
											</TableCell>
										</TableRow>
									) : (
										filteredCategories.map((category) => (
											<TableRow key={category.id}>
												<TableCell>
													<div className="space-y-1">
														<Link
															to={`/dashboard/admin/support/categories/${category.id}`}
															className="text-primary font-medium hover:underline"
														>
															{category.name}
														</Link>
														<p className="text-muted-foreground line-clamp-1 text-sm">
															{category.description}
														</p>
														<p className="text-muted-foreground font-mono text-xs">
															/{category.slug}
														</p>
													</div>
												</TableCell>
												<TableCell>{getStatusBadge(category.status)}</TableCell>
												<TableCell className="text-center">
													<div className="space-y-1">
														<div className="font-medium">
															{category.articleCount}
														</div>
														<div className="text-muted-foreground text-xs">
															{category.publishedArticles} published,{' '}
															{category.draftArticles} draft
														</div>
													</div>
												</TableCell>
												<TableCell className="text-center">
													<div className="font-medium">
														{category.totalViews.toLocaleString()}
													</div>
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														<div className="text-sm">
															{formatDate(category.updatedAt)}
														</div>
														<div className="text-muted-foreground text-xs">
															Created {formatDate(category.createdAt)}
														</div>
													</div>
												</TableCell>
												<TableCell>
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
															<DropdownMenuItem asChild>
																<Link
																	to={`/dashboard/admin/support/categories/${category.id}`}
																>
																	<Eye className="mr-2 h-4 w-4" />
																	View Details
																</Link>
															</DropdownMenuItem>
															<DropdownMenuItem asChild>
																<Link
																	to={`/dashboard/admin/support/categories/${category.id}/edit`}
																>
																	<Edit className="mr-2 h-4 w-4" />
																	Edit Category
																</Link>
															</DropdownMenuItem>
															<DropdownMenuItem asChild>
																<Link
																	to={`/dashboard/admin/support/articles/create?category=${category.slug}`}
																>
																	<FileText className="mr-2 h-4 w-4" />
																	Add Article
																</Link>
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="text-destructive focus:text-destructive"
																onClick={() => handleOpenDeleteDialog(category)}
																disabled={category.articleCount > 0}
															>
																<Trash2 className="mr-2 h-4 w-4" />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>

						{filteredCategories.length > 0 && (
							<div className="text-muted-foreground flex items-center justify-between text-sm">
								<div>
									Showing {filteredCategories.length} of {categories.length}{' '}
									categories
								</div>
								<div className="flex items-center gap-4">
									<span>Total articles: {totalArticles}</span>
									<span>Total views: {totalViews.toLocaleString()}</span>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Delete Category Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the category &quot;
							{selectedCategory?.name}&quot; and all its articles. This action
							cannot be undone.
							{selectedCategory?.articleCount > 0 && (
								<div className="bg-destructive/10 mt-2 rounded-md p-2">
									<strong>Warning:</strong> This category contains{' '}
									{selectedCategory.articleCount} articles that will also be
									deleted.
								</div>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteCategory}
							disabled={isDeleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isDeleting ? 'Deleting...' : 'Delete Category'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
