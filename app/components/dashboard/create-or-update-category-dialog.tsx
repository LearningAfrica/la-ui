import { useForm } from "react-hook-form";
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
import {
  type CategoryFormData,
  categoryResolver,
} from "@/lib/schema/category-schema";
import { FolderOpen, Loader2 } from "lucide-react";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/category-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import {
  FormTextField,
  FormTextareaField,
  FormImageUploadField,
} from "@/components/form-fields";
import type { Category } from "@/features/categories/category-queries";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-category": undefined;
    "edit-category": Category;
  }
}

export function CreateOrUpdateCategoryDialog() {
  const createModal = useAppModal("create-category");
  const editModal = useAppModal("edit-category");

  const isEditing = editModal.isOpen;
  const isOpen = createModal.isOpen || editModal.isOpen;
  const category = editModal.data as Category | null;

  const { selectedOrganization } = useOrganizationStore();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const form = useForm<CategoryFormData>({
    resolver: categoryResolver,
    defaultValues: {
      organization: selectedOrganization?.id ?? "",
      category_name: "",
      description: "",
      category_image: undefined,
    },
  });

  const onDialogOpened = useEffectEvent((entity: Category | null) => {
    if (!entity) return;

    form.reset({
      organization: selectedOrganization?.id ?? "",
      category_name: entity.category_name,
      description: entity.description,
      category_image: undefined,
    });
  });

  useEffect(() => {
    if (isOpen && isEditing) {
      onDialogOpened(category);
    }
  }, [isOpen, isEditing, category]);

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
          { id: category!.id, data: payload },
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category details."
              : "Add a new category to organize your courses and materials."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormImageUploadField
              control={form.control}
              name="category_image"
              label="Category Image"
              disabled={isLoading}
            />

            <FormTextField
              control={form.control}
              name="category_name"
              label="Category Name"
              placeholder="Enter category name"
              required
              disabled={isLoading}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe this category..."
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
                {isEditing ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
