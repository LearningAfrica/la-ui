import { useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Layers,
  FileText,
  Video,
  File,
  ChevronDown,
  ChevronRight,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCourse,
  useCourseMyProgress,
  type CourseMyProgress,
} from "@/features/courses/course-queries";
import { useCourseModules } from "@/features/modules/module-queries";
import { useEnrollCourse } from "@/features/courses/course-mutations";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;

  return `${minutes}m`;
}

function formatLessonDuration(seconds: number | undefined): string {
  if (!seconds || seconds <= 0) return "";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getCompletedSet(progress: CourseMyProgress | undefined): Set<string> {
  if (!progress) return new Set();

  return new Set(
    progress.contents.filter((c) => c.is_completed).map((c) => c.content_id)
  );
}

function ContentRow({
  content,
  courseId,
  isCompleted,
}: {
  content: ModuleContent;
  courseId: string;
  isCompleted: boolean;
}) {
  const typeIcons = { text: FileText, video: Video, file: File };
  const Icon = typeIcons[content.content_type] ?? FileText;
  const duration = formatLessonDuration(content.data.duration_seconds);

  return (
    <Link
      to={`/client/dashboard/courses/${courseId}/lessons/${content.id}`}
      className="hover:bg-muted/40 group flex items-center gap-3 rounded-md px-2 py-3 transition-colors"
    >
      {isCompleted ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="text-muted-foreground/50 h-4 w-4 shrink-0" />
      )}
      <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
      <span
        className={cn(
          "flex-1 truncate text-sm",
          isCompleted && "text-muted-foreground"
        )}
      >
        {content.title}
      </span>
      {duration && (
        <span className="text-muted-foreground font-mono text-xs tabular-nums">
          {duration}
        </span>
      )}
    </Link>
  );
}

function ModuleSection({
  module: mod,
  courseId,
  index,
  defaultExpanded,
  completedSet,
}: {
  module: CourseModuleDetail;
  courseId: string;
  index: number;
  defaultExpanded: boolean;
  completedSet: Set<string>;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const totalSeconds = mod.contents.reduce(
    (acc, c) => acc + (c.data.duration_seconds ?? 0),
    0
  );
  const completed = mod.contents.filter((c) => completedSet.has(c.id)).length;
  const total = mod.contents.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        className="hover:bg-muted/30 flex w-full items-center justify-between gap-4 p-4 text-left transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{mod.title}</h3>
            <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
              <span>
                {total} {total === 1 ? "lesson" : "lessons"}
              </span>
              {totalSeconds > 0 && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{formatDuration(totalSeconds)}</span>
                </>
              )}
              {completed > 0 && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-emerald-600 dark:text-emerald-500">
                    {completed}/{total} done
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <div className="bg-muted hidden h-1.5 w-24 overflow-hidden rounded-full sm:block">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          {expanded ? (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <CardContent className="border-t px-2 pt-2 pb-2">
          {mod.contents.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No content in this module yet.
            </p>
          ) : (
            <div className="divide-y">
              {mod.contents.map((content) => (
                <ContentRow
                  key={content.id}
                  content={content}
                  courseId={courseId}
                  isCompleted={completedSet.has(content.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function CoursePreviewPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: course, isLoading: courseLoading } = useCourse(courseId!);
  const { data: modules, isLoading: modulesLoading } = useCourseModules(
    courseId!
  );
  const { data: progress } = useCourseMyProgress(courseId!);
  const enroll = useEnrollCourse();

  const modulesList = useMemo(() => modules ?? [], [modules]);
  const completedSet = useMemo(() => getCompletedSet(progress), [progress]);

  const totals = useMemo(() => {
    let lessons = 0;
    let seconds = 0;

    for (const mod of modulesList) {
      lessons += mod.contents.length;

      for (const c of mod.contents) {
        seconds += c.data.duration_seconds ?? 0;
      }
    }

    return { lessons, seconds };
  }, [modulesList]);

  // Find the next incomplete lesson — used for resume CTA + smart expand.
  // React Compiler memoizes this automatically; no manual useMemo needed.
  let nextLesson: { moduleIndex: number; contentId: string } | null = null;

  outer: for (let i = 0; i < modulesList.length; i++) {
    for (const content of modulesList[i].contents) {
      if (!completedSet.has(content.id)) {
        nextLesson = { moduleIndex: i, contentId: content.id };
        break outer;
      }
    }
  }

  const hasProgress = (progress?.completed_contents ?? 0) > 0;
  const ctaLabel = hasProgress ? "Resume course" : "Start the course";
  const ctaTo = nextLesson
    ? `/client/dashboard/courses/${courseId}/lessons/${nextLesson.contentId}`
    : modulesList[0]?.contents[0]
      ? `/client/dashboard/courses/${courseId}/lessons/${modulesList[0].contents[0].id}`
      : null;

  if (courseLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6">
      <Link to="/client/dashboard/courses">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border">
        {course.course_image_url && (
          <div className="absolute inset-0 -z-10">
            <img
              src={course.course_image_url}
              alt=""
              className="h-full w-full mask-b-from-30% mask-b-to-90% object-cover object-center opacity-30 dark:opacity-20"
            />
            <div className="from-background/40 via-background/80 to-background absolute inset-0 bg-gradient-to-b" />
          </div>
        )}
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap gap-2">
              {course.category && (
                <Badge variant="secondary">
                  {course.category.category_name}
                </Badge>
              )}
              <Badge variant={course.is_premium ? "default" : "outline"}>
                {course.is_premium ? "Premium" : "Free"}
              </Badge>
              {course.is_private && <Badge variant="outline">Private</Badge>}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>

            {course.overview && (
              <p className="text-muted-foreground max-w-2xl text-base text-pretty sm:text-lg">
                {course.overview}
              </p>
            )}

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                <span>
                  {modulesList.length}{" "}
                  {modulesList.length === 1 ? "module" : "modules"}
                </span>
              </div>
              <span className="text-muted-foreground/40">·</span>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>
                  {totals.lessons} {totals.lessons === 1 ? "lesson" : "lessons"}
                </span>
              </div>
              {totals.seconds > 0 && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(totals.seconds)}</span>
                  </div>
                </>
              )}
            </div>

            {hasProgress && progress && (
              <div className="max-w-md space-y-1.5">
                <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
                  <span>Your progress</span>
                  <span>
                    {progress.completed_contents}/{progress.total_contents}{" "}
                    lessons · {progress.progress_percent}%
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${progress.progress_percent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {ctaTo ? (
                <Button asChild size="lg">
                  <Link to={ctaTo}>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    {ctaLabel}
                  </Link>
                </Button>
              ) : (
                <Button size="lg" disabled>
                  <PlayCircle className="mr-2 h-5 w-5" />
                  No lessons yet
                </Button>
              )}
              {!hasProgress && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => enroll.mutate(courseId!)}
                  disabled={enroll.isPending}
                >
                  {enroll.isPending ? "Enrolling..." : "Enroll"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Course Content</h2>
        {modulesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : modulesList.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Layers className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No modules have been added to this course yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {modulesList.map((mod, i) => (
              <ModuleSection
                key={mod.id}
                module={mod}
                courseId={courseId!}
                index={i}
                defaultExpanded={
                  nextLesson ? nextLesson.moduleIndex === i : i === 0
                }
                completedSet={completedSet}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
