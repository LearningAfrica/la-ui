import { useState } from "react";
import {
  type ColumnDef,
  type VisibilityState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, X, RefreshCw, SlidersHorizontal } from "lucide-react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Rendered to the right of search in the toolbar */
  toolbarActions?: React.ReactNode;
  /** Extra filter controls rendered between search and actions */
  filterControls?: React.ReactNode;
  onRefresh?: () => void;
  isFetching?: boolean;
  /** Columns hidden by default (use column id) */
  defaultHiddenColumns?: string[];
  /** Initial page size. Pagination UI hidden when false. Default: 10. */
  pageSize?: number | false;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  toolbarActions,
  filterControls,
  onRefresh,
  isFetching = false,
  defaultHiddenColumns = [],
  pageSize = 10,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => Object.fromEntries(defaultHiddenColumns.map((col) => [col, false]))
  );
  const paginationEnabled = pageSize !== false;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: typeof pageSize === "number" ? pageSize : 10,
  });

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(paginationEnabled
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    state: {
      globalFilter,
      columnVisibility,
      ...(paginationEnabled ? { pagination } : {}),
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: paginationEnabled ? setPagination : undefined,
  });

  const toggleableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide());

  return (
    <div className="space-y-4">
      {/* Toolbar: search + filters + actions */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
          {globalFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setGlobalFilter("")}
              className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filterControls}
          {toggleableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="mr-1 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {toggleableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    className="capitalize"
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {toolbarActions}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          )}
        </div>
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
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationEnabled && table.getFilteredRowModel().rows.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            {(() => {
              const total = table.getFilteredRowModel().rows.length;
              const start =
                total === 0
                  ? 0
                  : pagination.pageIndex * pagination.pageSize + 1;
              const end = Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                total
              );

              return `Showing ${start}-${end} of ${total}`;
            })()}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) =>
                setPagination({ pageIndex: 0, pageSize: Number(value) })
              }
            >
              <SelectTrigger className="h-8 w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <div className="text-muted-foreground text-sm">
              Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
