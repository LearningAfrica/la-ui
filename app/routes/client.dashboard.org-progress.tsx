import TrendingUp from "~icons/lucide/trending-up";
import RefreshCw from "~icons/lucide/refresh-cw";
import ChevronDown from "~icons/lucide/chevron-down";
import ChevronLeft from "~icons/lucide/chevron-left";
import ChevronRight from "~icons/lucide/chevron-right";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTableFilters } from "@/stores/filters/use-table-filters";
import {
  useOrgProgress,
  type OrgProgressLearner,
} from "@/features/courses/course-queries";

function ProgressBar({ value }: { value: number }) {
  const pct = Math.round(value ?? 0);
  const isCompleted = pct === 100;

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {/* Narrower on mobile so it doesn't crush the learner name beside it. */}
      <div className="bg-la-cream h-2 w-20 overflow-hidden rounded-full sm:w-40">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isCompleted ? "bg-la-ok" : "bg-la-forest"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-la-ink w-9 text-right text-sm font-medium tabular-nums">
        {pct}%
      </span>
    </div>
  );
}

function learnerName(l: OrgProgressLearner) {
  const { first_name, last_name, email } = l.learner;
  const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

  return name || email;
}

function LearnerRow({ learner }: { learner: OrgProgressLearner }) {
  return (
    <details className="group border-t">
      <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center gap-3 px-4 py-3">
        <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform group-open:rotate-180" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{learnerName(learner)}</p>
          <p className="text-muted-foreground truncate text-xs">
            {learner.learner.email}
          </p>
        </div>
        <ProgressBar value={learner.course_progress} />
      </summary>

      <div className="bg-muted/30 flex flex-wrap gap-2 px-11 py-3">
        {learner.modules.map((m) => (
          <div
            key={m.module_id}
            className="bg-background flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs"
          >
            <span className="font-medium">{m.title}</span>
            <span className="text-muted-foreground tabular-nums">
              {m.completed_contents}/{m.total_contents} •{" "}
              {Math.round(m.module_progress ?? 0)}%
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function ClientDashboardOrgProgress() {
  const { state, setPage, setLimit } = useTableFilters("org-progress");
  const page = state.page;
  const pageSize = state.limit;
  const { data, isLoading, error } = useOrgProgress({ page, pageSize });
  const courses = data?.data ?? [];

  const totalPages = data?.meta?.total_pages || 1;
  const hasNext = data?.meta?.has_next_page || false;
  const hasPrev = data?.meta?.has_prev_page || false;
  const totalDocs = data?.meta?.total_docs ?? 0;

  return (
    <OrgRoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6 p-6 lg:p-8">
        <header>
          <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Analytics
          </p>
          <h1 className="font-display text-la-ink flex items-center gap-2 text-4xl font-bold tracking-tight lg:text-5xl">
            <TrendingUp className="h-8 w-8" />
            Course Progress
          </h1>
          <p className="text-la-muted mt-2">
            How learners are progressing across your organization&apos;s
            courses.
          </p>
        </header>

        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 p-6 text-sm">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading progress...
          </div>
        ) : error ? (
          <Card>
            <CardContent className="text-destructive py-8 text-center text-sm">
              Error loading progress: {(error as Error).message}
            </CardContent>
          </Card>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-12 text-center text-sm">
              No course progress data yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const learners = course.learners ?? [];
              const avg = learners.length
                ? learners.reduce((s, l) => s + (l.course_progress ?? 0), 0) /
                  learners.length
                : 0;

              return (
                <div
                  key={course.course_id}
                  className="overflow-hidden rounded-lg border"
                >
                  <div className="bg-la-cream/60 flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-la-ink truncate text-sm font-semibold">
                        {course.course_title}
                      </h2>
                      <p className="text-la-muted text-xs">
                        {learners.length}{" "}
                        {learners.length === 1 ? "learner" : "learners"}{" "}
                        enrolled
                      </p>
                    </div>
                    {learners.length > 0 && <ProgressBar value={avg} />}
                  </div>

                  {learners.length === 0 ? (
                    <p className="text-muted-foreground border-t px-4 py-6 text-center text-sm">
                      No learners enrolled yet.
                    </p>
                  ) : (
                    learners.map((l) => (
                      <LearnerRow key={l.learner.id} learner={l} />
                    ))
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-muted-foreground text-sm">
                Page {page} of {totalPages} &bull; {totalDocs} total courses
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
          </div>
        )}
      </div>
    </OrgRoleGuard>
  );
}
