import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { moduleResolver } from "@/lib/schema/module-schema";
import { Layers, Loader2 } from "lucide-react";
import { useUpdateModule } from "@/features/modules/module-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { FormTextField, FormTextareaField } from "@/components/form-fields";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "edit-module": { id: string; title: string; description: string };
  }
}

interface EditModuleDialogProps {
  coursePk: string;
}

export function EditModuleDialog({ coursePk }: EditModuleDialogProps) {
  const modal = useAppModal("edit-module");
  const updateModule = useUpdateModule();

  const form = useForm({
    resolver: moduleResolver,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (modal.isOpen && modal.data) {
      form.reset({
        title: modal.data.title,
        description: modal.data.description ?? "",
      });
    }
  }, [modal.isOpen, modal.data, form]);

  const handleFormSubmit = form.handleSubmit((data) => {
    if (!modal.data) return;

    updateModule.mutateAsync(
      { ...data, coursePk, id: modal.data.id },
      {
        onSuccess() {
          modal.close();
          form.reset();
        },
      }
    );
  });

  const isLoading =
    updateModule.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Edit Module
          </DialogTitle>
          <DialogDescription>Update the module details.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormTextField
              control={form.control}
              name="title"
              label="Module Title"
              placeholder="Enter module title"
              required
              disabled={isLoading}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe what this module covers..."
              disabled={isLoading}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => modal.close()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
