import { useMemo, useCallback } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers,
  FileText,
  ArrowLeft,
  Plus,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { useCourseModules } from "@/features/modules/module-queries";
import { useModuleContents } from "@/features/module-contents/module-content-queries";
import { useQuizzes } from "@/features/quizzes/quiz-queries";
import { useCourse } from "@/features/courses/course-queries";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import { CourseModulesTable } from "@/components/dashboard/course-modules-table";
import { ModuleContentsTable } from "@/components/dashboard/module-contents-table";
import { QuizzesTable } from "@/components/dashboard/quizzes-table";
import { CreateOrUpdateModuleDialog } from "@/components/dashboard/create-or-update-module-dialog";
import { GenerateAiQuizDialog } from "@/components/dashboard/generate-ai-quiz-dialog";
import { ViewContentDialog } from "@/components/dashboard/view-content-dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";

export default function ClientDashboardCourseModules() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModuleId = searchParams.get("moduleId");
  const activeTab =
    searchParams.get("tab") === "quizzes" ? "quizzes" : "contents";

  const { data: course } = useCourse(courseId!);
  const createModuleModal = useAppModal("create-or-update-module");
  const generateAiQuizModal = useAppModal("generate-ai-quiz");

  const {
    data: modules,
    isLoading,
    isFetching,
    refetch,
  } = useCourseModules(courseId!);

  const modulesList = useMemo(() => modules?.data ?? [], [modules]);

  const selectedModule = useMemo<CourseModuleDetail | null>(
    () =>
      activeModuleId
        ? (modulesList.find((m) => m.id === activeModuleId) ?? null)
        : null,
    [activeModuleId, modulesList]
  );

  const {
    data: contents,
    isLoading: contentsLoading,
    isFetching: contentsFetching,
    refetch: refetchContents,
  } = useModuleContents(courseId!, selectedModule?.id ?? "");

  const {
    data: quizzes,
    isFetching: quizzesFetching,
    refetch: refetchQuizzes,
  } = useQuizzes(courseId!, selectedModule?.id ?? "");

  const contentsList = useMemo(() => contents ?? [], [contents]);
  const quizzesList = useMemo(() => quizzes ?? [], [quizzes]);

  const handleViewContents = useCallback(
    (mod: CourseModuleDetail) => {
      setSearchParams({ moduleId: mod.id, tab: "contents" });
    },
    [setSearchParams]
  );

  const handleBackToModules = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!activeModuleId) return;

      setSearchParams({ moduleId: activeModuleId, tab });
    },
    [activeModuleId, setSearchParams]
  );

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
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <CardTitle>{selectedModule.title}</CardTitle>
            <Button variant="outline" size="sm" onClick={handleBackToModules}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Modules
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="contents">
                  <FileText className="mr-2 h-4 w-4" />
                  Contents
                  <span className="bg-muted text-muted-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                    {contentsList.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="quizzes">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Quizzes
                  <span className="bg-muted text-muted-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                    {quizzesList.length}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contents">
                {contentsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <ModuleContentsTable
                    contents={contentsList}
                    coursePk={courseId!}
                    modulePk={selectedModule.id}
                    onRefresh={() => refetchContents()}
                    isFetching={contentsFetching}
                    toolbarActions={
                      <Button asChild size="sm">
                        <Link
                          to={`/client/dashboard/courses/${courseId}/modules/${selectedModule.id}/contents/new`}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Content
                        </Link>
                      </Button>
                    }
                  />
                )}
              </TabsContent>

              <TabsContent value="quizzes">
                <QuizzesTable
                  quizzes={quizzesList}
                  coursePk={courseId!}
                  modulePk={selectedModule.id}
                  onRefresh={() => refetchQuizzes()}
                  isFetching={quizzesFetching}
                  toolbarActions={
                    <>
                      <Button asChild size="sm">
                        <Link
                          to={`/client/dashboard/courses/${courseId}/modules/${selectedModule.id}/quizzes/new`}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          New Quiz
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateAiQuizModal.open(undefined)}
                      >
                        <Sparkles className="mr-1 h-4 w-4 text-amber-500" />
                        Generate with AI
                      </Button>
                    </>
                  }
                />
              </TabsContent>
            </Tabs>
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
        <GenerateAiQuizDialog
          coursePk={courseId!}
          modulePk={selectedModule.id}
        />
      )}
      <ViewContentDialog />
    </div>
  );
}
