import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
  FormDescription,
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

interface AddNoteDialogProps {
  studentId: string;
  studentName: string;
  onNoteAdded: (note: {
    id: string;
    content: string;
    date: string;
    author: string;
  }) => void;
}

export function AddNoteDialog({
  studentId,
  studentName,
  onNoteAdded,
}: AddNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      content: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: NoteFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new note object
      const newNote = {
        id: `note-${Date.now()}`,
        content: values.content,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin User', // In a real app, this would be the current user's name
      };

      // Call the onNoteAdded callback to update the parent component
      onNoteAdded(newNote);

      // Show success message
      // toast({
      // 	title: 'Note added',
      // 	description: `Note has been added to ${studentName}'s profile.`,
      // });
      toast.success(`Note has been added to ${studentName}'s profile.`, {
        duration: 3000,
      });
      // Close the dialog and reset the form
      setOpen(false);
      form.reset();
    } catch (error) {
      // toast({
      // 	title: 'Error',
      // 	description: 'There was an error adding the note. Please try again.',
      // 	variant: 'destructive',
      // });
      toast.error('There was an error adding the note. Please try again.', {
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Note</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Admin Note</DialogTitle>
          <DialogDescription>
            Add a note to {studentName}'s profile. Notes are only visible to
            administrators.
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
                  <FormDescription>
                    This note will only be visible to administrators.
                  </FormDescription>
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
                {isSubmitting ? 'Adding...' : 'Add Note'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
