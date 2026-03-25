import { useEffect, useEffectEvent } from "react";
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
import {
  useCreateModule,
  useUpdateModule,
} from "@/features/modules/module-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { FormTextField, FormTextareaField } from "@/components/form-fields";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-or-update-module":
      | {
          id?: string;
          title?: string;
          description?: string;
        }
      | undefined;
  }
}

interface CreateOrUpdateModuleDialogProps {
  coursePk: string;
}

export function CreateOrUpdateModuleDialog({
  coursePk,
}: CreateOrUpdateModuleDialogProps) {
  const modal = useAppModal("create-or-update-module");
  const createModule = useCreateModule();
  const updateModule = useUpdateModule();

  const isEditing = !!modal.data?.id;

  const form = useForm({
    resolver: moduleResolver,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onDialogOpened = useEffectEvent(
    (
      data: { id?: string; title?: string; description?: string } | undefined
    ) => {
      if (data?.id) {
        form.reset({
          title: data.title ?? "",
          description: data.description ?? "",
        });
      } else {
        form.reset({ title: "", description: "" });
      }
    }
  );

  useEffect(() => {
    if (modal.isOpen) {
      onDialogOpened(modal.data ?? undefined);
    }
  }, [modal.isOpen, modal.data]);

  const handleFormSubmit = form.handleSubmit((data) => {
    if (isEditing && modal.data?.id) {
      updateModule.mutateAsync(
        { ...data, coursePk, id: modal.data.id },
        {
          onSuccess() {
            modal.close();
            form.reset();
          },
        }
      );
    } else {
      createModule.mutateAsync(
        { ...data, coursePk },
        {
          onSuccess() {
            modal.close();
            form.reset();
          },
        }
      );
    }
  });

  const isLoading =
    createModule.isPending ||
    updateModule.isPending ||
    form.formState.isSubmitting;

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
            {isEditing ? "Edit Module" : "Add New Module"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the module details."
              : "Create a new module for this course."}
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
                {isEditing ? "Save Changes" : "Add Module"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
