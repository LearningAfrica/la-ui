import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/features/categories/category-queries";
import { ImageIcon } from "lucide-react";
import moment from "moment";
import { DataTable } from "@/components/ui/data-table";

interface AdminCategoriesTableProps {
  categories: Category[];
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

const columnHelper = createColumnHelper<Category>();

const columns: ColumnDef<Category, unknown>[] = [
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
    cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ getValue }) => (
      <p className="text-muted-foreground max-w-md truncate text-sm">
        {getValue() || "\u2014"}
      </p>
    ),
  }),
  columnHelper.accessor("created", {
    header: "Created",
    cell: ({ getValue }) => (
      <span className="text-sm">{moment(getValue()).fromNow()}</span>
    ),
  }),
] as ColumnDef<Category, unknown>[];

export function AdminCategoriesTable({
  categories,
  onRefresh,
  isFetching,
  toolbarActions,
}: AdminCategoriesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={categories}
      searchPlaceholder="Search categories..."
      emptyMessage="No categories found."
      onRefresh={onRefresh}
      isFetching={isFetching}
      toolbarActions={toolbarActions}
    />
  );
}
