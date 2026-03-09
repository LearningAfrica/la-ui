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
import { Form } from "@/components/ui/form";
import { moduleResolver } from "@/lib/schema/module-schema";
import { Layers, Loader2, Plus } from "lucide-react";
import { useCreateModule } from "@/features/modules/module-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { FormTextField, FormTextareaField } from "@/components/form-fields";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-module": undefined;
  }
}

interface CreateModuleDialogProps {
  coursePk: string;
  children?: React.ReactNode;
}

export function CreateModuleDialog({
  coursePk,
  children,
}: CreateModuleDialogProps) {
  const modal = useAppModal("create-module");
  const createModule = useCreateModule();

  const form = useForm({
    resolver: moduleResolver,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    createModule.mutateAsync(
      { ...data, coursePk },
      {
        onSuccess() {
          modal.close();
          form.reset();
        },
      }
    );
  });

  const isLoading =
    createModule.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (v) modal.open();
        else modal.close();
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Module
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Add New Module
          </DialogTitle>
          <DialogDescription>
            Create a new module for this course.
          </DialogDescription>
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
                Add Module
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
