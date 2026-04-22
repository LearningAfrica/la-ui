import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Crown,
  Layers,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses } from "@/features/courses/course-queries";
import { AdminCoursesTable } from "@/components/dashboard/admin-courses-table";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useTableFilters } from "@/stores/filters/use-table-filters";

type StatTone = "blue" | "amber" | "violet" | "emerald";

const TONE_CLASSES: Record<StatTone, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  isLoading,
  hint,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: StatTone;
  isLoading?: boolean;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
        <div className={cn("rounded-lg p-2", TONE_CLASSES[tone])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <>
            <div className="text-2xl font-bold tabular-nums">{value}</div>
            {hint && (
              <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function ClientDashboardCourses() {
  const { state, setPage, setLimit } = useTableFilters("courses");
  const page = state.page;
  const pageSize = state.limit;
  const { selectedOrganization } = useOrganizationStore();
  const isInstructor = selectedOrganization?.role === "instructor";
  const {
    data: coursesData,
    isLoading,
    isFetching,
    refetch,
  } = useCourses({ page, pageSize });

  const courses = useMemo(() => coursesData?.data ?? [], [coursesData?.data]);

  const stats = useMemo(() => {
    const premium = courses.filter((c) => c.is_premium).length;
    let modules = 0;
    let lessons = 0;

    for (const course of courses) {
      modules += course.modules?.length ?? 0;

      for (const mod of course.modules ?? []) {
        lessons += mod.contents?.length ?? 0;
      }
    }

    return {
      total: coursesData?.meta?.total_docs ?? 0,
      premium,
      modules,
      lessons,
    };
  }, [courses, coursesData]);

  const totalPages = coursesData?.meta?.total_pages || 1;
  const hasNext = coursesData?.meta?.has_next_page || false;
  const hasPrev = coursesData?.meta?.has_prev_page || false;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground mt-1">
          {isInstructor
            ? "Create and manage courses in your workspace"
            : "Browse and oversee courses in your workspace"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Courses"
          value={stats.total}
          icon={GraduationCap}
          tone="blue"
          isLoading={isLoading}
        />
        <StatCard
          label="Premium"
          value={stats.premium}
          icon={Crown}
          tone="amber"
          isLoading={isLoading}
          hint={`of ${courses.length} on this page`}
        />
        <StatCard
          label="Modules"
          value={stats.modules}
          icon={Layers}
          tone="violet"
          isLoading={isLoading}
          hint="across loaded courses"
        />
        <StatCard
          label="Lessons"
          value={stats.lessons}
          icon={BookOpen}
          tone="emerald"
          isLoading={isLoading}
          hint="across loaded courses"
        />
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="border-border/60 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
              <div className="bg-primary/10 text-primary rounded-full p-3">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">No courses yet</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  {isInstructor
                    ? "Create your first course to start adding modules and lessons for your learners."
                    : "Courses created in this organization will appear here."}
                </p>
              </div>
              {isInstructor && (
                <Button asChild className="mt-2">
                  <Link to="/client/dashboard/courses/new">
                    <Plus className="mr-1 h-4 w-4" />
                    Create your first course
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              <AdminCoursesTable
                courses={courses}
                onRefresh={() => refetch()}
                isFetching={isFetching}
                toolbarActions={
                  isInstructor ? (
                    <Button asChild size="sm">
                      <Link to="/client/dashboard/courses/new">
                        <Plus className="mr-1 h-4 w-4" />
                        Create Course
                      </Link>
                    </Button>
                  ) : undefined
                }
              />

              {/* Pagination */}
              {courses.length > 0 && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-muted-foreground text-sm">
                    Page {page} of {totalPages} •{" "}
                    {coursesData?.meta?.total_docs} total courses
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => setLimit(Number(value))}
                    >
                      <SelectTrigger className="h-8 w-[90px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20, 50].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} / page
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={!hasNext}
                    >
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
