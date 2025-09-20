import { useState } from 'react';

import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDown,
  Building,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Search,
} from 'lucide-react';

import { useOrganizations } from '../hooks';
import type { Organization } from '../types';
import { OrganizationDetailModal } from './organization-detail-modal';

const columnHelper = createColumnHelper<Organization>();

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-semibold"
      >
        Organization
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.logo_url ? (
          <img
            src={row.original.logo_url}
            alt={row.original.name}
            className="h-10 w-10 rounded-md border object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold">
            {row.original.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium">{row.getValue('name')}</p>
          <p className="text-muted-foreground text-sm">
            {row.original.description
              ? `${row.original.description.slice(0, 40)}${row.original.description.length > 40 ? '…' : ''}`
              : 'No description provided'}
          </p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: ({ getValue }) => (
      <p className="text-muted-foreground max-w-xs text-sm">
        {getValue() ? String(getValue()) : 'No description provided'}
      </p>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <OrganizationDetailModal organization={row.original} />,
  }),
];

export function OrganizationManagement() {
  const { data: organizations = [], isLoading } = useOrganizations();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data: organizations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: 'includesString',
  });

  const organizationsWithLogo = organizations.filter((org) =>
    Boolean(org.logo_url),
  ).length;
  const organizationsWithDescription = organizations.filter((org) =>
    Boolean(org.description),
  ).length;
  const totalFiltered = table.getFilteredRowModel().rows.length;
  const firstRowIndex =
    table.getState().pagination.pageIndex *
    table.getState().pagination.pageSize;
  const showingFrom = totalFiltered ? firstRowIndex + 1 : 0;
  const showingTo = Math.min(
    firstRowIndex + table.getRowModel().rows.length,
    totalFiltered,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Total organizations
                </p>
                <p className="text-2xl font-bold">{organizations.length}</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  With brand assets
                </p>
                <p className="text-2xl font-bold">{organizationsWithLogo}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  With description
                </p>
                <p className="text-2xl font-bold">
                  {organizationsWithDescription}
                </p>
              </div>
              <ArrowUpDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  placeholder="Search organizations..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : (
            <>
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
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
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
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between border-t px-6 py-4">
                <div className="text-muted-foreground text-sm">
                  Showing {showingFrom} to {showingTo} of {totalFiltered}{' '}
                  entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
