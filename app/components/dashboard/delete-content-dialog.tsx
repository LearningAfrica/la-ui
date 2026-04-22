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
import { useDeleteModuleContent } from "@/features/module-contents/module-content-mutations";
import { Loader2 } from "lucide-react";

export interface DeleteContentData {
  coursePk: string;
  modulePk: string;
  id: string;
  title: string;
}

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "delete-content": DeleteContentData;
  }
}

export function DeleteContentDialog() {
  const modal = useAppModal("delete-content");
  const target = modal.data as DeleteContentData | null;
  const deleteMutation = useDeleteModuleContent();

  const handleDelete = () => {
    if (!target) return;

    deleteMutation.mutateAsync(
      {
        coursePk: target.coursePk,
        modulePk: target.modulePk,
        id: target.id,
        title: target.title,
      },
      { onSuccess: () => modal.close() }
    );
  };

  const isLoading = deleteMutation.isPending;

  return (
    <AlertDialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v && !isLoading) modal.close();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Content</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>&quot;{target?.title}&quot;</strong>? This action cannot be
            undone.
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
