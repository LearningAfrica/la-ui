'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Define the schema for the note form
const noteFormSchema = z.object({
	content: z
		.string()
		.min(5, { message: 'Note must be at least 5 characters long' })
		.max(1000, { message: 'Note cannot exceed 1000 characters' }),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface EditNoteDialogProps {
	note: {
		id: string;
		content: string;
		date: string;
		author: string;
	};
	studentName: string;
	onNoteUpdated: (noteId: string, updatedContent: string) => void;
}

export function EditNoteDialog({
	note,
	studentName,
	onNoteUpdated,
}: EditNoteDialogProps) {
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize the form with existing note content
	const form = useForm<NoteFormValues>({
		resolver: zodResolver(noteFormSchema),
		defaultValues: {
			content: note.content,
		},
	});

	// Handle form submission
	const onSubmit = async (values: NoteFormValues) => {
		setIsSubmitting(true);

		try {
			// In a real app, this would be an API call
			// Simulate API call with timeout
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Call the onNoteUpdated callback to update the parent component
			onNoteUpdated(note.id, values.content);

			// Show success message
			// toast({
			// 	title: 'Note updated',
			// 	description: `Note has been updated on ${studentName}'s profile.`,
			// });
			toast.success(`Note has been updated on ${studentName}'s profile.`, {
				duration: 3000,
			});

			// Close the dialog
			setOpen(false);
		} catch (error) {
			// toast({
			// 	title: 'Error',
			// 	description: 'There was an error updating the note. Please try again.',
			// 	variant: 'destructive',
			// });
			toast.error('There was an error updating the note. Please try again.', {
				duration: 3000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<Edit className="h-4 w-4" />
					<span className="sr-only">Edit Note</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Edit Admin Note</DialogTitle>
					<DialogDescription>
						Edit this note on {studentName}'s profile.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Note Content</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter your note here..."
											className="min-h-[120px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving...' : 'Save Changes'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
