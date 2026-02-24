import { useForm } from "react-hook-form";
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
import {
  type CategoryFormData,
  categoryResolver,
} from "@/lib/schema/category-schema";
import { FolderOpen, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useCreateCategory } from "@/features/categories/category-mutations";
import { useOrganizationStore } from "@/stores/organization/organization-store";
import { FormTextField, FormTextareaField } from "@/components/form-fields";

interface CreateCategoryDialogProps {
  children?: React.ReactNode;
}

export function CreateCategoryDialog({ children }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { selectedOrganization } = useOrganizationStore();
  const createCategoryMutation = useCreateCategory();

  const form = useForm<CategoryFormData>({
    resolver: categoryResolver,
    defaultValues: {
      organization: selectedOrganization?.id ?? "",
      category_name: "",
      description: "",
    },
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    createCategoryMutation.mutateAsync(
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
    createCategoryMutation.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Create Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Add a new category to organize your courses and materials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
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
                Create Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
