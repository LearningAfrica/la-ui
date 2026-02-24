import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/features/users/user-queries";
import { Search, X } from "lucide-react";

interface AdminUsersTableProps {
  users: User[];
}

const columnHelper = createColumnHelper<User>();

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      }),
      columnHelper.accessor("first_name", {
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.profile?.profile_image ? (
              <img
                src={row.original.profile.profile_image}
                alt={`${row.original.first_name} ${row.original.last_name}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                {row.original?.first_name?.[0]}
                {row.original?.last_name?.[0]}
              </div>
            )}
            <div>
              <p className="font-medium">
                {row.original.profile?.title
                  ? `${row.original.profile.title} `
                  : ""}
                {row.original.first_name} {row.original.last_name}
              </p>
              <p className="text-muted-foreground text-xs">
                {row.original.email}
              </p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ getValue }) => <span className="text-sm">{getValue()}</span>,
      }),
      columnHelper.display({
        id: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.profile?.phone_number || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("is_verified", {
        header: "Status",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "destructive"}>
            {getValue() ? "Verified" : "Unverified"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "updated_at",
        header: "Last Updated",
        cell: ({ row }) =>
          row.original.profile?.updated_at ? (
            <span className="text-sm">
              {new Date(row.original.profile.updated_at).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )}
            </span>
          ) : (
            <span className="text-sm">—</span>
          ),
      }),
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (verifiedFilter === "all") return users;

    const isVerified = verifiedFilter === "verified";

    return users.filter((user) => user.is_verified === isVerified);
  }, [users, verifiedFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleReset = () => {
    setGlobalFilter("");
    setVerifiedFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
        {(globalFilter || verifiedFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10"
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
