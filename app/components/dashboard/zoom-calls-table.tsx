import { useState } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useParams } from "react-router";
import MoreVertical from "~icons/lucide/more-vertical";
import Pencil from "~icons/lucide/pencil";
import Trash2 from "~icons/lucide/trash-2";
import Video from "~icons/lucide/video";
import RefreshCw from "~icons/lucide/refresh-cw";
import Copy from "~icons/lucide/copy";
import Clock from "~icons/lucide/clock";
import CalendarX from "~icons/lucide/calendar-x";
import type { ZoomCall } from "@/features/zoom-calls/zoom-call-queries";
import { useDeleteZoomCall } from "@/features/zoom-calls/zoom-call-mutations";
import {
  getSessionStatus,
  SESSION_STATUS_LABEL,
  SESSION_STATUS_CLASS,
} from "@/features/zoom-calls/session-status";
import { orgRoutes } from "@/lib/utils/org-routes";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { cn } from "@/lib/utils";
import type { OrganizationMembershipRole } from "@/features/organizations/organization-queries";

interface ZoomCallsListProps {
  calls: ZoomCall[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  userRole: OrganizationMembershipRole | undefined;
}

// Sessions are time-based events, so they read better as cards than a table:
// a prominent date, a big Join CTA, live sessions highlighted, and it stacks
// cleanly on mobile instead of forcing horizontal scroll.
export function ZoomCallsTable({
  calls,
  isLoading = false,
  error = null,
  onRefresh,
  userRole,
}: ZoomCallsListProps) {
  const { orgId = "" } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const editModal = useAppModal("create-or-update-zoom-call");
  const deleteMutation = useDeleteZoomCall();
  const [pendingDelete, setPendingDelete] = useState<ZoomCall | null>(null);

  const canManage = userRole === "admin" || userRole === "instructor";

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteMutation.mutate(
      { id: pendingDelete.id, topic: pendingDelete.topic },
      { onSettled: () => setPendingDelete(null) }
    );
  };

  return (
    <div className="space-y-3">
      {onRefresh && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("mr-2 size-4", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border-la-rule-strong bg-la-paper h-20 animate-pulse rounded-lg border"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-la-bad py-8 text-center text-sm">
          Couldn&apos;t load sessions. Try refreshing.
        </p>
      ) : calls.length === 0 ? (
        <div className="border-la-rule-strong rounded-lg border border-dashed px-6 py-14 text-center">
          <CalendarX className="text-la-muted mx-auto size-8" />
          <p className="font-display text-la-ink mt-4 text-lg font-semibold">
            No sessions scheduled
          </p>
          <p className="text-la-muted mt-1 text-sm">
            {canManage
              ? "Schedule a Zoom session and it will appear here."
              : "Live sessions will appear here once scheduled."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {calls.map((call) => {
            const s = getSessionStatus(call);
            const isLive = s === "live";
            const canJoin = s === "live" || s === "upcoming";
            const start = moment(call.start_time);

            return (
              <li
                key={call.id}
                className={cn(
                  "flex flex-col gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center",
                  isLive
                    ? "border-la-ok/50 bg-la-ok/5"
                    : "border-la-rule-strong bg-la-paper"
                )}
              >
                {/* Date tile + details */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 flex-col items-center justify-center rounded-lg",
                      isLive
                        ? "bg-la-ok/15 text-la-ok"
                        : "bg-la-cream text-la-ink"
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase opacity-70">
                      {start.format("MMM")}
                    </span>
                    <span className="font-display text-lg leading-none font-bold">
                      {start.format("D")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-la-ink truncate font-bold">
                      {call.topic}
                    </h3>
                    <p className="text-la-muted mt-0.5 flex items-center gap-1.5 text-xs">
                      <Clock className="size-3.5 shrink-0" />
                      {start.format("ddd, MMM D · h:mm A")} · {call.duration}{" "}
                      min
                      <span className="text-la-ink-2">· {start.fromNow()}</span>
                    </p>
                  </div>
                </div>

                {/* Status + actions */}
                <div className="flex shrink-0 items-center gap-2 pl-15 sm:pl-0">
                  {isLive && (
                    <span
                      className="bg-la-ok size-2 animate-pulse rounded-full"
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      SESSION_STATUS_CLASS[s]
                    )}
                  >
                    {SESSION_STATUS_LABEL[s]}
                  </span>
                  {canJoin && (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(orgRoutes.liveSessionJoin(orgId, call.id))
                      }
                    >
                      <Video className="mr-1 size-3.5" />
                      Join
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label="Session actions"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {call.join_url && (
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(call.join_url)
                          }
                        >
                          <Copy className="mr-2 size-4" />
                          Copy join link
                        </DropdownMenuItem>
                      )}
                      {canManage && (
                        <>
                          <DropdownMenuItem
                            onClick={() => editModal.open(call)}
                          >
                            <Pencil className="mr-2 size-4" />
                            Edit session
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPendingDelete(call)}
                            className="text-la-bad focus:text-la-bad"
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete session
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(v) => !v && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this session?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.topic}&rdquo; will be permanently removed.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-la-bad hover:bg-la-bad/90 text-white"
              onClick={handleConfirmDelete}
            >
              Delete session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
