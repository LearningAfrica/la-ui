import { useForm, useWatch } from "react-hook-form";
import { useEffect, useEffectEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { courseResolver } from "@/lib/schema/course-schema";
import { BookOpen, Loader2 } from "lucide-react";
import {
  useCreateCourse,
  useUpdateCourse,
} from "@/features/courses/course-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useCategories } from "@/features/categories/category-queries";
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormCheckboxField,
  FormChipField,
  FormAsyncSelectField,
  FormImageUploadField,
} from "@/components/form-fields";
import type { Course } from "@/features/courses/course-queries";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-course": undefined;
    "edit-course": Course;
  }
}

export function CreateOrUpdateCourseDialog() {
  const createModal = useAppModal("create-course");
  const editModal = useAppModal("edit-course");

  const isEditing = editModal.isOpen;
  const isOpen = createModal.isOpen || editModal.isOpen;
  const course = editModal.data as Course | null;

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
    defaultValues: {
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

  const isPremium = useWatch({
    control: form.control,
    name: "is_premium",
  });

  const onDialogOpened = useEffectEvent((entity: Course | null) => {
    if (!entity) return;

    form.reset({
      organization: selectedOrganization?.id ?? "",
      category: entity.category?.id ?? "",
      title: entity.title,
      overview: entity.overview,
      is_premium: entity.is_premium,
      price: entity.price,
      is_private: entity.is_private,
      tags: entity.tags,
      course_image: undefined,
    });
  });

  useEffect(() => {
    if (isOpen && isEditing) {
      onDialogOpened(course);
    }
  }, [isOpen, isEditing, course]);

  const closeDialog = () => {
    if (isEditing) editModal.close();
    else createModal.close();

    form.reset();
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    const payload = {
      ...data,
      organization: selectedOrganization?.id ?? data.organization,
    };

    const mutation = isEditing
      ? updateMutation.mutateAsync(
          { id: course!.id, data: payload },
          { onSuccess: closeDialog }
        )
      : createMutation.mutateAsync(payload, { onSuccess: closeDialog });

    return mutation;
  });

  const isLoading =
    createMutation.status === "pending" ||
    updateMutation.status === "pending" ||
    form.formState.isSubmitting;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) closeDialog();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {isEditing ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the course details."
              : "Fill in the details to create a new course in your workspace."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
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
      </DialogContent>
    </Dialog>
  );
}
