import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  RefreshCw,
  X,
  Mail,
  MoreVertical,
  Copy,
  Trash2,
  UserPlus,
} from "lucide-react";
import type {
  OrganizationInvite,
  OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";
import moment from "moment";
import { useInvitesFilterStore } from "@/stores/invites/invites-filter-store";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface OrganizationInvitesTableProps {
  invites: OrganizationInvite[];
  totalPages: number;
  currentPage: number;
  totalDocs: number;
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  onInvite?: () => void;
}

const columnHelper = createColumnHelper<OrganizationInvite>();

const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="text-muted-foreground h-4 w-4" />
        <span className="font-medium">{row.getValue("email")}</span>
      </div>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as OrganizationMembershipRole;
      const roleColors = {
        admin:
          "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        instructor:
          "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        learner:
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      };

      return (
        <Badge variant="outline" className={roleColors[role]}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        pending: {
          variant: "secondary" as const,
          label: "Pending",
        },
        accepted: {
          variant: "default" as const,
          label: "Accepted",
        },
        declined: {
          variant: "destructive" as const,
          label: "Declined",
        },
        expired: {
          variant: "outline" as const,
          label: "Expired",
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  }),
  columnHelper.accessor("invited_by", {
    header: "Invited By",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.getValue("invited_by")}
      </span>
    ),
  }),
  columnHelper.accessor("invited_at", {
    header: "Invited",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {moment(row.getValue("invited_at")).fromNow()}
      </span>
    ),
  }),
  columnHelper.accessor("expires_at", {
    header: "Expires",
    cell: ({ row }) => {
      const expiresAt = moment(row.getValue("expires_at"));
      const isExpired = expiresAt.isBefore(moment());

      return (
        <span
          className={`text-sm ${isExpired ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}
        >
          {expiresAt.fromNow()}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const invite = row.original;
      const isPending = invite.status === "pending";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(invite.email)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Email
            </DropdownMenuItem>
            {isPending && (
              <>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Invite
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Invite
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
];

export function OrganizationInvitesTable({
  invites,
  totalPages,
  currentPage,
  totalDocs,
  isLoading = false,
  error = null,
  onRefresh,
  onInvite,
}: OrganizationInvitesTableProps) {
  const {
    search,
    role,
    status,
    page_size,
    setSearch,
    setRole,
    setStatus,
    setPage,
    setPageSize,
    resetFilters,
  } = useInvitesFilterStore();

  const table = useReactTable({
    data: invites,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const hasActiveFilters = search || role !== undefined || status !== undefined;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onInvite && (
            <Button onClick={onInvite} size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input
              placeholder="Search by email or inviter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={status || "all"}
            onValueChange={(value) =>
              setStatus(
                value === "all"
                  ? undefined
                  : (value as "pending" | "accepted" | "declined" | "expired")
              )
            }
          >
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={role || "all"}
            onValueChange={(value) =>
              setRole(
                value === "all"
                  ? undefined
                  : (value as OrganizationMembershipRole)
              )
            }
          >
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="learner">Learner</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
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
                      Loading invites...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center"
                  >
                    <div className="text-destructive">
                      Error loading invites: {error.message}
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8">
                    <Empty>
                      <EmptyMedia>
                        <Mail className="h-12 w-12" />
                      </EmptyMedia>
                      <EmptyHeader>
                        <EmptyTitle>No Invites</EmptyTitle>
                        <EmptyDescription>
                          {hasActiveFilters
                            ? "No invites match your filters. Try adjusting your search criteria."
                            : "You haven't sent any invitations yet. Click the 'Invite Members' button to get started."}
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        {hasActiveFilters ? (
                          <Button onClick={resetFilters} variant="outline">
                            Clear Filters
                          </Button>
                        ) : onInvite ? (
                          <Button onClick={onInvite}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Members
                          </Button>
                        ) : null}
                      </EmptyContent>
                    </Empty>
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

      {/* Pagination */}
      {!isLoading && !error && invites.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-muted-foreground text-sm">
            Showing {(currentPage - 1) * page_size + 1} to{" "}
            {Math.min(currentPage * page_size, totalDocs)} of {totalDocs} invite
            {totalDocs !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={page_size.toString()}
              onValueChange={(value) => setPageSize(parseInt(value))}
            >
              <SelectTrigger className="w-25">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
