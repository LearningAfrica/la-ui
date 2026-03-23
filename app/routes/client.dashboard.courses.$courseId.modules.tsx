import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Layers,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useCourseModules } from "@/features/modules/module-queries";
import { useModuleContents } from "@/features/module-contents/module-content-queries";
import { useCourse } from "@/features/courses/course-queries";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import { CourseModulesTable } from "@/components/dashboard/course-modules-table";
import { ModuleContentsTable } from "@/components/dashboard/module-contents-table";
import { CreateModuleDialog } from "@/components/dashboard/create-module-dialog";
import { CreateModuleContentDialog } from "@/components/dashboard/create-module-content-dialog";

export default function ClientDashboardCourseModules() {
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedModule, setSelectedModule] =
    useState<CourseModuleDetail | null>(null);
  const [contentsPage, setContentsPage] = useState(1);

  const { data: course } = useCourse(courseId!);

  const {
    data: modules,
    isLoading,
    isFetching,
    refetch,
  } = useCourseModules(courseId!);

  const {
    data: contentsData,
    isLoading: contentsLoading,
    isFetching: contentsFetching,
    refetch: refetchContents,
  } = useModuleContents(courseId!, selectedModule?.id ?? "", contentsPage);

  const modulesList = useMemo(() => modules ?? [], [modules]);

  const contents = useMemo(
    () => contentsData?.data ?? [],
    [contentsData?.data]
  );

  const contentsTotalPages = contentsData?.meta?.total_pages || 1;
  const contentsHasNext = contentsData?.meta?.has_next_page || false;
  const contentsHasPrev = contentsData?.meta?.has_prev_page || false;

  const handleViewContents = useCallback((mod: CourseModuleDetail) => {
    setSelectedModule(mod);
    setContentsPage(1);
  }, []);

  const handleBackToModules = useCallback(() => {
    setSelectedModule(null);
    setContentsPage(1);
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Link to="/client/dashboard/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Courses
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {course?.title ?? "Course"} — Modules
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedModule
              ? `Contents of "${selectedModule.title}"`
              : "Manage modules and their contents"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <div className="rounded-lg bg-blue-600/10 p-2">
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{modulesList.length}</div>
            )}
          </CardContent>
        </Card>
        {selectedModule && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contents in "{selectedModule.title}"
              </CardTitle>
              <div className="rounded-lg bg-purple-600/10 p-2">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              {contentsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {contentsData?.meta?.total_docs ?? 0}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Table */}
      {selectedModule ? (
        <Card>
          <CardHeader>
            <CardTitle>Contents — {selectedModule.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {contentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <ModuleContentsTable
                  contents={contents}
                  coursePk={courseId!}
                  modulePk={selectedModule.id}
                  onRefresh={() => refetchContents()}
                  isFetching={contentsFetching}
                  toolbarActions={
                    <>
                      <CreateModuleContentDialog
                        coursePk={courseId!}
                        modulePk={selectedModule.id}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackToModules}
                      >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Modules
                      </Button>
                    </>
                  }
                />

                {contents.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">
                      Page {contentsPage} of {contentsTotalPages} •{" "}
                      {contentsData?.meta?.total_docs} total contents
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setContentsPage((p) => Math.max(1, p - 1))
                        }
                        disabled={!contentsHasPrev}
                      >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setContentsPage((p) => p + 1)}
                        disabled={!contentsHasNext}
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <CourseModulesTable
                modules={modulesList}
                coursePk={courseId!}
                onViewContents={handleViewContents}
                onRefresh={() => refetch()}
                isFetching={isFetching}
                toolbarActions={<CreateModuleDialog coursePk={courseId!} />}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
