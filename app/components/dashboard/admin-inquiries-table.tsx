import React, { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { InquiryInterface } from "@/features/inquiries/inquiry-queries";
import { getCategoryLabel, getSizeLabel } from "@/lib/constants/company";
import Search from "~icons/lucide/search";
import Eye from "~icons/lucide/eye";
import CheckCircle from "~icons/lucide/check-circle";
import XCircle from "~icons/lucide/x-circle";
import X from "~icons/lucide/x";

interface AdminInquiriesTableProps {
  inquiries: InquiryInterface[];
  onViewDetails: (inquiry: InquiryInterface) => void;
  onApprove: (inquiry: InquiryInterface) => void;
  onReject: (inquiry: InquiryInterface) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

const getStatusPillClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-la-amber/15 text-la-amber";
    case "approved":
      return "bg-la-ok/15 text-la-ok";
    case "rejected":
      return "bg-la-bad/10 text-la-bad";
    default:
      return "bg-la-cream text-la-ink-2";
  }
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        getStatusPillClass(status)
      )}
    >
      {status}
    </span>
  );
}

// Create column helper once outside the component
const columnHelper = createColumnHelper<InquiryInterface>();

export function AdminInquiriesTable({
  inquiries,
  onViewDetails,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}: AdminInquiriesTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      }),
      columnHelper.accessor("company_name", {
        header: "Organization",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className="bg-la-forest-wash text-la-forest font-display flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-bold uppercase"
              aria-hidden
            >
              {row.original.company_name?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-la-ink truncate font-medium">
                {row.original.company_name}
              </p>
              <p className="text-la-muted truncate text-xs">
                {getCategoryLabel(row.original.company_category)}
              </p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("user", {
        header: "Requester",
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-la-ink-2 truncate text-sm font-medium">
              {row.original.user.first_name} {row.original.user.last_name}
            </p>
            <p className="text-la-muted truncate text-xs">
              {row.original.user.email}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("company_size", {
        header: "Size",
        cell: ({ row }) => (
          <span className="text-la-ink-2 text-sm">
            {getSizeLabel(row.original.company_size)}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => <StatusPill status={row.original.status} />,
      }),
      columnHelper.accessor("created_at", {
        header: "Submitted",
        cell: ({ row }) => (
          <span className="text-la-ink-2 text-sm">
            {new Date(row.original.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(row.original)}
              className="text-la-ink-2"
            >
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
            {row.original.status.toLowerCase() === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove(row.original)}
                  disabled={isApproving || isRejecting}
                  className="text-la-ok hover:bg-la-ok/10 hover:text-la-ok"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject(row.original)}
                  disabled={isApproving || isRejecting}
                  className="text-la-bad hover:bg-la-bad/10 hover:text-la-bad"
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Reject
                </Button>
              </>
            )}
          </div>
        ),
      }),
    ],
    [onViewDetails, onApprove, onReject, isApproving, isRejecting]
  );

  // Filter data based on status
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return inquiries;

    return inquiries.filter(
      (inquiry) => inquiry.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [inquiries, statusFilter]);

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
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search inquiries..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
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
      <div className="border-la-rule-strong overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-la-rule bg-la-cream hover:bg-la-cream"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-la-muted text-[0.7rem] font-semibold tracking-[0.1em] uppercase"
                  >
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
                <TableRow key={row.id} className="border-la-rule">
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
                  className="h-40 text-center"
                >
                  <p className="font-display text-la-ink text-lg font-semibold">
                    No inquiries to review
                  </p>
                  <p className="text-la-muted mt-1 text-sm">
                    New onboarding requests will appear here.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
