import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppModal } from "@/stores/filters/modal-hooks";
import type { Category } from "@/features/categories/category-queries";
import { ImageIcon } from "lucide-react";
import moment from "moment";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "view-category": Category;
  }
}

export function ViewCategoryDialog() {
  const modal = useAppModal("view-category");
  const category = modal.data as Category | null;

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
          <DialogDescription>
            Viewing details for this category.
          </DialogDescription>
        </DialogHeader>

        {category && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {category.category_image ? (
                <img
                  src={category.category_image}
                  alt={category.category_name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-lg">
                  <ImageIcon className="text-muted-foreground h-8 w-8" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">
                  {category.category_name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Created {moment(category.created_at).fromNow()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                {category.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="font-medium">
                  {moment(category.created_at).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated</span>
                <p className="font-medium">
                  {moment(category.updated_at).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
