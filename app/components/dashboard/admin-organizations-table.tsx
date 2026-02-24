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
import type { Organization } from "@/features/organizations/organization-queries";
import { Search, X } from "lucide-react";

interface AdminOrganizationsTableProps {
  organizations: Organization[];
}

const columnHelper = createColumnHelper<Organization>();

export function AdminOrganizationsTable({
  organizations,
}: AdminOrganizationsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.logo ? (
              <img
                src={row.original.logo}
                alt={row.original.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                {row.original.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium">{row.original.name}</p>
              {row.original.description && (
                <p className="text-muted-foreground text-xs">
                  {row.original.description}
                </p>
              )}
            </div>
          </div>
        ),
      }),

      columnHelper.accessor("is_active", {
        header: "Status",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "destructive"}>
            {getValue() ? "Active" : "Inactive"}
          </Badge>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: ({ getValue }) => (
          <span className="text-sm">
            {new Date(getValue()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      }),
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return organizations;

    const isActive = statusFilter === "active";

    return organizations.filter((org) => org.is_active === isActive);
  }, [organizations, statusFilter]);

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
    setStatusFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search organizations..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {(globalFilter || statusFilter !== "all") && (
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
                  No organizations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
