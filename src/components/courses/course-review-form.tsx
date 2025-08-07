import { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiErrorMsg } from '@/lib/utils/axios-err';

const reviewSchema = z.object({
  decision: z.enum(['approve', 'reject']),
  feedback: z.string().min(10, {
    message: 'Feedback must be at least 10 characters.',
  }),
  contentQuality: z.boolean().optional(),
  technicalIssues: z.boolean().optional(),
  pricingConcerns: z.boolean().optional(),
  descriptionAccuracy: z.boolean().optional(),
  copyrightIssues: z.boolean().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface CourseReviewFormProps {
  courseId: string;
  courseName: string;
}

export function CourseReviewForm({
  courseId: _,
  courseName,
}: CourseReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      decision: undefined,
      feedback: '',
      contentQuality: false,
      technicalIssues: false,
      pricingConcerns: false,
      descriptionAccuracy: false,
      copyrightIssues: false,
    },
  });

  const watchDecision = form.watch('decision');

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        `Course review submitted successfully! Decision: ${values.decision === 'approve' ? 'Approved' : 'Changes requested'}`,
        {
          description:
            values.decision === 'approve'
              ? 'The instructor has been notified that their course is approved.'
              : 'The instructor has been notified about the requested changes.',
        },
      );

      navigate('/dashboard/admin/reviews');
    } catch (error) {
      toast.error(
        apiErrorMsg(
          error,
          'The review could not be submitted. Please try again.',
        ),
        {
          description: 'An error occurred while submitting the review.',
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Course: {courseName}</CardTitle>
        <CardDescription>
          Provide feedback to the instructor about their course submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="decision"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Decision</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="approve" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <span className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve course
                          </span>
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="reject" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          <span className="flex items-center">
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Request changes
                          </span>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchDecision === 'reject' && (
              <div className="space-y-4">
                <div className="text-sm font-medium">
                  Reason for changes (select all that apply):
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contentQuality"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Content Quality Issues</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technicalIssues"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Technical Issues</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricingConcerns"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Pricing Concerns</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descriptionAccuracy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Description Accuracy</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="copyrightIssues"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Copyright Issues</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback for Instructor</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        watchDecision === 'approve'
                          ? 'Provide any positive feedback or suggestions for the instructor'
                          : 'Explain what changes are needed before the course can be approved'
                      }
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific and constructive in your feedback to help the
                    instructor improve their course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
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
                  'Submit Review'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
