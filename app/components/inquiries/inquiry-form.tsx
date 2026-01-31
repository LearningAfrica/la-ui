import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type InquiryFormData,
  inquiryResolver,
} from "@/lib/schema/inquiry-schema";
import { useCreateInquiry } from "@/features/inquiries/inquiry-mutations";
import { Building2, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { COMPANY_CATEGORIES, COMPANY_SIZES } from "@/lib/constants/company";

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

  const onSubmit = async (data: InquiryFormData) => {
    createInquiryMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        // Redirect to a success page or home
        navigate("/");
      },
    });
  };

  return (
    <Card className="w-full">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Organization Name */}
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          placeholder="Enter organization name"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Organization Type */}
              <FormField
                control={form.control}
                name="company_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type *</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_CATEGORIES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Users */}
              <FormField
                control={form.control}
                name="company_size"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Expected Number of Users *</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select user range" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This helps us prepare the right resources for your
                      organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Message */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MessageSquare className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                      <Textarea
                        placeholder="Tell us more about your organization and specific requirements..."
                        className="min-h-25 pt-3 pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Share any specific requirements or questions you may have
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms and Conditions */}
            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={field.value}
                      onChange={field.onChange}
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
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="gradient"
                disabled={createInquiryMutation.isPending}
                className="w-full sm:w-auto"
              >
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
