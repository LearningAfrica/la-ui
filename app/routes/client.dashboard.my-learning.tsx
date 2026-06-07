import { Link, useParams } from "react-router";
import BookOpen from "~icons/lucide/book-open";
import GraduationCap from "~icons/lucide/graduation-cap";
import Layers from "~icons/lucide/layers";
import ArrowRight from "~icons/lucide/arrow-right";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimisticImage } from "@/components/ui/optimistic-image";
import { cn } from "@/lib/utils";
import { createMediaUrl } from "@/lib/api";
import { orgRoutes } from "@/lib/utils/org-routes";
import {
  useMyProgress,
  type CourseWithProgress,
} from "@/features/courses/course-queries";

function EnrolledCourseCard({
  course,
  orgId,
}: {
  course: CourseWithProgress;
  orgId: string;
}) {
  const progress = Math.round(course.course_progress ?? 0);
  const moduleCount = course.modules?.length ?? 0;
  const lessonCount =
    course.modules?.reduce((acc, m) => acc + (m.contents?.length ?? 0), 0) ?? 0;
  const isCompleted = progress === 100;
  const continueTarget = orgRoutes.coursePreview(orgId, course.id);

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted relative aspect-video overflow-hidden">
        {course.course_image ? (
          <OptimisticImage
            src={createMediaUrl(course.course_image)}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
        {isCompleted && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-700">
            Completed
          </Badge>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        {course.category && (
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {course.category.category_name}
          </p>
        )}
        <h3 className="line-clamp-2 font-semibold">{course.title}</h3>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isCompleted ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-3 text-xs font-medium">
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

        <Button
          asChild
          className="w-full"
          variant={isCompleted ? "outline" : "default"}
        >
          <Link to={continueTarget}>
            {isCompleted
              ? "Review course"
              : progress > 0
                ? "Continue"
                : "Start course"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ClientDashboardMyLearning() {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const { data, isLoading } = useMyProgress({ page: 1, pageSize: 50 });

  const courses = data?.data ?? [];

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
        <p className="text-muted-foreground mt-1">
          Track your enrolled courses and progress
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-16 text-center text-sm">
              <GraduationCap className="h-10 w-10 opacity-40" />
              <p>You haven&apos;t enrolled in any courses yet.</p>
              <Button asChild variant="default" className="mt-2">
                <Link to={orgRoutes.courses(orgId)}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse courses
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <EnrolledCourseCard key={c.id} course={c} orgId={orgId} />
          ))}
        </div>
      )}
    </div>
  );
}
