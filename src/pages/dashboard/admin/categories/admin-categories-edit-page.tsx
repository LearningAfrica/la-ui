'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Define the form schema with Zod
const categorySchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Category name must be at least 2 characters' })
		.max(50),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters' })
		.max(500),
	image: z
		.instanceof(FileList)
		.optional()
		.refine(
			(files) => {
				if (!files || files.length === 0) return true;
				return Array.from(files).every((file) =>
					['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
				);
			},
			{
				message: 'Image must be a valid JPEG, PNG, or WebP file',
			},
		),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// Mock data for the category
const mockCategory = {
	id: '1',
	name: 'Programming',
	description:
		'Learn coding and software development with comprehensive courses covering various programming languages and frameworks.',
	image: '/programming-category.jpg',
	courseCount: 243,
	students: 12345,
	revenue: '$243,500',
	createdAt: '2023-05-15',
	updatedAt: '2024-01-20',
};

export default function EditCategoryPage() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [currentImage, setCurrentImage] = useState<string | null>(null);
	const [category, setCategory] = useState<typeof mockCategory | null>(null);

	// Initialize the form
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: '',
			description: '',
		},
	});

	// Simulate loading category data
	useEffect(() => {
		const loadCategory = async () => {
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// In a real app, you would fetch the category by params.id
				const categoryData = mockCategory;
				setCategory(categoryData);
				setCurrentImage(categoryData.image);

				// Pre-populate form with existing data
				form.reset({
					name: categoryData.name,
					description: categoryData.description,
				});
			} catch (error) {
				console.error('Error loading category:', error);
				toast.error('Failed to load category');
			} finally {
				setIsLoading(false);
			}
		};

		loadCategory();
	}, [params.id, form]);

	// Handle form submission
	const onSubmit = async (data: CategoryFormValues) => {
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Log the form data (in a real app, you would send this to your API)
			console.log('Updated category data:', {
				id: params.id,
				name: data.name,
				description: data.description,
				image: data.image ? data.image[0].name : currentImage,
			});

			toast.success('Category updated successfully');
			navigate('/dashboard/admin/categories');
		} catch (error) {
			console.error('Error updating category:', error);
			toast.error('Failed to update category');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle image preview
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreviewImage(null);
		}
	};

	// Remove current image
	const removeCurrentImage = () => {
		setCurrentImage(null);
		setPreviewImage(null);
		// Reset the file input
		const fileInput = document.getElementById(
			'category-image',
		) as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	if (isLoading) {
		return (
			<div className="flex-1 space-y-6 p-6 md:p-8">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/categories">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Categories
						</Link>
					</Button>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<div className="bg-muted mb-2 h-8 w-48 animate-pulse rounded" />
						<div className="bg-muted h-4 w-64 animate-pulse rounded" />
					</div>
				</div>

				<Card className="max-w-2xl">
					<CardHeader>
						<div className="bg-muted mb-2 h-6 w-32 animate-pulse rounded" />
						<div className="bg-muted h-4 w-48 animate-pulse rounded" />
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<div className="bg-muted h-4 w-24 animate-pulse rounded" />
							<div className="bg-muted h-10 w-full animate-pulse rounded" />
						</div>
						<div className="space-y-2">
							<div className="bg-muted h-4 w-20 animate-pulse rounded" />
							<div className="bg-muted h-32 w-full animate-pulse rounded" />
						</div>
						<div className="space-y-2">
							<div className="bg-muted h-4 w-28 animate-pulse rounded" />
							<div className="bg-muted h-10 w-full animate-pulse rounded" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!category) {
		return (
			<div className="flex-1 space-y-6 p-6 md:p-8">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/dashboard/admin/categories">
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back to Categories
						</Link>
					</Button>
				</div>

				<Card className="max-w-2xl">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<h2 className="mb-2 text-xl font-semibold">Category Not Found</h2>
						<p className="text-muted-foreground mb-6">
							The requested category could not be found.
						</p>
						<Button asChild>
							<Link to="/dashboard/admin/categories">Return to Categories</Link>
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
					<Link to="/dashboard/admin/categories">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Categories
					</Link>
				</Button>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
					<p className="text-muted-foreground">
						Update the category information
					</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Category Details</CardTitle>
							<CardDescription>
								Update the information for this category
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category Name</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g. Web Development"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													This is the name that will be displayed to users.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describe what students will learn in this category..."
														className="min-h-32"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Provide a clear description of what this category
													covers.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="image"
										render={({ field: { value, onChange, ...fieldProps } }) => (
											<FormItem>
												<FormLabel>Category Image</FormLabel>
												<FormControl>
													<div className="space-y-4">
														<div className="flex items-center gap-4">
															<Button
																type="button"
																variant="outline"
																onClick={() =>
																	document
																		.getElementById('category-image')
																		?.click()
																}
																className="w-full"
															>
																<Upload className="mr-2 h-4 w-4" />
																{currentImage || previewImage
																	? 'Change Image'
																	: 'Upload Image'}
															</Button>
															<Input
																id="category-image"
																type="file"
																accept="image/jpeg,image/png,image/webp"
																className="hidden"
																onChange={(e) => {
																	onChange(e.target.files);
																	handleImageChange(e);
																}}
																{...fieldProps}
															/>
														</div>

														{(previewImage || currentImage) && (
															<div className="mt-4">
																<div className="mb-2 flex items-center justify-between">
																	<p className="text-muted-foreground text-sm">
																		{previewImage
																			? 'New Preview:'
																			: 'Current Image:'}
																	</p>
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		onClick={removeCurrentImage}
																		className="text-destructive hover:text-destructive"
																	>
																		<X className="mr-1 h-4 w-4" />
																		Remove
																	</Button>
																</div>
																<div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
																	<img
																		src={
																			previewImage ||
																			currentImage ||
																			'/placeholder.svg'
																		}
																		alt="Category preview"
																		className="h-full w-full object-cover"
																	/>
																</div>
															</div>
														)}
													</div>
												</FormControl>
												<FormDescription>
													Upload an image that represents this category.
													Recommended size: 1280x720px.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex justify-end gap-4">
										<Button
											type="button"
											variant="outline"
											onClick={() => navigate('/dashboard/admin/categories')}
										>
											Cancel
										</Button>
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? 'Updating...' : 'Update Category'}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Category Information</CardTitle>
							<CardDescription>Current category statistics</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Courses</span>
								<span className="font-medium">{category.courseCount}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Students</span>
								<span className="font-medium">
									{category.students.toLocaleString()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Revenue</span>
								<span className="font-medium">{category.revenue}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Created</span>
								<span className="font-medium">{category.createdAt}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">
									Last Updated
								</span>
								<span className="font-medium">{category.updatedAt}</span>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Manage this category</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button
								variant="outline"
								className="w-full bg-transparent"
								asChild
							>
								<Link to={`/dashboard/admin/categories/${category.id}`}>
									View Details
								</Link>
							</Button>
							<Button
								variant="outline"
								className="w-full bg-transparent"
								asChild
							>
								<Link to={`/dashboard/admin/courses?category=${category.id}`}>
									View Courses
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
