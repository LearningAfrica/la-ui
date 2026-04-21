import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
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
import {
  MoreVertical,
  Pencil,
  Trash2,
  Video,
  ExternalLink,
  RefreshCw,
  Copy,
} from "lucide-react";
import type { ZoomCall } from "@/features/zoom-calls/zoom-call-queries";
import { useDeleteZoomCall } from "@/features/zoom-calls/zoom-call-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import type { OrganizationMembershipRole } from "@/features/organizations/organization-queries";

interface ZoomCallsTableProps {
  calls: ZoomCall[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  userRole: OrganizationMembershipRole | undefined;
}

const statusColors: Record<ZoomCall["status"], string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  live: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  completed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function ZoomCallsTable({
  calls,
  isLoading = false,
  error = null,
  onRefresh,
  userRole,
}: ZoomCallsTableProps) {
  const editModal = useAppModal("create-or-update-zoom-call");
  const deleteMutation = useDeleteZoomCall();
  const [pendingDelete, setPendingDelete] = useState<ZoomCall | null>(null);

  const canManage = userRole === "admin" || userRole === "instructor";

  const columns = useMemo<ColumnDef<ZoomCall>[]>(
    () => [
      {
        accessorKey: "topic",
        header: "Topic",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Video className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">{row.original.topic}</span>
          </div>
        ),
      },
      {
        accessorKey: "start_time",
        header: "Starts",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm">
              {moment(row.original.start_time).format("MMM D, h:mm A")}
            </span>
            <span className="text-muted-foreground text-xs">
              {moment(row.original.start_time).fromNow()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.duration} min</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={statusColors[row.original.status]}
          >
            {row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const call = row.original;
          const canJoin = call.status === "scheduled" || call.status === "live";

          return (
            <div className="flex items-center gap-2">
              {canJoin && call.join_url && (
                <Button
                  asChild
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <a
                    href={call.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Join
                  </a>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
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
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Join Link
                    </DropdownMenuItem>
                  )}
                  {canManage && (
                    <>
                      <DropdownMenuItem onClick={() => editModal.open(call)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Session
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPendingDelete(call)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Session
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [editModal, canManage]
  );

  const table = useReactTable({
    data: calls,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteMutation.mutate(
      { id: pendingDelete.id, topic: pendingDelete.topic },
      { onSettled: () => setPendingDelete(null) }
    );
  };

  return (
    <div className="space-y-4">
      {onRefresh && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      )}

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {table.getHeaderGroups()[0]?.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading sessions...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-destructive px-4 py-8 text-center"
                  >
                    Error loading sessions: {error.message}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-muted-foreground px-4 py-8 text-center text-sm"
                  >
                    No live sessions scheduled.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/50 border-t transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete session?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.topic}" will be cancelled for all participants.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
