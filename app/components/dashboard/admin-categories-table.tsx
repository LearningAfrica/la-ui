import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { Category } from "@/features/categories/category-queries";
import { ImageIcon, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { ViewCategoryDialog } from "./view-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

interface AdminCategoriesTableProps {
  categories: Category[];
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

const columnHelper = createColumnHelper<Category>();

function CategoryActions({ category }: { category: Category }) {
  const viewModal = useAppModal("view-category");
  const editModal = useAppModal("edit-category");
  const deleteModal = useAppModal("delete-category");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => viewModal.open(category)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editModal.open(category)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => deleteModal.open(category)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CategoryActions category={row.original} />,
  }),
] as ColumnDef<Category, unknown>[];

export function AdminCategoriesTable({
  categories,
  onRefresh,
  isFetching,
  toolbarActions,
}: AdminCategoriesTableProps) {
  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        onRefresh={onRefresh}
        isFetching={isFetching}
        toolbarActions={toolbarActions}
      />
      <ViewCategoryDialog />
      <EditCategoryDialog />
      <DeleteCategoryDialog />
    </>
  );
}
