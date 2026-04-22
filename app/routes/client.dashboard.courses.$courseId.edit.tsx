import { Link, useParams } from "react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseForm } from "@/components/dashboard/course-form";
import { useCourse } from "@/features/courses/course-queries";

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId!);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <Link to="/client/dashboard/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Courses
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl font-bold sm:text-3xl">Edit Course</h1>
        </div>
        <p className="text-muted-foreground">Update the course details.</p>
      </div>

      {isLoading || !course ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <CourseForm course={course} />
      )}
    </div>
  );
}
