import { useEffect, useEffectEvent, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  moduleContentResolver,
  defaultContentValues,
  contentTypeOptions,
  type ModuleContentFormData,
  type ContentType,
} from "@/lib/schema/module-content-schema";
import { FileText, Loader2 } from "lucide-react";
import {
  useCreateModuleContent,
  useUpdateModuleContent,
} from "@/features/module-contents/module-content-mutations";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import { useAppModal } from "@/stores/filters/modal-hooks";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
} from "@/components/form-fields";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-or-update-content": ModuleContent | undefined;
  }
}

interface CreateOrUpdateContentDialogProps {
  coursePk: string;
  modulePk: string;
}

function contentToFormValues(content: ModuleContent): ModuleContentFormData {
  const base = {
    title: content.title,
    order: content.order,
  };

  switch (content.content_type) {
    case "text":
      return {
        ...base,
        content_type: "text",
        body: content.data.body ?? "",
      };
    case "video":
      return {
        ...base,
        content_type: "video",
        video_url: content.data.video_url ?? "",
        duration_seconds: content.data.duration_seconds ?? 0,
      };
    case "file":
      return {
        ...base,
        content_type: "file",
        file_name: content.data.file_name ?? "",
        file: content.data.file ?? "",
      };
    default:
      return { ...defaultContentValues, ...base };
  }
}

export function CreateOrUpdateContentDialog({
  coursePk,
  modulePk,
}: CreateOrUpdateContentDialogProps) {
  const modal = useAppModal("create-or-update-content");
  const createContent = useCreateModuleContent();
  const updateContent = useUpdateModuleContent();

  const isEditing = !!modal.data?.id;

  const form = useForm({
    resolver: moduleContentResolver,
    defaultValues: defaultContentValues,
  });

  const contentType = useWatch({ control: form.control, name: "content_type" });

  const onDialogOpened = useEffectEvent((data: ModuleContent | undefined) => {
    if (data?.id) {
      form.reset(contentToFormValues(data));
    } else {
      form.reset(defaultContentValues);
    }
  });

  useEffect(() => {
    if (modal.isOpen) {
      onDialogOpened(modal.data ?? undefined);
    }
  }, [modal.isOpen, modal.data]);

  const handleContentTypeChange = useCallback(
    (newType: string) => {
      const currentValues = form.getValues();
      const base = {
        title: currentValues.title,
        order: currentValues.order,
      };

      switch (newType as ContentType) {
        case "text":
          form.reset({ ...base, content_type: "text", body: "" });
          break;
        case "video":
          form.reset({
            ...base,
            content_type: "video",
            video_url: "",
            duration_seconds: 0,
          });
          break;
        case "file":
          form.reset({
            ...base,
            content_type: "file",
            file_name: "",
            file: "",
          });
          break;
      }
    },
    [form]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) return;

      form.setValue("file_name", file.name);

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];

        form.setValue("file", base64);
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const handleFormSubmit = form.handleSubmit((data) => {
    // Strip unused fields before sending
    const payload: Record<string, unknown> = {
      title: data.title,
      content_type: data.content_type,
      order: data.order,
    };

    switch (data.content_type) {
      case "text":
        payload.body = data.body;
        break;
      case "video":
        payload.video_url = data.video_url;
        payload.duration_seconds = data.duration_seconds;
        break;
      case "file":
        payload.file_name = data.file_name;
        payload.file = data.file;
        break;
    }

    if (isEditing && modal.data?.id) {
      updateContent.mutateAsync(
        { ...payload, coursePk, modulePk, id: modal.data.id } as Parameters<
          typeof updateContent.mutateAsync
        >[0],
        {
          onSuccess() {
            modal.close();
            form.reset(defaultContentValues);
          },
        }
      );
    } else {
      createContent.mutateAsync(
        { ...payload, coursePk, modulePk } as Parameters<
          typeof createContent.mutateAsync
        >[0],
        {
          onSuccess() {
            modal.close();
            form.reset(defaultContentValues);
          },
        }
      );
    }
  });

  const isLoading =
    createContent.isPending ||
    updateContent.isPending ||
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
            <FileText className="h-5 w-5" />
            {isEditing ? "Edit Content" : "Add Module Content"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the content details."
              : "Add new content to this module."}
          </DialogDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <FormSelectField
                control={form.control}
                name="content_type"
                label="Content Type"
                placeholder="Select type"
                required
                disabled={isLoading || isEditing}
                options={[...contentTypeOptions]}
                onValueChange={handleContentTypeChange}
              />

              <FormNumberField
                control={form.control}
                name="order"
                label="Order"
                placeholder="0"
                disabled={isLoading}
                inputProps={{ min: 0 }}
              />
            </div>

            {/* Dynamic fields based on content type */}
            {contentType === "text" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Content Body <span className="text-destructive">*</span>
                </label>
                <TiptapEditor
                  content={form.getValues("body") ?? ""}
                  onChange={(html) => form.setValue("body", html)}
                  placeholder="Start writing your content..."
                  disabled={isLoading}
                />
                {form.formState.errors.body && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.body.message}
                  </p>
                )}
              </div>
            )}

            {contentType === "video" && (
              <>
                <FormTextField
                  control={form.control}
                  name="video_url"
                  label="Video URL"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  disabled={isLoading}
                  type="url"
                />
                <FormNumberField
                  control={form.control}
                  name="duration_seconds"
                  label="Duration (seconds)"
                  placeholder="600"
                  required
                  disabled={isLoading}
                  inputProps={{ min: 1 }}
                />
              </>
            )}

            {contentType === "file" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Upload File <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="border-input bg-background file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 block w-full rounded-md border px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-1 file:text-sm file:font-medium"
                  />
                  {form.watch("file_name") && (
                    <p className="text-muted-foreground text-xs">
                      Selected: {form.watch("file_name")}
                    </p>
                  )}
                  {form.formState.errors.file && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.file.message}
                    </p>
                  )}
                </div>
              </>
            )}

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
                {isEditing ? "Save Changes" : "Add Content"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
