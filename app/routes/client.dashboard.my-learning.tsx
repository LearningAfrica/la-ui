import { useState } from "react";
import { Link, useParams } from "react-router";
import BookOpen from "~icons/lucide/book-open";
import GraduationCap from "~icons/lucide/graduation-cap";
import Layers from "~icons/lucide/layers";
import ArrowRight from "~icons/lucide/arrow-right";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimisticImage } from "@/components/ui/optimistic-image";
import { cn } from "@/lib/utils";
import { createMediaUrl } from "@/lib/api";
import { orgRoutes } from "@/lib/utils/org-routes";
import {
  useMyCourses,
  type EnrolledCourse,
} from "@/features/courses/course-queries";

function EnrolledCourseCard({
  enrollment,
  orgId,
}: {
  enrollment: EnrolledCourse;
  orgId: string;
}) {
  const course = enrollment.course;
  const progress = Math.round(enrollment.course_progress ?? 0);
  const moduleCount = course.modules?.length ?? 0;
  const lessonCount =
    course.modules?.reduce((acc, m) => acc + (m.contents?.length ?? 0), 0) ?? 0;
  const isCompleted = progress === 100;
  const continueTarget = orgRoutes.coursePreview(orgId, course.id);

  return (
    <Link
      to={continueTarget}
      className="group border-la-rule-strong bg-la-paper hover:border-la-forest/40 flex flex-col overflow-hidden rounded-lg border transition-colors"
    >
      <div className="bg-la-cream relative aspect-video overflow-hidden">
        {course.course_image ? (
          <OptimisticImage
            src={createMediaUrl(course.course_image)}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-la-muted flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
        {isCompleted && (
          <span className="bg-la-ok absolute top-3 left-3 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white">
            Completed
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {course.category && (
          <p className="text-la-forest text-[11px] font-semibold tracking-[0.15em] uppercase">
            {course.category.category_name}
          </p>
        )}
        <h3 className="font-display text-la-ink line-clamp-2 leading-snug font-semibold">
          {course.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-la-muted">Progress</span>
            <span className="text-la-ink tabular-nums">{progress}%</span>
          </div>
          <div className="bg-la-cream h-1.5 overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isCompleted ? "bg-la-ok" : "bg-la-forest"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="text-la-muted flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1">
            <Layers className="h-3.5 w-3.5" />
            {moduleCount} {moduleCount === 1 ? "module" : "modules"}
          </span>
          <span className="text-la-rule-strong">·</span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        <div className="mt-auto pt-1">
          <span className="text-la-forest group-hover:text-la-forest-deep inline-flex items-center gap-1 text-sm font-semibold">
            {isCompleted
              ? "Review course"
              : progress > 0
                ? "Continue"
                : "Start course"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ClientDashboardMyLearning() {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const { data, isLoading } = useMyCourses({ page: 1, pageSize: 50 });
  const [status, setStatus] = useState<
    "all" | "in-progress" | "not-started" | "completed"
  >("all");

  const enrollments = data?.data ?? [];

  const pct = (e: EnrolledCourse) => Math.round(e.course_progress ?? 0);
  const buckets = {
    all: enrollments,
    "not-started": enrollments.filter((e) => pct(e) === 0),
    "in-progress": enrollments.filter((e) => pct(e) > 0 && pct(e) < 100),
    completed: enrollments.filter((e) => pct(e) === 100),
  };

  const TABS = [
    { key: "all", label: "All" },
    { key: "in-progress", label: "In progress" },
    { key: "not-started", label: "Not started" },
    { key: "completed", label: "Completed" },
  ] as const;

  const shown = buckets[status];

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-6">
        <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
          Learning
        </p>
        <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
          My Learning
        </h1>
        <p className="text-la-muted mt-2">
          Track your enrolled courses and progress
        </p>
      </header>

      {/* Sticky status tabs — horizontally scrollable so they never crowd on
          narrow screens. */}
      {enrollments.length > 0 && (
        <div className="bg-background/95 border-la-rule-strong sticky top-0 z-10 -mx-6 mb-6 border-b px-6 backdrop-blur lg:-mx-8 lg:px-8">
          <div className="no-scrollbar flex gap-6 overflow-x-auto">
            {TABS.map((t) => {
              const active = status === t.key;

              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setStatus(t.key)}
                  className={cn(
                    "relative shrink-0 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                    active ? "text-la-ink" : "text-la-muted hover:text-la-ink"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "ml-1.5 tabular-nums",
                      active ? "text-la-forest" : "text-la-muted/60"
                    )}
                  >
                    {buckets[t.key].length}
                  </span>
                  {active && (
                    <span className="bg-la-forest absolute inset-x-0 -bottom-px h-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="border-la-rule-strong flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
          <GraduationCap className="text-la-muted h-10 w-10 opacity-40" />
          <p className="text-la-muted text-sm">
            You haven&apos;t enrolled in any courses yet.
          </p>
          <Button asChild className="mt-2">
            <Link to={orgRoutes.courses(orgId)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Browse courses
            </Link>
          </Button>
        </div>
      ) : shown.length === 0 ? (
        <p className="text-la-muted py-16 text-center text-sm">
          No courses in this status.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((e) => (
            <EnrolledCourseCard key={e.id} enrollment={e} orgId={orgId} />
          ))}
        </div>
      )}
    </div>
  );
}
