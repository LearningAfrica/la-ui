import { useMemo, useState } from "react";
import { Link } from "react-router";
import { BookOpen, Layers, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useCourses, type Course } from "@/features/courses/course-queries";
import { createMediaUrl } from "@/lib/api";

function CourseCard({ course }: { course: Course }) {
  const moduleCount = course.modules?.length ?? 0;
  const lessonCount =
    course.modules?.reduce((acc, m) => acc + (m.contents?.length ?? 0), 0) ?? 0;

  return (
    <Link
      to={`/client/dashboard/courses/${course.id}/preview`}
      className="group block"
    >
      <Card className="hover:border-primary/50 h-full overflow-hidden transition-colors">
        <div className="bg-muted relative aspect-video overflow-hidden">
          {course.course_image ? (
            <img
              src={createMediaUrl(course.course_image)}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <BookOpen className="h-10 w-10" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant={course.is_premium ? "default" : "secondary"}>
              {course.is_premium ? "Premium" : "Free"}
            </Badge>
            {course.is_private && <Badge variant="outline">Private</Badge>}
          </div>
        </div>
        <div className="space-y-3 p-4">
          {course.category && (
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              {course.category.category_name}
            </p>
          )}
          <h3 className="group-hover:text-primary line-clamp-2 font-semibold transition-colors">
            {course.title}
          </h3>
          {course.overview && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {course.overview}
            </p>
          )}
          <div className="text-muted-foreground flex items-center gap-3 pt-1 text-xs font-medium">
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              <span>
                {moduleCount} {moduleCount === 1 ? "module" : "modules"}
              </span>
            </div>
            <span className="text-muted-foreground/40">·</span>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>
                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function ClientDashboardMyCourses() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCourses({
    page: 1,
    search: search || undefined,
  });

  const courses = useMemo(() => data?.data ?? [], [data?.data]);

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Browse courses available in your organization
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card className="py-16 text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-sm">
            {search
              ? `No courses match "${search}"`
              : "No courses available yet."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
