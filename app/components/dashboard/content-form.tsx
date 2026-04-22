import { useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  moduleContentResolver,
  defaultContentValues,
  contentTypeOptions,
  type ModuleContentFormData,
  type ContentType,
} from "@/lib/schema/module-content-schema";
import { Loader2 } from "lucide-react";
import {
  useCreateModuleContent,
  useUpdateModuleContent,
} from "@/features/module-contents/module-content-mutations";
import type { ModuleContent } from "@/features/module-contents/module-content-queries";
import { FormTiptapField } from "@/components/form-fields/form-tiptap-field";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
} from "@/components/form-fields";

interface ContentFormProps {
  coursePk: string;
  modulePk: string;
  content?: ModuleContent;
  redirectTo?: string;
}

function contentToFormValues(content: ModuleContent): ModuleContentFormData {
  const base = { title: content.title, order: content.order };

  switch (content.content_type) {
    case "text":
      return { ...base, content_type: "text", body: content.data.body ?? "" };
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

export function ContentForm({
  coursePk,
  modulePk,
  content,
  redirectTo,
}: ContentFormProps) {
  const navigate = useNavigate();
  const isEditing = !!content;

  const createContent = useCreateModuleContent();
  const updateContent = useUpdateModuleContent();

  const form = useForm({
    resolver: moduleContentResolver,
    defaultValues: content
      ? contentToFormValues(content)
      : defaultContentValues,
  });

  const contentType = useWatch({ control: form.control, name: "content_type" });

  const handleContentTypeChange = useCallback(
    (newType: string) => {
      const currentValues = form.getValues();
      const base = { title: currentValues.title, order: currentValues.order };

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

  const back = redirectTo ?? `/client/dashboard/courses/${coursePk}/modules`;

  const handleFormSubmit = form.handleSubmit((data) => {
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

    const done = () => navigate(back);

    if (isEditing && content) {
      return updateContent.mutateAsync(
        { ...payload, coursePk, modulePk, id: content.id } as Parameters<
          typeof updateContent.mutateAsync
        >[0],
        { onSuccess: done }
      );
    }

    return createContent.mutateAsync(
      { ...payload, coursePk, modulePk } as Parameters<
        typeof createContent.mutateAsync
      >[0],
      { onSuccess: done }
    );
  });

  const isLoading =
    createContent.isPending ||
    updateContent.isPending ||
    form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormTextField
          control={form.control}
          name="title"
          label="Content Title"
          placeholder="Enter content title"
          required
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        {contentType === "text" && (
          <FormTiptapField
            control={form.control}
            name="body"
            label="Content Body"
            placeholder="Start writing your content..."
            required
            disabled={isLoading}
          />
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
        )}

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(back)}
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
  );
}
