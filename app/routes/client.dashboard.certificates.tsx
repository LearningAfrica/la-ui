import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Award from "~icons/lucide/award";
import Download from "~icons/lucide/download";
import CheckCircle2 from "~icons/lucide/check-circle-2";
import { cn } from "@/lib/utils";
import {
  useCourses,
  useCourseMyProgress,
} from "@/features/courses/course-queries";
import type { Course } from "@/features/courses/course-queries";
import { useGenerateCertificate } from "@/features/courses/course-mutations";

function CertificateCourseCard({ course }: { course: Course }) {
  const { data: progress, isLoading } = useCourseMyProgress(course.id);
  const generateCertificate = useGenerateCertificate();

  const progressPercent = Math.round(progress?.course_progress ?? 0);
  const isCompleted = progressPercent === 100;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(!isCompleted && "opacity-60")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Award
            className={cn(
              "h-5 w-5 shrink-0",
              isCompleted ? "text-amber-500" : "text-muted-foreground"
            )}
          />
          <span className="truncate">{course.title}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Progress</span>
            <span className="tabular-nums">{progressPercent}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isCompleted ? "bg-emerald-500" : "bg-primary/60"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Status badge */}
        {isCompleted ? (
          <Badge
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        ) : (
          <Badge variant="secondary">{progressPercent}% complete</Badge>
        )}
      </CardContent>

      {isCompleted && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => generateCertificate.mutate(course.id)}
            disabled={generateCertificate.isPending}
          >
            <Download className="mr-2 h-4 w-4" />
            {generateCertificate.isPending
              ? "Generating..."
              : "Generate Certificate"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function ClientDashboardCertificates() {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const { data: coursesData, isLoading } = useCourses({
    page: 1,
    pageSize: 100,
  });

  const courses = coursesData?.data ?? [];

  // Suppress unused variable lint — orgId is needed if we add navigation later
  void orgId;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          View and download your earned certificates
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-12 text-sm">
              <Award className="h-10 w-10 opacity-40" />
              <p>
                No courses found. Enroll in courses to start earning
                certificates.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CertificateCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
