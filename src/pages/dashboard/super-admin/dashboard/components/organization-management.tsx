import { useState } from "react"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Activity,
  ArrowUpDown,
  Building,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Search,
} from "lucide-react"

import { useOrganizations } from "../hooks"
import type { Organization } from "../types"
import { OrganizationDetailModal } from "./organization-detail-modal"

const columnHelper = createColumnHelper<Organization>()

const columns: ColumnDef<Organization, unknown>[] = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold"
      >
        Organization
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground">{row.original.type}</div>
      </div>
    ),
  }),
  columnHelper.accessor("contactName", {
    header: "Contact",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("contactName")}</div>
        <div className="text-sm text-muted-foreground">{row.original.contactEmail}</div>
      </div>
    ),
  }),
  columnHelper.accessor("industry", {
    header: "Industry",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("size", {
    header: "Size",
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
  }),
  columnHelper.accessor("activeProjects", {
    header: "Active Projects",
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
        {getValue()}
      </div>
    ),
  }),
  columnHelper.accessor("revenue", {
    header: "Revenue",
    cell: ({ getValue }) => (
      <div className="flex items-center">
        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />${getValue().toLocaleString()}
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge
          className={
            status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : status === "inactive"
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <OrganizationDetailModal organization={row.original} />,
  }),
]

export function OrganizationManagement() {
  const { data: organizations = [], isLoading } = useOrganizations()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: organizations,
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
  })

  const activeOrgs = organizations.filter((org) => org.status === "active").length
  const totalRevenue = organizations.reduce((sum, org) => sum + org.revenue, 0)
  const totalProjects = organizations.reduce((sum, org) => sum + org.activeProjects, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Organizations</p>
                <p className="text-2xl font-bold">{activeOrgs}</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length,
                  )}{" "}
                  of {table.getFilteredRowModel().rows.length} entries
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
  )
}
