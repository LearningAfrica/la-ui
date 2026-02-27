import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { courseResolver } from "@/lib/schema/course-schema";
import { BookOpen, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useCreateCourse } from "@/features/courses/course-mutations";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useCategories } from "@/features/categories/category-queries";
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormCheckboxField,
  FormSelectField,
  FormChipField,
} from "@/components/form-fields";

interface CreateCourseDialogProps {
  children?: React.ReactNode;
}

export function CreateCourseDialog({ children }: CreateCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const { selectedOrganization } = useOrganizationStore();
  const { data: categoriesData } = useCategories();
  const createCourseMutation = useCreateCourse();

  const categoryOptions = (categoriesData?.data ?? []).map((cat) => ({
    value: String(cat.id),
    label: cat.category_name,
  }));

  const form = useForm({
    resolver: courseResolver,
    defaultValues: {
      organization: selectedOrganization?.id ?? "",
      category: 0,
      title: "",
      overview: "",
      is_premium: false,
      price: 0,
      is_private: false,
      tags: [],
    },
  });

  const isPremium = useWatch({
    control: form.control,
    name: "is_premium",
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    createCourseMutation.mutateAsync(
      {
        ...data,
        organization: selectedOrganization?.id ?? data.organization,
      },
      {
        onSuccess() {
          setOpen(false);
          form.reset();
        },
      }
    );
  });

  const isLoading =
    createCourseMutation.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Create Course
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create New Course
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new course in your workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormTextField
              control={form.control}
              name="title"
              label="Course Title"
              placeholder="Enter course title"
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

            <FormSelectField
              control={form.control}
              name="category"
              label="Category"
              placeholder="Select a category"
              options={categoryOptions}
              required
              disabled={isLoading}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormCheckboxField
                control={form.control}
                name="is_premium"
                label="Premium Course"
                singleCheckbox
                checkboxLabel="This is a premium course"
                disabled={isLoading}
              />

              <FormCheckboxField
                control={form.control}
                name="is_private"
                label="Private Course"
                singleCheckbox
                checkboxLabel="This course is private"
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
              disabled={isLoading}
              description="Add tags to help learners discover this course"
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Course
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
