import { Link, useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Award from "~icons/lucide/award";
import { orgRoutes } from "@/lib/utils/org-routes";
import { useAppModal } from "@/stores/filters/modal-hooks";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "course-completed": { courseId: string; courseTitle?: string };
  }
}

export function CourseCompletedDialog() {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const modal = useAppModal("course-completed");

  return (
    <Dialog open={modal.isOpen} onOpenChange={(v) => !v && modal.close()}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
            <Award className="h-7 w-7 text-amber-500" />
          </div>
          <DialogTitle>Course complete!</DialogTitle>
          <DialogDescription>
            {modal.data?.courseTitle
              ? `You finished “${modal.data.courseTitle}”. Your certificate is ready.`
              : "You finished the course. Your certificate is ready."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" onClick={() => modal.close()}>
            Keep learning
          </Button>
          <Button asChild onClick={() => modal.close()}>
            <Link to={orgRoutes.certificates(orgId)}>View certificate</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
