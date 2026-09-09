import { useMemo, useState } from "react";
import { useParams, Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import ArrowLeft from "~icons/lucide/arrow-left";
import Layers from "~icons/lucide/layers";
import FileText from "~icons/lucide/file-text";
import Video from "~icons/lucide/video";
import File from "~icons/lucide/file";
import ChevronDown from "~icons/lucide/chevron-down";
import ChevronRight from "~icons/lucide/chevron-right";
import Clock from "~icons/lucide/clock";
import BookOpen from "~icons/lucide/book-open";
import CheckCircle2 from "~icons/lucide/check-circle-2";
import Circle from "~icons/lucide/circle";
import PlayCircle from "~icons/lucide/play-circle";
import Award from "~icons/lucide/award";
import Sparkles from "~icons/lucide/sparkles";
import ListChecks from "~icons/lucide/list-checks";
import { cn } from "@/lib/utils";
import { createMediaUrl } from "@/lib/api";
import {
  useCourse,
  useCourseMyProgress,
  isLearnerEnrolled,
  type CourseMyProgress,
} from "@/features/courses/course-queries";
import { useCourseModules } from "@/features/modules/module-queries";
import { useEnrollCourse } from "@/features/courses/course-mutations";
import type { CourseModuleDetail } from "@/features/modules/module-queries";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import type { Quiz } from "@/features/quizzes/quiz-queries";
import { orgRoutes } from "@/lib/utils/org-routes";

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
  if (!progress?.modules) return new Set();

  const ids: string[] = [];

  for (const mod of progress.modules) {
    for (const content of mod.contents ?? []) {
      if (content.is_completed) ids.push(content.id);
    }
  }

  return new Set(ids);
}

function ContentRow({
  content,
  orgId,
  courseId,
  isCompleted,
}: {
  content: ModuleContent;
  orgId: string;
  courseId: string;
  isCompleted: boolean;
}) {
  const typeIcons = {
    text: FileText,
    video: Video,
    file: File,
    interactive: Sparkles,
  };
  const Icon = typeIcons[content.content_type] ?? FileText;
  const duration = formatLessonDuration(content.data.duration_seconds);

  return (
    <Link
      to={orgRoutes.lesson(orgId, courseId, content.id)}
      className="hover:bg-la-cream group flex items-center gap-3 rounded-md px-2 py-3 transition-colors"
    >
      {isCompleted ? (
        <CheckCircle2 className="text-la-ok h-4 w-4 shrink-0" />
      ) : (
        <Circle className="text-la-muted h-4 w-4 shrink-0" />
      )}
      <Icon className="text-la-muted h-4 w-4 shrink-0" />
      <span
        className={cn(
          "text-la-ink flex-1 truncate text-sm",
          isCompleted && "text-la-muted"
        )}
      >
        {content.title}
      </span>
      {duration && (
        <span className="text-la-muted font-mono text-xs tabular-nums">
          {duration}
        </span>
      )}
    </Link>
  );
}

function QuizRow({
  quiz,
  moduleId,
  orgId,
  courseId,
  isCompleted,
}: {
  quiz: Quiz;
  moduleId: string;
  orgId: string;
  courseId: string;
  isCompleted: boolean;
}) {
  return (
    <Link
      to={orgRoutes.quizTake(orgId, courseId, moduleId, quiz.id)}
      className="hover:bg-la-cream group flex items-center gap-3 rounded-md px-2 py-3 transition-colors"
    >
      {isCompleted ? (
        <CheckCircle2 className="text-la-ok h-4 w-4 shrink-0" />
      ) : (
        <Circle className="text-la-muted h-4 w-4 shrink-0" />
      )}
      <ListChecks className="text-la-muted h-4 w-4 shrink-0" />
      <span className="text-la-ink flex-1 truncate text-sm">{quiz.title}</span>
      <span className="text-la-muted text-xs">
        {quiz.questions.length}{" "}
        {quiz.questions.length === 1 ? "question" : "questions"}
      </span>
    </Link>
  );
}

function ModuleSection({
  module: mod,
  orgId,
  courseId,
  index,
  defaultExpanded,
  completedSet,
  completedQuizSet,
}: {
  module: CourseModuleDetail;
  orgId: string;
  courseId: string;
  index: number;
  defaultExpanded: boolean;
  completedSet: Set<string>;
  completedQuizSet: Set<string>;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const totalSeconds = mod.contents.reduce(
    (acc, c) => acc + (c.data.duration_seconds ?? 0),
    0
  );
  const completed = mod.contents.filter((c) => completedSet.has(c.id)).length;
  const completedQuizzes = mod.quizzes.filter((quiz) =>
    completedQuizSet.has(quiz.id)
  ).length;
  const total = mod.contents.length + mod.quizzes.length;
  const totalCompleted = completed + completedQuizzes;
  const pct = total > 0 ? Math.round((totalCompleted / total) * 100) : 0;

  return (
    <div className="border-la-rule-strong bg-la-paper overflow-hidden rounded-lg border">
      <button
        type="button"
        className="hover:bg-la-cream flex w-full items-center justify-between gap-4 p-4 text-left transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="bg-la-forest-wash text-la-forest font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums">
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-la-ink truncate font-bold">
              {mod.title}
            </h3>
            <div className="text-la-muted mt-0.5 flex items-center gap-3 text-xs">
              <span>
                {total} {total === 1 ? "lesson" : "lessons"}
              </span>
              {totalSeconds > 0 && (
                <>
                  <span className="text-la-muted/40">·</span>
                  <span>{formatDuration(totalSeconds)}</span>
                </>
              )}
              {totalCompleted > 0 && (
                <>
                  <span className="text-la-muted/40">·</span>
                  <span className="text-la-ok">
                    {totalCompleted}/{total} done
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <div className="bg-la-cream hidden h-1.5 w-24 overflow-hidden rounded-full sm:block">
              <div
                className="bg-la-ok h-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          {expanded ? (
            <ChevronDown className="text-la-muted h-4 w-4" />
          ) : (
            <ChevronRight className="text-la-muted h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-la-rule border-t px-2 pt-2 pb-2">
          {mod.contents.length === 0 && mod.quizzes.length === 0 ? (
            <p className="text-la-muted py-4 text-center text-sm">
              No content in this module yet.
            </p>
          ) : (
            <div className="divide-la-rule divide-y">
              {mod.contents.map((content) => (
                <ContentRow
                  key={content.id}
                  content={content}
                  orgId={orgId}
                  courseId={courseId}
                  isCompleted={completedSet.has(content.id)}
                />
              ))}
              {mod.quizzes.map((quiz) => (
                <QuizRow
                  key={quiz.id}
                  quiz={quiz}
                  moduleId={mod.id}
                  orgId={orgId}
                  courseId={courseId}
                  isCompleted={completedQuizSet.has(quiz.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoursePreviewPage() {
  const { orgId = "", courseId } = useParams<{
    orgId: string;
    courseId: string;
  }>();

  const { data: course, isLoading: courseLoading } = useCourse(courseId!);
  const { data: modules, isLoading: modulesLoading } = useCourseModules(
    courseId!,
    { pageSize: 100 }
  );
  const { data: progress } = useCourseMyProgress(courseId!);
  const enroll = useEnrollCourse();

  const modulesList = useMemo(() => modules?.data ?? [], [modules]);
  const completedSet = useMemo(() => getCompletedSet(progress), [progress]);
  const completedQuizSet = useMemo(() => {
    const ids = new Set<string>();

    for (const mod of progress?.modules ?? []) {
      for (const quiz of mod.quizzes ?? []) {
        if (quiz.is_completed) ids.add(quiz.id);
      }
    }

    return ids;
  }, [progress]);

  const totals = useMemo(() => {
    let lessons = 0;
    let seconds = 0;

    for (const mod of modulesList) {
      lessons += mod.contents.length + mod.quizzes.length;

      for (const c of mod.contents) {
        seconds += c.data.duration_seconds ?? 0;
      }
    }

    return { lessons, seconds };
  }, [modulesList]);

  // Find the next incomplete activity — used for resume CTA + smart expand.
  // React Compiler memoizes this automatically; no manual useMemo needed.
  let nextActivity: { moduleIndex: number; to: string } | null = null;

  outer: for (let i = 0; i < modulesList.length; i++) {
    for (const content of modulesList[i].contents) {
      if (!completedSet.has(content.id)) {
        nextActivity = {
          moduleIndex: i,
          to: orgRoutes.lesson(orgId, courseId!, content.id),
        };
        break outer;
      }
    }

    for (const quiz of modulesList[i].quizzes) {
      if (!completedQuizSet.has(quiz.id)) {
        nextActivity = {
          moduleIndex: i,
          to: orgRoutes.quizTake(orgId, courseId!, modulesList[i].id, quiz.id),
        };
        break outer;
      }
    }
  }

  const completedCount = completedSet.size + completedQuizSet.size;
  const totalLessons = modulesList.reduce(
    (sum, m) => sum + (m.contents?.length ?? 0) + (m.quizzes?.length ?? 0),
    0
  );
  const progressPercent = Math.round(progress?.course_progress ?? 0);
  const isEnrolled = isLearnerEnrolled(progress);
  const hasProgress = completedCount > 0;
  const ctaLabel = hasProgress ? "Resume course" : "Start the course";
  const ctaTo = nextActivity
    ? nextActivity.to
    : modulesList[0]?.contents[0]
      ? orgRoutes.lesson(orgId, courseId!, modulesList[0].contents[0].id)
      : modulesList[0]?.quizzes[0]
        ? orgRoutes.quizTake(
            orgId,
            courseId!,
            modulesList[0].id,
            modulesList[0].quizzes[0].id
          )
        : null;

  if (courseLoading) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6 text-center lg:p-8">
        <p className="font-display text-la-ink text-lg font-semibold">
          Course not found
        </p>
        <p className="text-la-muted mt-1 text-sm">
          This course may have been moved or removed.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        to={orgRoutes.courses(orgId)}
        className="text-la-muted hover:text-la-ink mb-6 inline-flex items-center gap-1 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        {/* Left column — editorial */}
        <div className="space-y-8">
          <header className="space-y-4">
            <p className="text-la-forest text-xs font-semibold tracking-[0.2em] uppercase">
              {course.category?.category_name ?? "Course"}
            </p>
            <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight text-balance lg:text-5xl">
              {course.title}
            </h1>

            {course.overview && (
              <p className="text-la-ink-2 max-w-2xl text-base text-pretty sm:text-lg">
                {course.overview}
              </p>
            )}

            <div className="text-la-muted flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                {modulesList.length}{" "}
                {modulesList.length === 1 ? "module" : "modules"}
              </span>
              <span className="text-la-muted/40">·</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {totals.lessons} {totals.lessons === 1 ? "lesson" : "lessons"}
              </span>
              {totals.seconds > 0 && (
                <>
                  <span className="text-la-muted/40">·</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatDuration(totals.seconds)}
                  </span>
                </>
              )}
            </div>

            {isEnrolled && (
              <div className="max-w-md space-y-2 pt-2">
                <div className="text-la-muted flex items-center justify-between text-xs font-medium">
                  <span>Your progress</span>
                  <span className="tabular-nums">
                    {completedCount}/{totalLessons} lessons · {progressPercent}%
                  </span>
                </div>
                <div className="bg-la-cream h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-la-forest h-full rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </header>

          {/* Modules */}
          <section className="space-y-4">
            <h2 className="font-display text-la-ink text-lg font-bold">
              Course content
            </h2>
            {modulesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : modulesList.length === 0 ? (
              <div className="border-la-rule-strong bg-la-paper rounded-lg border py-10 text-center">
                <Layers className="text-la-muted mx-auto mb-2 h-8 w-8" />
                <p className="font-display text-la-ink text-lg font-semibold">
                  No modules yet
                </p>
                <p className="text-la-muted mt-1 text-sm">
                  Content will appear here once modules are added.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {modulesList.map((mod, i) => (
                  <ModuleSection
                    key={mod.id}
                    module={mod}
                    orgId={orgId}
                    courseId={courseId!}
                    index={i}
                    defaultExpanded={
                      nextActivity ? nextActivity.moduleIndex === i : i === 0
                    }
                    completedSet={completedSet}
                    completedQuizSet={completedQuizSet}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column — sticky enroll card */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="border-la-rule-strong bg-la-paper overflow-hidden rounded-lg border">
            {course.course_image && (
              <div className="bg-la-cream aspect-video w-full overflow-hidden">
                <img
                  src={createMediaUrl(course.course_image)}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="space-y-5 p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-la-ink text-3xl font-bold">
                  {course.is_premium ? `$${course.price}` : "Free"}
                </span>
                {course.is_premium && (
                  <span className="text-la-muted text-sm">premium</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {ctaTo ? (
                  <Button asChild size="lg" className="w-full">
                    <Link to={ctaTo}>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {ctaLabel}
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" disabled>
                    <PlayCircle className="mr-2 h-5 w-5" />
                    No lessons yet
                  </Button>
                )}
                {isEnrolled ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    <CheckCircle2 className="text-la-ok mr-2 h-5 w-5" />
                    Enrolled
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => enroll.mutate(courseId!)}
                    disabled={enroll.isPending}
                  >
                    {enroll.isPending ? "Enrolling..." : "Enroll"}
                  </Button>
                )}
              </div>

              <dl className="divide-la-rule border-la-rule divide-y border-t text-sm">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-la-muted">Modules</dt>
                  <dd className="text-la-ink font-medium tabular-nums">
                    {modulesList.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-la-muted">Lessons</dt>
                  <dd className="text-la-ink font-medium tabular-nums">
                    {totals.lessons}
                  </dd>
                </div>
                {totals.seconds > 0 && (
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-la-muted">Duration</dt>
                    <dd className="text-la-ink font-medium tabular-nums">
                      {formatDuration(totals.seconds)}
                    </dd>
                  </div>
                )}
                {course.category && (
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-la-muted">Category</dt>
                    <dd className="text-la-ink font-medium">
                      {course.category.category_name}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="text-la-ink-2 border-la-rule flex items-center gap-2 border-t pt-4 text-sm">
                <Award className="text-la-forest h-4 w-4 shrink-0" />
                Earn a certificate on completion.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
