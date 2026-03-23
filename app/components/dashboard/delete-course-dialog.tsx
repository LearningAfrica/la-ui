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
import { useDeleteCourse } from "@/features/courses/course-mutations";
import type { Course } from "@/features/courses/course-queries";
import { Loader2 } from "lucide-react";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "delete-course": Course;
  }
}

export function DeleteCourseDialog() {
  const modal = useAppModal("delete-course");
  const course = modal.data as Course | null;
  const deleteMutation = useDeleteCourse();

  const handleDelete = () => {
    if (!course) return;

    deleteMutation.mutateAsync(course.id, {
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
          <AlertDialogTitle>Delete Course</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>&quot;{course?.title}&quot;</strong>? This action cannot be
            undone. All modules and content associated with this course will be
            permanently removed.
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
