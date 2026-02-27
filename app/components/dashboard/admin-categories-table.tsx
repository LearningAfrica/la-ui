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
import type { Category } from "@/features/categories/category-queries";
import { ImageIcon, Search, X } from "lucide-react";
import moment from "moment";

interface AdminCategoriesTableProps {
  categories: Category[];
}

const columnHelper = createColumnHelper<Category>();

export function AdminCategoriesTable({
  categories,
}: AdminCategoriesTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      }),
      columnHelper.accessor("category_image_url", {
        header: "Image",
        cell: ({ getValue }) =>
          getValue() ? (
            <img
              src={getValue()!}
              alt="Category"
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
              <ImageIcon className="text-muted-foreground h-4 w-4" />
            </div>
          ),
      }),
      columnHelper.accessor("category_name", {
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ getValue }) => (
          <p className="text-muted-foreground max-w-md truncate text-sm">
            {getValue() || "—"}
          </p>
        ),
      }),
      columnHelper.accessor("created", {
        header: "Created",
        cell: ({ getValue }) => (
          <span className="text-sm">{moment(getValue()).fromNow()}</span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: categories,
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
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search categories..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        {globalFilter && (
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
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
