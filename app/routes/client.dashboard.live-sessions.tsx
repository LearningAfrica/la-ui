import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import AsyncSelect from "@/components/ui/async-select";
import { cn } from "@/lib/utils";
import Plus from "~icons/lucide/plus";
import RefreshCw from "~icons/lucide/refresh-cw";
import CalendarDays from "~icons/lucide/calendar-days";
import List from "~icons/lucide/list";
import Download from "~icons/lucide/download";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { useZoomCalls } from "@/features/zoom-calls/zoom-call-queries";
import { useCourses } from "@/features/courses/course-queries";
import { ZoomCallsTable } from "@/components/dashboard/zoom-calls-table";
import { CreateOrUpdateZoomCallDialog } from "@/components/dashboard/create-or-update-zoom-call-dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { LiveSessionsCalendar } from "@/components/dashboard/live-sessions/live-sessions-calendar";
import { apiClient } from "@/lib/api";
import { orgRoutes } from "@/lib/utils/org-routes";

export default function ClientDashboardLiveSessions() {
  const { selectedOrganization } = useOrganizationStore();
  const role = selectedOrganization?.role;
  const canManage = role === "admin" || role === "instructor";

  const createCallModal = useAppModal("create-or-update-zoom-call");
  const navigate = useNavigate();
  const { orgId = "" } = useParams<{ orgId: string }>();
  const [view, setView] = useState<"list" | "calendar">("list");

  const [courseFilter, setCourseFilter] = useState<string>("all");
  const { data, isLoading, error, refetch } = useZoomCalls(
    courseFilter !== "all"
      ? { course: courseFilter, page_size: 100 }
      : { page_size: 100 }
  );
  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const calls = useMemo(() => data?.data ?? [], [data]);

  const downloadCalendar = async () => {
    const response = await apiClient.get<Blob>(
      "/api/call/zoom-calls/calendar-feed/",
      { responseType: "blob" }
    );
    const url = URL.createObjectURL(response.data);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "learning-africa-calendar.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadCalendar}>
            <Download className="mr-1 size-4" /> Calendar file
          </Button>
          <div className="flex rounded-md border p-0.5">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="mr-1 size-4" /> List
            </Button>
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarDays className="mr-1 size-4" /> Calendar
            </Button>
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
      </div>

      {view === "list" ? (
        <ZoomCallsTable
          calls={calls}
          isLoading={isLoading}
          error={error as Error | null}
          userRole={role}
        />
      ) : (
        <LiveSessionsCalendar
          calls={calls}
          onOpen={(call) => navigate(orgRoutes.liveSessionJoin(orgId, call.id))}
        />
      )}

      <CreateOrUpdateZoomCallDialog />
    </div>
  );
}
