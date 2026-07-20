import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import AsyncSelect from "@/components/ui/async-select";
import { cn } from "@/lib/utils";
import Plus from "~icons/lucide/plus";
import RefreshCw from "~icons/lucide/refresh-cw";
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
    <div className="p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-la-forest mb-2 text-xs font-semibold tracking-[0.2em] uppercase">
            Live classes
          </p>
          <h1 className="font-display text-la-ink text-4xl font-bold tracking-tight lg:text-5xl">
            Live sessions
          </h1>
          <p className="text-la-muted mt-2 max-w-prose">
            {canManage
              ? "Schedule and manage Zoom sessions for your organization."
              : "Upcoming live sessions hosted by your organization."}
          </p>
        </div>
        {canManage && (
          <Button onClick={() => createCallModal.open(undefined)}>
            <Plus className="mr-1 size-4" />
            Schedule session
          </Button>
        )}
      </header>

      {/* Toolbar — filter left, refresh right. Cards sit directly on the page
          (no wrapping panel) so we don't nest borders. */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-56">
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
          className="self-start sm:self-auto"
        >
          <RefreshCw
            className={cn("mr-1 size-4", isLoading && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      <ZoomCallsTable
        calls={calls}
        isLoading={isLoading}
        error={error as Error | null}
        userRole={role}
      />

      <CreateOrUpdateZoomCallDialog />
    </div>
  );
}
