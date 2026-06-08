import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AsyncSelect from "@/components/ui/async-select";
import Plus from "~icons/lucide/plus";
import Video from "~icons/lucide/video";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useZoomCalls } from "@/features/zoom-calls/zoom-call-queries";
import { useCourses } from "@/features/courses/course-queries";
import { ZoomCallsTable } from "@/components/dashboard/zoom-calls-table";
import { CreateOrUpdateZoomCallDialog } from "@/components/dashboard/create-or-update-zoom-call-dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";

export default function ClientDashboardLiveSessions() {
  const { selectedOrganization } = useOrganizationStore();
  const role = selectedOrganization?.role;
  const canManage = role === "admin" || role === "instructor";

  const createCallModal = useAppModal("create-or-update-zoom-call");

  const [courseFilter, setCourseFilter] = useState<string>("all");
  const { data, isLoading, error, refetch } = useZoomCalls(
    courseFilter !== "all" ? { course: courseFilter } : {}
  );
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const calls = useMemo(() => data?.data ?? [], [data]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Video className="h-6 w-6" />
            Live Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            {canManage
              ? "Schedule and manage Zoom sessions for your organization."
              : "Upcoming live sessions hosted by your organization."}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => createCallModal.open(undefined)}>
            <Plus className="mr-1 h-4 w-4" />
            Schedule Session
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Sessions</CardTitle>
          <div className="w-56">
            <AsyncSelect
              value={courseFilter}
              onChange={(v) => setCourseFilter(v ? String(v) : "all")}
              placeholder="All courses"
              options={[
                { value: "all", label: "All courses" },
                ...(coursesData?.data?.map((c) => ({
                  value: c.id,
                  label: c.title,
                })) ?? []),
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ZoomCallsTable
            calls={calls}
            isLoading={isLoading}
            error={error as Error | null}
            onRefresh={() => refetch()}
            userRole={role}
          />
        </CardContent>
      </Card>

      <CreateOrUpdateZoomCallDialog />
    </div>
  );
}
