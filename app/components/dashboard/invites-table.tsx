import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Clock, Mail } from "lucide-react";
import {
  useAcceptInvite,
  useDeclineInvite,
} from "@/features/invites/invites-mutations";
import type { Invite } from "@/features/invites/invites-queries";
import moment from "moment";

interface InvitesTableProps {
  invites: Invite[];
}

export function InvitesTable({ invites }: InvitesTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const acceptInviteMutation = useAcceptInvite();
  const declineInviteMutation = useDeclineInvite();

  const columns: ColumnDef<Invite>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;

        return (
          <Badge variant="outline">
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_used",
      header: "Status",
      cell: ({ row }) => {
        const isUsed = row.getValue("is_used") as boolean;
        const isExpired = moment(row.original.expiration_time).isBefore(
          moment()
        );

        if (isUsed) {
          return <Badge variant="default">Used</Badge>;
        }

        if (isExpired) {
          return <Badge variant="outline">Expired</Badge>;
        }

        return <Badge variant="secondary">Pending</Badge>;
      },
    },
    {
      accessorKey: "expiration_time",
      header: "Expires",
      cell: ({ row }) => {
        const expiresAt = moment(row.getValue("expiration_time"));
        const isExpired = expiresAt.isBefore(moment());

        return (
          <div
            className={`flex items-center gap-2 text-sm ${isExpired ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
          >
            <Clock className="h-4 w-4" />
            <span>
              {expiresAt.fromNow()}
              {isExpired && " (Expired)"}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invite = row.original;
        const isExpired = moment(invite.expiration_time).isBefore(moment());
        const isPending = !invite.is_used && !isExpired;
        const isProcessing =
          acceptInviteMutation.isPending || declineInviteMutation.isPending;

        if (!isPending) {
          return (
            <span className="text-muted-foreground text-sm">
              {invite.is_used ? "Used" : "Expired"}
            </span>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => acceptInviteMutation.mutate(invite.id)}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-1 h-3 w-3" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => declineInviteMutation.mutate(invite.id)}
              disabled={isProcessing}
            >
              <X className="mr-1 h-3 w-3" />
              Decline
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: invites,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder="Search invitations..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-muted/50 border-b">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/50 border-b transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    No invitations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            invites.length
          )}{" "}
          of {invites.length} invitations
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
