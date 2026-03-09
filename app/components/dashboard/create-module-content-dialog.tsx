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
import { moduleContentResolver } from "@/lib/schema/module-content-schema";
import { FileText, Loader2, Plus } from "lucide-react";
import { useCreateModuleContent } from "@/features/module-contents/module-content-mutations";
import { useAppModal } from "@/stores/filters/modal-hooks";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
} from "@/components/form-fields";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-module-content": undefined;
  }
}

interface CreateModuleContentDialogProps {
  coursePk: string;
  modulePk: string;
  children?: React.ReactNode;
}

export function CreateModuleContentDialog({
  coursePk,
  modulePk,
  children,
}: CreateModuleContentDialogProps) {
  const modal = useAppModal("create-module-content");
  const createContent = useCreateModuleContent();

  const form = useForm({
    resolver: moduleContentResolver,
    defaultValues: {
      title: "",
      content_type: "",
      content_url: "",
      order: 0,
    },
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    createContent.mutateAsync(
      { ...data, coursePk, modulePk },
      {
        onSuccess() {
          modal.close();
          form.reset();
        },
      }
    );
  });

  const isLoading =
    createContent.status === "pending" || form.formState.isSubmitting;

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
            Add Content
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add Module Content
          </DialogTitle>
          <DialogDescription>Add new content to this module.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <FormTextField
              control={form.control}
              name="title"
              label="Content Title"
              placeholder="Enter content title"
              required
              disabled={isLoading}
            />

            <FormSelectField
              control={form.control}
              name="content_type"
              label="Content Type"
              placeholder="Select content type"
              required
              disabled={isLoading}
              options={[
                { value: "video", label: "Video" },
                { value: "article", label: "Article" },
                { value: "document", label: "Document" },
                { value: "quiz", label: "Quiz" },
                { value: "assignment", label: "Assignment" },
              ]}
            />

            <FormTextField
              control={form.control}
              name="content_url"
              label="Content URL"
              placeholder="https://..."
              disabled={isLoading}
              type="url"
            />

            <FormNumberField
              control={form.control}
              name="order"
              label="Order"
              placeholder="0"
              disabled={isLoading}
              inputProps={{ min: 0 }}
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
                Add Content
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
