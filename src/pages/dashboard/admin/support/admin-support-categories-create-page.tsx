'use client';

import React from 'react';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define the form schema with Zod
const categorySchema = z.object({
	name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
	slug: z
		.string()
		.min(3, { message: 'Slug must be at least 3 characters' })
		.regex(/^[a-z0-9-]+$/, {
			message: 'Slug can only contain lowercase letters, numbers, and hyphens',
		}),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters' }),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize the form
	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: '',
			slug: '',
			description: '',
		},
	});

	// Auto-generate slug from name
	const watchName = form.watch('name');
	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
	};

	// Update slug when name changes
	React.useEffect(() => {
		if (watchName && !form.getValues('slug')) {
			form.setValue('slug', generateSlug(watchName));
		}
	}, [watchName, form]);

	// Handle form submission
	const onSubmit = async (data: CategoryFormValues) => {
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Log the form data (in a real app, you would send this to your API)
			console.log('Category data:', data);

			//   toast({
			//     title: "Category created",
			//     description: `${data.name} has been created successfully.`,
			//   })
			toast.success(`${data.name} has been created successfully.`);

			navigate('/dashboard/admin/support/categories');
		} catch (error) {
			console.error('Error creating category:', error);
			//   toast({
			//     title: "Error",
			//     description: "Failed to create category. Please try again.",
			//     variant: "destructive",
			//   })
			toast.error('Failed to create category. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/admin/support/categories">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Categories
					</Link>
				</Button>
			</div>

			<div>
				<h2 className="text-3xl font-bold tracking-tight">
					Create New Category
				</h2>
				<p className="text-muted-foreground">
					Create a new knowledge base category
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Category Details</CardTitle>
					<CardDescription>
						Enter the information for the new category
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category Name</FormLabel>
										<FormControl>
											<Input placeholder="e.g. Account Management" {...field} />
										</FormControl>
										<FormDescription>
											A clear and descriptive name for the category.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="slug"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Slug</FormLabel>
										<FormControl>
											<Input placeholder="e.g. account-management" {...field} />
										</FormControl>
										<FormDescription>
											The URL-friendly version of the name. Use only lowercase
											letters, numbers, and hyphens.
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
												placeholder="A brief description of what this category contains..."
												className="min-h-16"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											A short description that explains what kind of articles
											belong in this category.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end">
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating...
										</>
									) : (
										'Create Category'
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
