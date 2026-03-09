import { useMemo, useState } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/features/courses/course-queries";
import { Layers } from "lucide-react";
import { Link } from "react-router";
import { DataTable } from "@/components/ui/data-table";

interface AdminCoursesTableProps {
  courses: Course[];
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

const columnHelper = createColumnHelper<Course>();

const columns: ColumnDef<Course, unknown>[] = [
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
        {row.original.category?.category_name ?? "\u2014"}
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
        {row.original.is_premium ? `$${row.original.price}` : "\u2014"}
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
        <span className="text-muted-foreground text-sm">{"\u2014"}</span>
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
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        to={`/client/dashboard/courses/${row.original.id}/modules`}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <Layers className="h-4 w-4" />
        Modules
      </Link>
    ),
  }),
] as ColumnDef<Course, unknown>[];

export function AdminCoursesTable({
  courses,
  onRefresh,
  isFetching,
  toolbarActions,
}: AdminCoursesTableProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredData = useMemo(() => {
    if (typeFilter === "all") return courses;

    const isPremium = typeFilter === "premium";

    return courses.filter((course) => course.is_premium === isPremium);
  }, [courses, typeFilter]);

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      searchPlaceholder="Search courses..."
      emptyMessage="No courses found."
      onRefresh={onRefresh}
      isFetching={isFetching}
      toolbarActions={toolbarActions}
      filterControls={
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
      }
    />
  );
}
