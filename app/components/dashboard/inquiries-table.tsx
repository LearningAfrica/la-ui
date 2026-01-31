import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { InquiryInterface } from "@/features/inquiries/inquiry-queries";
import moment from "moment";

interface InquiriesTableProps {
  inquiries: InquiryInterface[];
}

const columnHelper = createColumnHelper<InquiryInterface>();

const columns = [
  columnHelper.display({
    id: "index",
    header: "#",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  }),
  columnHelper.accessor("company_name", {
    header: "Organization",
    id: "organization",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("organization")}</div>
        <div className="text-muted-foreground text-sm">
          {row.original.company_category}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("company_size", {
    header: "Size",
  }),

  columnHelper.accessor("company_size", {
    header: "Users",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={
            status === "approved"
              ? "default"
              : status === "rejected"
                ? "destructive"
                : "secondary"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Submitted",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </span>
    ),
  }),
  columnHelper.accessor("reviewed_at", {
    header: "Reviewed",
    cell: ({ row }) => {
      const reviewedAt = row.getValue("reviewed_at") as string | null;

      return reviewedAt ? (
        <span className="text-muted-foreground text-sm">
          {moment(reviewedAt).format("LL")}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
  }),
  columnHelper.accessor("reason", {
    header: "Reason",
  }),
  columnHelper.accessor("company_description", {
    id: "description",
    header: "Description",
    cell: ({ row }) => <p>{row.getValue("description")}</p>,
  }),
];

export function InquiriesTable({ inquiries }: InquiriesTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: inquiries,
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
            placeholder="Search inquiries..."
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
                    No inquiries found.
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
            inquiries.length
          )}{" "}
          of {inquiries.length} inquiries
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
