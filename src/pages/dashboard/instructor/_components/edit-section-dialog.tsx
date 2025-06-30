import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Form schema for editing a section
const sectionFormSchema = z.object({
  title: z.string().min(3, {
    message: 'Section title must be at least 3 characters.',
  }),
});

type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface EditSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: any;
  onUpdate: (data: { title: string }) => void;
}

export function EditSectionDialog({
  open,
  onOpenChange,
  section,
  onUpdate,
}: EditSectionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with section data
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: section?.title || '',
    },
  });

  // Update form values when section changes
  useState(() => {
    if (section) {
      form.reset({
        title: section.title,
      });
    }
  });

  // Handle form submission
  function onSubmit(data: SectionFormValues) {
    setIsSubmitting(true);

    // Update the section
    onUpdate(data);

    // Reset form and close dialog
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>Update the section title.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to the Course"
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
                onClick={() => onOpenChange(false)}
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
