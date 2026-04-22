import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAppModal } from "@/stores/filters/modal-hooks";
import type { Course } from "@/features/courses/course-queries";
import { createMediaUrl } from "@/lib/api";
import { ImageIcon } from "lucide-react";
import moment from "moment";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "view-course": Course;
  }
}

export function ViewCourseDialog() {
  const modal = useAppModal("view-course");
  const course = modal.data as Course | null;

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Course Details</DialogTitle>
          <DialogDescription>
            Viewing details for this course.
          </DialogDescription>
        </DialogHeader>

        {course && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {course.course_image ? (
                <img
                  src={createMediaUrl(course.course_image)}
                  alt={course.title}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-lg">
                  <ImageIcon className="text-muted-foreground h-8 w-8" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {course.category?.category_name ?? "Uncategorized"}
                </p>
                <div className="mt-1 flex gap-2">
                  <Badge variant={course.is_premium ? "default" : "secondary"}>
                    {course.is_premium ? "Premium" : "Free"}
                  </Badge>
                  <Badge variant={course.is_private ? "outline" : "secondary"}>
                    {course.is_private ? "Private" : "Public"}
                  </Badge>
                </div>
              </div>
            </div>

            {course.is_premium && (
              <div>
                <h4 className="text-sm font-medium">Price</h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  ${course.price}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium">Overview</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                {course.overview || "No overview provided."}
              </p>
            </div>

            {course.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium">Tags</h4>
                <div className="mt-1 flex flex-wrap gap-1">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium">Instructor</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                {course.instructor?.first_name} {course.instructor?.last_name} (
                {course.instructor?.email})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="font-medium">
                  {moment(course.created_at).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Modules</span>
                <p className="font-medium">{course.modules?.length ?? 0}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
