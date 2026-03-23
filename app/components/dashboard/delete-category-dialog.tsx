import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { useDeleteCategory } from "@/features/categories/category-mutations";
import type { Category } from "@/features/categories/category-queries";
import { Loader2 } from "lucide-react";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "delete-category": Category;
  }
}

export function DeleteCategoryDialog() {
  const modal = useAppModal("delete-category");
  const category = modal.data as Category | null;
  const deleteMutation = useDeleteCategory();

  const handleDelete = () => {
    if (!category) return;

    deleteMutation.mutateAsync(category.id, {
      onSuccess() {
        modal.close();
      },
    });
  };

  const isLoading = deleteMutation.status === "pending";

  return (
    <AlertDialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v && !isLoading) modal.close();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>"{category?.category_name}"</strong>? This action cannot be
            undone. All courses associated with this category may be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
