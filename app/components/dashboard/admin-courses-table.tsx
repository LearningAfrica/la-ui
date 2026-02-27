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
import type { Course } from "@/features/courses/course-queries";
import { Search, X } from "lucide-react";

interface AdminCoursesTableProps {
  courses: Course[];
}

const columnHelper = createColumnHelper<Course>();

export function AdminCoursesTable({ courses }: AdminCoursesTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "index",
        header: "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
      }),
      columnHelper.accessor("title", {
        header: "Title",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.title}</p>
            <p className="text-muted-foreground max-w-xs truncate text-xs">
              {row.original.overview}
            </p>
          </div>
        ),
      }),
      columnHelper.display({
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.category?.category_name ?? "—"}
          </span>
        ),
      }),
      columnHelper.accessor("is_premium", {
        header: "Type",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "secondary"}>
            {getValue() ? "Premium" : "Free"}
          </Badge>
        ),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.is_premium ? `$${row.original.price}` : "—"}
          </span>
        ),
      }),
      columnHelper.accessor("is_private", {
        header: "Visibility",
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "outline" : "secondary"}>
            {getValue() ? "Private" : "Public"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "tags",
        header: "Tags",
        cell: ({ row }) =>
          row.original.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {row.original.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{row.original.tags.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          ),
      }),
      columnHelper.accessor("created", {
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
    if (typeFilter === "all") return courses;

    const isPremium = typeFilter === "premium";

    return courses.filter((course) => course.is_premium === isPremium);
  }, [courses, typeFilter]);

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
    setTypeFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search courses..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="free">Free</SelectItem>
          </SelectContent>
        </Select>
        {(globalFilter || typeFilter !== "all") && (
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
                  No courses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
