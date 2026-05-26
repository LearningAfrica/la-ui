import { Link, useParams } from "react-router";
import ArrowLeft from "~icons/lucide/arrow-left";
import BookOpen from "~icons/lucide/book-open";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/dashboard/course-form";
import { orgRoutes } from "@/lib/utils/org-routes";

export default function NewCoursePage() {
  const { orgId = "" } = useParams<{ orgId: string }>();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <Link to={orgRoutes.courses(orgId)}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Courses
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl font-bold sm:text-3xl">Create New Course</h1>
        </div>
        <p className="text-muted-foreground">
          Fill in the details to create a new course in your workspace.
        </p>
      </div>
      <CourseForm />
    </div>
  );
}
