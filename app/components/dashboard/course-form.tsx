import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { courseResolver } from "@/lib/schema/course-schema";
import Loader2 from "~icons/lucide/loader-2";
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
  FormComboboxField,
  FormImageUploadField,
} from "@/components/form-fields";
import { orgRoutes } from "@/lib/utils/org-routes";
import type { Course } from "@/features/courses/course-queries";

interface CourseFormProps {
  course?: Course;
  redirectTo?: string;
  /** Called after a successful save instead of navigating (e.g. inside a Sheet). */
  onSuccess?: () => void;
  /** Custom cancel handler instead of navigating back (e.g. close a Sheet). */
  onCancel?: () => void;
}

/** A flat, hairline-separated group — no raised card chrome. */
function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-la-rule border-t pt-6 first:border-t-0 first:pt-0">
      <h3 className="font-display text-la-ink text-sm font-bold">{title}</h3>
      {hint && <p className="text-la-muted mt-0.5 text-xs">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function CourseForm({
  course,
  redirectTo,
  onSuccess,
  onCancel,
}: CourseFormProps) {
  const navigate = useNavigate();
  const { orgId = "" } = useParams<{ orgId: string }>();
  const isEditing = !!course;

  const coursesPath = orgRoutes.courses(orgId);

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

    const done = onSuccess ?? (() => navigate(redirectTo ?? coursesPath));

    return isEditing
      ? updateMutation.mutateAsync(
          { id: course!.id, data: payload },
          { onSuccess: done }
        )
      : createMutation.mutateAsync(payload, { onSuccess: done });
  });

  const cancel = onCancel ?? (() => navigate(redirectTo ?? coursesPath));

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <Section
          title="Details"
          hint="Name the course and place it in a category."
        >
          <FormTextField
            control={form.control}
            name="title"
            label="Course title"
            placeholder="Enter course title"
            required
            disabled={isLoading}
          />
          <FormComboboxField
            control={form.control}
            name="category"
            label="Category"
            placeholder="Select a category"
            searchPlaceholder="Search categories..."
            items={categoryOptions}
            required
            disabled={isLoading}
          />
          <FormTextareaField
            control={form.control}
            name="overview"
            label="Overview"
            placeholder="Describe what this course covers..."
            required
            disabled={isLoading}
          />
        </Section>

        <Section
          title="Cover image"
          hint="Shown on the course card and detail page."
        >
          <FormImageUploadField
            control={form.control}
            name="course_image"
            label=""
            disabled={isLoading}
          />
        </Section>

        <Section
          title="Access & pricing"
          hint="Control who can enroll and whether it costs anything."
        >
          {/* Flat hairline-separated setting rows — no boxed toggles */}
          <div className="border-la-rule-strong divide-la-rule divide-y overflow-hidden rounded-lg border">
            <FormSwitchField
              control={form.control}
              name="is_premium"
              label="Premium course"
              description="Charge a price for this course"
              disabled={isLoading}
              className="rounded-none border-0 px-4 py-3.5"
            />
            {isPremium && (
              <div className="px-4 py-3.5">
                <FormNumberField
                  control={form.control}
                  name="price"
                  label="Price"
                  placeholder="0.00"
                  required
                  disabled={isLoading}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </div>
            )}
            <FormSwitchField
              control={form.control}
              name="is_private"
              label="Private course"
              description="Only invited learners can access"
              disabled={isLoading}
              className="rounded-none border-0 px-4 py-3.5"
            />
          </div>
        </Section>

        <Section title="Discovery" hint="Tags help learners find this course.">
          <FormChipField
            control={form.control}
            name="tags"
            label=""
            placeholder="Type a tag and press Enter"
            required
            disabled={isLoading}
          />
        </Section>

        {/* Sticky action bar — stays in view without scrolling to the bottom */}
        <div className="border-la-rule bg-la-paper sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={cancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? "Save changes" : "Create course"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
