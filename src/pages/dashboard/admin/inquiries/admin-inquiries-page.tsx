import { useState, useMemo } from 'react';
import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AlertCircle, Calendar, Mail } from 'lucide-react';

import { useAdminRequisitions } from '@/lib/features/requisitions/admin-requisitions';
import type { Inquiry } from '@/pages/dashboard/super-admin/dashboard/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function AdminInquiriesPage() {
  const {
    queries: { adminRequisitions },
  } = useAdminRequisitions();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const isLoading = adminRequisitions.isLoading;
  const error = adminRequisitions.error as Error | null;
  const inquiries = useMemo(
    () => (adminRequisitions.data ?? []) as Inquiry[],
    [adminRequisitions.data],
  );

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'company_name',
          header: 'Company',
          cell: ({ row }: { row: { original: Inquiry } }) => (
            <div className="space-y-1">
              <p className="font-medium">{row.original.company_name}</p>
              <p className="text-sm text-muted-foreground">
                {row.original.company_category}
              </p>
            </div>
          ),
        },
        {
          accessorKey: 'status',
          header: 'Status',
          cell: ({ row }: { row: { original: Inquiry } }) => (
            <Badge
              className={STATUS_STYLES[row.original.status] ?? 'bg-muted text-foreground'}
            >
              {row.original.status}
            </Badge>
          ),
        },
        {
          accessorKey: 'created_at',
          header: 'Submitted',
          cell: ({ row }: { row: { original: Inquiry } }) => (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(row.original.created_at)}
            </div>
          ),
        },
        {
          accessorKey: 'reviewed_at',
          header: 'Reviewed',
          cell: ({ row }: { row: { original: Inquiry } }) => (
            <span className="text-sm text-muted-foreground">
              {formatDate(row.original.reviewed_at)}
            </span>
          ),
        },
        {
          id: 'contact',
          header: 'Contact',
          cell: ({ row }: { row: { original: Inquiry } }) => (
            <div className="text-sm text-muted-foreground">
              <div>
                {row.original.user.first_name} {row.original.user.last_name}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <a
                  href={`mailto:${row.original.user.email}`}
                  className="hover:text-primary"
                >
                  {row.original.user.email}
                </a>
              </div>
            </div>
          ),
        },
        {
          accessorKey: 'reason',
          header: 'Reason',
          cell: ({ row }: { row: { original: Inquiry } }) => (
            <div className="max-w-xs truncate" title={row.original.reason}>
              {row.original.reason || '—'}
            </div>
          ),
        },
      ],
    [],
  );

  const table = useReactTable({
    data: inquiries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn: 'includesString',
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Unable to load your inquiries. Please try again later.</p>
        </div>
      );
    }

    if (!table.getRowModel().rows.length) {
      return (
        <div className="text-muted-foreground text-sm">
          You haven't submitted any organization inquiries yet.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-xs">
            <Input
              placeholder="Search by company, contact, or status..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10"
            />
            <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
              🔍
            </span>
          </div>

          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} results
          </div>
        </div>

        <div className="overflow-x-auto">
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
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
          <div>
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
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
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            My Requests
          </CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
