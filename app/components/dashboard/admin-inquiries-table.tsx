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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InquiryInterface } from "@/features/inquiries/inquiry-queries";
import { Search, Eye, CheckCircle, XCircle, X } from "lucide-react";

interface AdminInquiriesTableProps {
  inquiries: InquiryInterface[];
  onViewDetails: (inquiry: InquiryInterface) => void;
  onApprove: (inquiry: InquiryInterface) => void;
  onReject: (inquiry: InquiryInterface) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "approved":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "rejected":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

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
          <div>
            <p className="font-medium">{row.original.company_name}</p>
            <p className="text-muted-foreground text-xs">
              {row.original.company_category}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("user", {
        header: "Contact Person",
        cell: ({ row }) => (
          <div>
            <p className="text-sm">
              {row.original.user.first_name} {row.original.user.last_name}
            </p>
            <p className="text-muted-foreground text-xs">
              {row.original.user.email}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("company_size", {
        header: "Size",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.company_size}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <Badge className={getStatusColor(row.original.status)}>
            {row.original.status}
          </Badge>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Submitted",
        cell: ({ row }) => (
          <span className="text-sm">
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.status.toLowerCase() === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove(row.original)}
                  disabled={isApproving || isRejecting}
                  className="text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject(row.original)}
                  disabled={isApproving || isRejecting}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
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
      <div className="flex items-center gap-2">
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
                  No inquiries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
