import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Category } from "@/features/categories/category-queries";
import { Eye, Pencil, Trash2, RefreshCw, FolderOpen } from "lucide-react";
import moment from "moment";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { ViewCategoryDialog } from "./view-category-dialog";
import { CreateOrUpdateCategoryDialog } from "./create-or-update-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { cn } from "@/lib/utils";

interface AdminCategoriesGridProps {
  categories: Category[];
  onRefresh?: () => void;
  isFetching?: boolean;
  toolbarActions?: React.ReactNode;
}

function CategoryCard({ category }: { category: Category }) {
  const viewModal = useAppModal("view-category");
  const editModal = useAppModal("edit-category");
  const deleteModal = useAppModal("delete-category");

  return (
    <Card className="group hover:border-primary/50 flex flex-col overflow-hidden py-0 transition-colors">
      <div className="bg-muted relative aspect-video overflow-hidden">
        {category.category_image ? (
          <img
            src={category.category_image}
            alt={category.category_name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <FolderOpen className="h-10 w-10" />
          </div>
        )}
      </div>
      <CardContent className="flex-1 space-y-2 p-4">
        <h3 className="group-hover:text-primary line-clamp-1 font-semibold transition-colors">
          {category.category_name}
        </h3>
        <p className="text-muted-foreground line-clamp-2 min-h-[2.5rem] text-sm">
          {category.description || "No description provided."}
        </p>
        <p className="text-muted-foreground pt-1 text-xs">
          Created {moment(category.created_at).fromNow()}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 border-t p-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => viewModal.open(category)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => editModal.open(category)}
        >
          <Pencil className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-destructive hover:text-destructive h-9 w-9 shrink-0"
          onClick={() => deleteModal.open(category)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function AdminCategoriesGrid({
  categories,
  onRefresh,
  isFetching,
  toolbarActions,
}: AdminCategoriesGridProps) {
  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("mr-1 h-4 w-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        )}
        {toolbarActions}
      </div>

      {categories.length === 0 ? (
        <Card className="py-16 text-center">
          <FolderOpen className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground text-sm">No categories found.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      <ViewCategoryDialog />
      <CreateOrUpdateCategoryDialog />
      <DeleteCategoryDialog />
    </>
  );
}
