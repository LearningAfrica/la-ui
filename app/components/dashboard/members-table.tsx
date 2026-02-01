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
import { Search, RefreshCw, X, UsersIcon } from "lucide-react";
import type {
  OrganizationMember,
  OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";
import moment from "moment";
import { useMembersFilterStore } from "@/stores/members/members-filter-store";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

interface MembersTableProps {
  members: OrganizationMember[];
  totalPages: number;
  currentPage: number;
  totalDocs: number;
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

const columnHelper = createColumnHelper<OrganizationMember>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "#",
    cell: ({ row }) => {
      const { page, page_size } = useMembersFilterStore.getState();

      return <span>{(page - 1) * page_size + row.index + 1}</span>;
    },
  }),
  columnHelper.accessor("first_name", {
    header: "Member",
    id: "member",
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">
              {member.first_name} {member.last_name}
            </div>
            <div className="text-muted-foreground text-sm">{member.email}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as OrganizationMembershipRole;
      const roleColors = {
        admin:
          "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
        instructor:
          "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
        learner:
          "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
      };

      return (
        <Badge variant="secondary" className={roleColors[role]}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("is_active", {
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;

      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("date_joined", {
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {moment(row.getValue("date_joined")).format("MMM DD, YYYY")}
      </span>
    ),
  }),
  // columnHelper.accessor("", {
  //   header: "Last Login",
  //   cell: ({ row }) => {
  //     const lastLogin = row.getValue("last_login") as string | null;

  //     return lastLogin ? (
  //       <span className="text-muted-foreground text-sm">
  //         {moment(lastLogin).fromNow()}
  //       </span>
  //     ) : (
  //       <span className="text-muted-foreground text-sm">Never</span>
  //     );
  //   },
  // }),
];

export function MembersTable({
  members,
  totalPages,
  currentPage,
  totalDocs,
  isLoading = false,
  error = null,
  onRefresh,
}: MembersTableProps) {
  const {
    search,
    role,
    is_active,
    page_size,
    setSearch,
    setRole,
    setIsActive,
    setPage,
    setPageSize,
    resetFilters,
  } = useMembersFilterStore();

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const hasActiveFilters =
    search || role !== undefined || is_active !== undefined;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

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

          <Select
            value={
              is_active === undefined
                ? "all"
                : is_active
                  ? "active"
                  : "inactive"
            }
            onValueChange={(value) =>
              setIsActive(value === "all" ? undefined : value === "active")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
              {error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="text-destructive">
                        <svg
                          className="mx-auto h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold">
                          Failed to Load Members
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {error.message ||
                            "There was an error loading the members."}
                        </p>
                      </div>
                      {onRefresh && (
                        <Button onClick={onRefresh} variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-muted-foreground px-4 py-8 text-center"
                  >
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin" />
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
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
                    className="text-muted-foreground text-center"
                  >
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                          <UsersIcon />
                        </EmptyMedia>
                        <EmptyTitle>No members found.</EmptyTitle>

                        <EmptyDescription>
                          There are no members in this organization yet.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent></EmptyContent>
                    </Empty>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Rows per page:</span>
          <Select
            value={page_size.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground text-sm">
          Showing {(currentPage - 1) * page_size + 1} to{" "}
          {Math.min(currentPage * page_size, totalDocs)} of {totalDocs} members
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <div className="text-sm">
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
    </div>
  );
}
