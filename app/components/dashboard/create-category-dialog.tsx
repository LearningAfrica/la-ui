import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  type CategoryFormData,
  categoryResolver,
} from "@/lib/schema/category-schema";
import { FolderOpen, ImageIcon, Loader2, Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useCreateCategory } from "@/features/categories/category-mutations";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import { FormTextField, FormTextareaField } from "@/components/form-fields";

interface CreateCategoryDialogProps {
  children?: React.ReactNode;
}

export function CreateCategoryDialog({ children }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedOrganization } = useOrganizationStore();
  const createCategoryMutation = useCreateCategory();

  const form = useForm<CategoryFormData>({
    resolver: categoryResolver,
    defaultValues: {
      organization: selectedOrganization?.id ?? "",
      category_name: "",
      description: "",
      category_image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("category_image", file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("category_image", undefined);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    createCategoryMutation.mutateAsync(
      {
        ...data,
        organization: selectedOrganization?.id ?? data.organization,
      },
      {
        onSuccess() {
          setOpen(false);
          form.reset();
          setImagePreview(null);
        },
      }
    );
  });

  const isLoading =
    createCategoryMutation.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Create Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Add a new category to organize your courses and materials.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormTextField
              control={form.control}
              name="category_name"
              label="Category Name"
              placeholder="Enter category name"
              required
              disabled={isLoading}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe this category..."
              required
              disabled={isLoading}
            />

            {/* Category Image Upload */}
            <FormField
              control={form.control}
              name="category_image"
              render={() => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Category preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-muted-foreground h-8 w-8" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/jpeg,image/png"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Button>
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="text-destructive"
                            disabled={isLoading}
                          >
                            Remove
                          </Button>
                        )}
                        <p className="text-muted-foreground text-xs">
                          JPEG or PNG, max 5MB
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
