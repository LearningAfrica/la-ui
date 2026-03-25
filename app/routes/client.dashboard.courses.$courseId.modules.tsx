import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Layers, FileText, ArrowLeft, Plus } from "lucide-react";
import { useCourseModules } from "@/features/modules/module-queries";
import { useModuleContents } from "@/features/module-contents/module-content-queries";
import { useCourse } from "@/features/courses/course-queries";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import { CourseModulesTable } from "@/components/dashboard/course-modules-table";
import { ModuleContentsTable } from "@/components/dashboard/module-contents-table";
import { CreateOrUpdateModuleDialog } from "@/components/dashboard/create-or-update-module-dialog";
import { CreateOrUpdateContentDialog } from "@/components/dashboard/create-or-update-content-dialog";
import { ViewContentDialog } from "@/components/dashboard/view-content-dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";

export default function ClientDashboardCourseModules() {
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedModule, setSelectedModule] =
    useState<CourseModuleDetail | null>(null);

  const { data: course } = useCourse(courseId!);
  const createModuleModal = useAppModal("create-or-update-module");
  const createContentModal = useAppModal("create-or-update-content");

  const {
    data: modules,
    isLoading,
    isFetching,
    refetch,
  } = useCourseModules(courseId!);

  const {
    data: contents,
    isLoading: contentsLoading,
    isFetching: contentsFetching,
    refetch: refetchContents,
  } = useModuleContents(courseId!, selectedModule?.id ?? "");

  const modulesList = useMemo(() => modules ?? [], [modules]);
  const contentsList = useMemo(() => contents ?? [], [contents]);

  const handleViewContents = useCallback((mod: CourseModuleDetail) => {
    setSelectedModule(mod);
  }, []);

  const handleBackToModules = useCallback(() => {
    setSelectedModule(null);
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
                Contents in &ldquo;{selectedModule.title}&rdquo;
              </CardTitle>
              <div className="rounded-lg bg-purple-600/10 p-2">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              {contentsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{contentsList.length}</div>
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
                  contents={contentsList}
                  coursePk={courseId!}
                  modulePk={selectedModule.id}
                  onRefresh={() => refetchContents()}
                  isFetching={contentsFetching}
                  toolbarActions={
                    <>
                      <Button
                        size="sm"
                        onClick={() => createContentModal.open(undefined)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Content
                      </Button>
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
                toolbarActions={
                  <Button
                    size="sm"
                    onClick={() => createModuleModal.open(undefined)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Module
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateOrUpdateModuleDialog coursePk={courseId!} />
      {selectedModule && (
        <CreateOrUpdateContentDialog
          coursePk={courseId!}
          modulePk={selectedModule.id}
        />
      )}
      <ViewContentDialog />
    </div>
  );
}
