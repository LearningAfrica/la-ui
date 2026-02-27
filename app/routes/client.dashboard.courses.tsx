import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Crown,
  Globe,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useCourses } from "@/features/courses/course-queries";
import { AdminCoursesTable } from "@/components/dashboard/admin-courses-table";
import { CreateCourseDialog } from "@/components/dashboard/create-course-dialog";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";

export default function ClientDashboardCourses() {
  const [page, setPage] = useState(1);
  const { selectedOrganization } = useOrganizationStore();
  const isInstructor = selectedOrganization?.role === "instructor";
  const {
    data: coursesData,
    isLoading,
    isFetching,
    refetch,
  } = useCourses(page);

  const courses = useMemo(() => coursesData?.data ?? [], [coursesData?.data]);

  const stats = useMemo(() => {
    if (!coursesData?.meta) {
      return { total: 0, premium: 0, free: 0 };
    }

    const premium = courses.filter((c) => c.is_premium).length;
    const free = courses.filter((c) => !c.is_premium).length;

    return { total: coursesData.meta.total_docs, premium, free };
  }, [courses, coursesData]);

  const totalPages = coursesData?.meta?.total_pages || 1;
  const hasNext = coursesData?.meta?.has_next_page || false;
  const hasPrev = coursesData?.meta?.has_prev_page || false;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">
            {isInstructor
              ? "Create and manage courses in your workspace"
              : "Browse and oversee courses in your workspace"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isInstructor && <CreateCourseDialog />}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <div className="rounded-lg bg-amber-600/10 p-2">
              <Crown className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.premium}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free</CardTitle>
            <div className="rounded-lg bg-green-600/10 p-2">
              <Globe className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.free}</div>
            )}
          </CardContent>
        </Card>
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
          ) : (
            <>
              <AdminCoursesTable courses={courses} />

              {/* Pagination */}
              {courses.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-muted-foreground text-sm">
                    Page {page} of {totalPages} •{" "}
                    {coursesData?.meta?.total_docs} total courses
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!hasPrev}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
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
