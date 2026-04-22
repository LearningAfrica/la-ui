import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { courseResolver } from "@/lib/schema/course-schema";
import { Loader2 } from "lucide-react";
import {
  useCreateCourse,
  useUpdateCourse,
} from "@/features/courses/course-mutations";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useCategories } from "@/features/categories/category-queries";
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormSwitchField,
  FormChipField,
  FormAsyncSelectField,
  FormImageUploadField,
} from "@/components/form-fields";
import type { Course } from "@/features/courses/course-queries";

interface CourseFormProps {
  course?: Course;
  redirectTo?: string;
}

export function CourseForm({ course, redirectTo }: CourseFormProps) {
  const navigate = useNavigate();
  const isEditing = !!course;

  const { selectedOrganization } = useOrganizationStore();
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  const categoryOptions = (categoriesData?.data ?? []).map((cat) => ({
    value: String(cat.id),
    label: cat.category_name,
  }));

  const form = useForm({
    resolver: courseResolver,
    defaultValues: course
      ? {
          organization: selectedOrganization?.id ?? "",
          category: course.category?.id ?? "",
          title: course.title,
          overview: course.overview,
          is_premium: course.is_premium,
          price: course.price,
          is_private: course.is_private,
          tags: course.tags,
          course_image: undefined as File | undefined,
        }
      : {
          organization: selectedOrganization?.id ?? "",
          category: "",
          title: "",
          overview: "",
          is_premium: false,
          price: 0,
          is_private: false,
          tags: [] as string[],
          course_image: undefined as File | undefined,
        },
  });

  const isPremium = useWatch({ control: form.control, name: "is_premium" });

  const handleFormSubmit = form.handleSubmit((data) => {
    const payload = {
      ...data,
      organization: selectedOrganization?.id ?? data.organization,
    };

    const done = () => navigate(redirectTo ?? "/client/dashboard/courses");

    return isEditing
      ? updateMutation.mutateAsync(
          { id: course!.id, data: payload },
          { onSuccess: done }
        )
      : createMutation.mutateAsync(payload, { onSuccess: done });
  });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormImageUploadField
          control={form.control}
          name="course_image"
          label="Course Image"
          disabled={isLoading}
        />

        <FormTextField
          control={form.control}
          name="title"
          label="Course Title"
          placeholder="Enter course title"
          required
          disabled={isLoading}
        />

        <FormAsyncSelectField
          control={form.control}
          name="category"
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
          required
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSwitchField
            control={form.control}
            name="is_premium"
            label="Premium Course"
            description="Charge a price for this course"
            disabled={isLoading}
          />

          <FormSwitchField
            control={form.control}
            name="is_private"
            label="Private Course"
            description="Only invited learners can access"
            disabled={isLoading}
          />
        </div>

        {isPremium && (
          <FormNumberField
            control={form.control}
            name="price"
            label="Price"
            placeholder="0.00"
            required
            disabled={isLoading}
            inputProps={{ min: 0, step: 0.01 }}
          />
        )}

        <FormChipField
          control={form.control}
          name="tags"
          label="Tags"
          placeholder="Type a tag and press Enter"
          required
          disabled={isLoading}
          description="Add at least one tag to help learners discover this course"
        />

        <FormTextareaField
          control={form.control}
          name="overview"
          label="Overview"
          placeholder="Describe what this course covers..."
          required
          disabled={isLoading}
        />

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(redirectTo ?? "/client/dashboard/courses")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
