import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  notes: z.string().optional(),
  confirmComplete: z.boolean().refine((val) => val === true, {
    message: 'You must confirm your course is complete',
  }),
  confirmGuidelines: z.boolean().refine((val) => val === true, {
    message: 'You must confirm your course follows our guidelines',
  }),
});

type SubmitForReviewFormValues = z.infer<typeof formSchema>;

interface SubmitForReviewDialogProps {
  courseId: string;
  disabled?: boolean;
}

export function SubmitForReviewDialog({
  courseId,
  disabled,
}: SubmitForReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<SubmitForReviewFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
      confirmComplete: false,
      confirmGuidelines: false,
    },
  });

  const onSubmit = async (values: SubmitForReviewFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: 'Course submitted for review',
        description: "We'll notify you once your course has been reviewed.",
      });

      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Your course could not be submitted. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Submit for Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Submit Course for Review</DialogTitle>
          <DialogDescription>
            Your course will be reviewed by our team before it can be published.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes for Reviewers (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes that might help our review team understand your course better"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special considerations or context about your
                    course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="confirmComplete"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I confirm that my course content is complete and ready
                        for review
                      </FormLabel>
                      <FormDescription>
                        All sections, lessons, and resources have been uploaded
                        and finalized
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmGuidelines"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I confirm that my course follows the platform guidelines
                      </FormLabel>
                      <FormDescription>
                        Content adheres to our quality standards, copyright
                        policies, and community guidelines
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit for Review
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
