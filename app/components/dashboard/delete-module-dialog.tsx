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
import { useDeleteModule } from "@/features/modules/module-mutations";
import { Loader2 } from "lucide-react";

export interface DeleteModuleData {
  coursePk: string;
  id: string;
  title: string;
}

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "delete-module": DeleteModuleData;
  }
}

export function DeleteModuleDialog() {
  const modal = useAppModal("delete-module");
  const target = modal.data as DeleteModuleData | null;
  const deleteMutation = useDeleteModule();

  const handleDelete = () => {
    if (!target) return;

    deleteMutation.mutateAsync(
      { coursePk: target.coursePk, id: target.id, title: target.title },
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
          <AlertDialogTitle>Delete Module</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>&quot;{target?.title}&quot;</strong>? All contents and
            quizzes in this module will be permanently removed. This action
            cannot be undone.
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
