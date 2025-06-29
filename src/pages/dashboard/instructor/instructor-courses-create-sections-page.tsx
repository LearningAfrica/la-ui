'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
	ArrowLeft,
	ArrowUp,
	ArrowDown,
	Edit,
	Loader2,
	Plus,
	Save,
	Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link, useNavigate } from 'react-router-dom';

// Define the form schema with Zod
const sectionSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'Title must be at least 3 characters' })
		.max(100),
	description: z.string().max(500).optional(),
	order: z.number().int().positive(),
});

type SectionFormValues = z.infer<typeof sectionSchema>;

// Mock data for sections
const initialSections = [
	{
		id: '1',
		title: 'Introduction to the Course',
		description: 'Get familiar with the course structure and goals',
		order: 1,
	},
	{
		id: '2',
		title: 'Getting Started with Fundamentals',
		description: 'Learn the core concepts and basic principles',
		order: 2,
	},
	{
		id: '3',
		title: 'Advanced Concepts',
		description: 'Dive deeper into more complex topics',
		order: 3,
	},
	{
		id: '4',
		title: 'Practical Applications',
		description: 'Apply your knowledge to real-world scenarios',
		order: 4,
	},
	{
		id: '5',
		title: 'Final Project',
		description: 'Put everything together in a comprehensive project',
		order: 5,
	},
];

export default function InstructorManageCourseSectionsPage() {
	const navigate = useNavigate();
	const [sections, setSections] = useState(initialSections);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

	// Initialize the form
	const form = useForm<SectionFormValues>({
		resolver: zodResolver(sectionSchema),
		defaultValues: {
			title: '',
			description: '',
			order: sections.length + 1,
		},
	});

	// Handle form submission for adding a new section
	const onSubmit = async (data: SectionFormValues) => {
		setIsSubmitting(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (editingSectionId) {
				// Update existing section
				setSections(
					sections.map((section) =>
						section.id === editingSectionId
							? {
									...section,
									title: data.title,
									description: data.description || '',
									order: data.order,
								}
							: section,
					),
				);
				toast.success('Section updated successfully!');
				setEditingSectionId(null);
			} else {
				// Add new section
				const newSection = {
					id: Date.now().toString(),
					title: data.title,
					description: data.description || '',
					order: data.order,
				};
				setSections([...sections, newSection]);
				toast.success('Section added successfully!');
			}

			// Reset form
			form.reset({
				title: '',
				description: '',
				order: sections.length + 1,
			});
			setIsDialogOpen(false);
		} catch (error) {
			console.error('Error saving section:', error);
			toast.error('Failed to save section. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle editing a section
	const handleEditSection = (section: (typeof sections)[0]) => {
		setEditingSectionId(section.id);
		form.reset({
			title: section.title,
			description: section.description,
			order: section.order,
		});
		setIsDialogOpen(true);
	};

	// Handle deleting a section
	const handleDeleteSection = async (id: string) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			setSections(sections.filter((section) => section.id !== id));
			toast.success('Section deleted successfully!');
		} catch (error) {
			console.error('Error deleting section:', error);
			toast.error('Failed to delete section. Please try again.');
		}
	};

	// Handle moving a section up or down
	const handleMoveSection = (id: string, direction: 'up' | 'down') => {
		const sectionIndex = sections.findIndex((section) => section.id === id);
		if (
			(direction === 'up' && sectionIndex === 0) ||
			(direction === 'down' && sectionIndex === sections.length - 1)
		) {
			return;
		}

		const newSections = [...sections];
		const targetIndex =
			direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
		const temp = newSections[targetIndex];
		newSections[targetIndex] = {
			...newSections[sectionIndex],
			order: temp.order,
		};
		newSections[sectionIndex] = {
			...temp,
			order: newSections[targetIndex].order,
		};

		// Sort by order
		newSections.sort((a, b) => a.order - b.order);
		setSections(newSections);
	};

	// Handle save and continue
	const handleSaveAndContinue = () => {
		toast.success('Course sections saved successfully!');
		navigate('/dashboard/instructor/courses/create/content');
	};

	return (
		<div className="flex-1 space-y-6 p-6 md:p-8">
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/dashboard/instructor/courses/create">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Course Details
					</Link>
				</Button>
			</div>

			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Manage Course Sections
					</h1>
					<p className="text-muted-foreground">
						Organize your course into logical sections
					</p>
				</div>
				<div className="flex gap-2">
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Add Section
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									{editingSectionId ? 'Edit Section' : 'Add New Section'}
								</DialogTitle>
								<DialogDescription>
									{editingSectionId
										? 'Update the details of this course section'
										: 'Create a new section to organize your course content'}
								</DialogDescription>
							</DialogHeader>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Section Title*</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g. Introduction to the Course"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													A clear title for this section
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
														placeholder="Brief description of this section..."
														className="resize-none"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Optional: Provide a brief overview of this section
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="order"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Display Order*</FormLabel>
												<FormControl>
													<Input
														type="number"
														min="1"
														{...field}
														onChange={(e) =>
															field.onChange(Number.parseInt(e.target.value))
														}
													/>
												</FormControl>
												<FormDescription>
													The order in which this section appears in the course
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<DialogFooter>
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													{editingSectionId ? 'Updating...' : 'Adding...'}
												</>
											) : (
												<>
													{editingSectionId ? 'Update Section' : 'Add Section'}
												</>
											)}
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>

					<Button variant="outline" onClick={handleSaveAndContinue}>
						<Save className="mr-2 h-4 w-4" />
						Save and Continue
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Course Sections</CardTitle>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[500px] pr-4">
						<div className="space-y-4">
							{sections.length > 0 ? (
								sections
									.sort((a, b) => a.order - b.order)
									.map((section) => (
										<Card key={section.id} className="overflow-hidden">
											<CardContent className="p-0">
												<div className="flex items-start p-4">
													<div className="bg-primary/10 mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
														<span className="text-sm font-medium">
															{section.order}
														</span>
													</div>
													<div className="min-w-0 flex-1">
														<h3 className="text-lg font-medium">
															{section.title}
														</h3>
														{section.description && (
															<p className="text-muted-foreground mt-1 text-sm">
																{section.description}
															</p>
														)}
													</div>
													<div className="ml-4 flex items-center gap-2">
														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																handleMoveSection(section.id, 'up')
															}
															disabled={section.order === 1}
														>
															<ArrowUp className="h-4 w-4" />
															<span className="sr-only">Move up</span>
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																handleMoveSection(section.id, 'down')
															}
															disabled={section.order === sections.length}
														>
															<ArrowDown className="h-4 w-4" />
															<span className="sr-only">Move down</span>
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => handleEditSection(section)}
														>
															<Edit className="h-4 w-4" />
															<span className="sr-only">Edit</span>
														</Button>
														<AlertDialog>
															<AlertDialogTrigger asChild>
																<Button variant="ghost" size="icon">
																	<Trash2 className="text-destructive h-4 w-4" />
																	<span className="sr-only">Delete</span>
																</Button>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Delete Section
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		Are you sure you want to delete this
																		section? This action cannot be undone.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Cancel</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() =>
																			handleDeleteSection(section.id)
																		}
																	>
																		Delete
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												</div>
											</CardContent>
										</Card>
									))
							) : (
								<div className="py-12 text-center">
									<h3 className="mb-2 text-lg font-medium">No sections yet</h3>
									<p className="text-muted-foreground mb-6">
										Add sections to organize your course content into logical
										groups
									</p>
									<Button onClick={() => setIsDialogOpen(true)}>
										<Plus className="mr-2 h-4 w-4" />
										Add Your First Section
									</Button>
								</div>
							)}
						</div>
					</ScrollArea>
				</CardContent>
				<CardFooter className="flex justify-between border-t p-4">
					<p className="text-muted-foreground text-sm">
						{sections.length} {sections.length === 1 ? 'section' : 'sections'}
					</p>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsDialogOpen(true)}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Section
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
