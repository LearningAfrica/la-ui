import { useForm } from "react-hook-form";
import { href, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  type InquiryFormData,
  inquiryResolver,
} from "@/lib/schema/inquiry-schema";
import { useCreateInquiry } from "@/features/inquiries/inquiry-mutations";
import { Loader2 } from "lucide-react";
import { COMPANY_CATEGORIES, COMPANY_SIZES } from "@/lib/constants/company";
import { Checkbox } from "../ui/checkbox";
import { FormTextField } from "@/components/form-fields/form-text-field";
import { FormTextareaField } from "@/components/form-fields/form-textarea-field";
import { FormAsyncSelectField } from "@/components/form-fields/form-select-field";

export function InquiryForm() {
  const navigate = useNavigate();
  const createInquiryMutation = useCreateInquiry();

  const form = useForm<InquiryFormData>({
    resolver: inquiryResolver,
    defaultValues: {
      company_name: "",
      company_description: "",
      reason: "",
      accept_terms: false,
    },
  });

  const onSubmit = form.handleSubmit(async (data: InquiryFormData) => {
    await createInquiryMutation.mutateAsync(data, {
      onSuccess: () => {
        form.reset();
        // Redirect to a success page or home
        navigate(href("/dashboard"));
      },
    });
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          Organization Onboarding Inquiry
        </CardTitle>
        <CardDescription>
          Submit your organization details and we'll get back to you within
          24-48 hours to help you get started with Learning Africa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormTextField
                control={form.control}
                name="company_name"
                label="Organization Name"
                placeholder="Enter organization name"
                required
              />

              <FormAsyncSelectField
                control={form.control}
                name="company_category"
                label="Organization Type"
                placeholder="Select organization type"
                required
                options={[...COMPANY_CATEGORIES]}
              />

              <FormAsyncSelectField
                control={form.control}
                name="company_size"
                label="Company Size"
                placeholder="Select user range"
                required
                className="md:col-span-2"
                description="This helps us prepare the right resources for your organization"
                options={[...COMPANY_SIZES]}
              />
            </div>

            <FormTextareaField
              control={form.control}
              name="company_description"
              label="Please provide a brief description of your organization"
              placeholder="Tell us more about your organization and specific requirements..."
              required
              description="Include your mission, target audience, and learning goals"
            />

            <FormTextareaField
              control={form.control}
              name="reason"
              label="Why are you interested in Learning Africa?"
              placeholder="Tell us more about your organization and specific requirements..."
              required
              description="This helps us understand your needs better"
            />

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    {/* <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={field.value}
                      onChange={field.onChange}
                    /> */}
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions *</FormLabel>
                    <FormDescription>
                      By submitting this form, you agree to our terms of service
                      and privacy policy
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
              <Button
                type="submit"
                variant="gradient"
                disabled={createInquiryMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createInquiryMutation.status === "pending" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {createInquiryMutation.isPending
                  ? "Submitting..."
                  : "Submit Inquiry"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
