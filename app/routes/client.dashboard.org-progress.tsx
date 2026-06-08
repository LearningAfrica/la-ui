import TrendingUp from "~icons/lucide/trending-up";
import RefreshCw from "~icons/lucide/refresh-cw";
import { OrgRoleGuard } from "@/components/auth/org-role-guard";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOrgProgress } from "@/features/courses/course-queries";

export default function ClientDashboardOrgProgress() {
  const { data, isLoading, error } = useOrgProgress({ page: 1, pageSize: 100 });
  const courses = data?.data ?? [];

  return (
    <OrgRoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <TrendingUp className="h-6 w-6" />
            Course Progress
          </h1>
          <p className="text-muted-foreground mt-1">
            How learners are progressing across your organization&apos;s
            courses.
          </p>
        </div>

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
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const progress = Math.round(course.course_progress ?? 0);
                    const isCompleted = progress === 100;

                    return (
                      <tr
                        key={course.id}
                        className="hover:bg-muted/50 border-t transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {course.title}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted h-2 w-40 overflow-hidden rounded-full">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  isCompleted
                                    ? "bg-emerald-500"
                                    : "bg-primary/60"
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-sm tabular-nums">
                              {progress}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </OrgRoleGuard>
  );
}
