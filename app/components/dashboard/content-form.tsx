import { useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  moduleContentResolver,
  defaultContentValues,
  contentTypeOptions,
  type ModuleContentFormData,
  type ContentType,
} from "@/lib/schema/module-content-schema";
import Loader2 from "~icons/lucide/loader-2";
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
import { orgRoutes } from "@/lib/utils/org-routes";
import {
  NativeInteractiveBuilder,
  type NativeBlock,
} from "./native-interactive-builder";

interface ContentFormProps {
  coursePk: string;
  modulePk: string;
  content?: ModuleContent;
  redirectTo?: string;
  /** Preset the content type for a fresh lesson (used by the curriculum builder's type picker). */
  initialType?: ContentType;
  /** Called after a successful save instead of navigating. When set, the form stays put (e.g. inside a Sheet). */
  onSuccess?: () => void;
  /** Custom cancel handler instead of navigating back (e.g. close a Sheet). */
  onCancel?: () => void;
}

function typeDefaults(type: ContentType): ModuleContentFormData {
  const base = { title: "", order: 0, xapi_enabled: false };

  switch (type) {
    case "video":
      return {
        ...base,
        content_type: "video",
        video_url: "",
        duration_seconds: 0,
      };
    case "file":
      return { ...base, content_type: "file", file_name: "", file: "" };
    case "interactive":
      return {
        ...base,
        content_type: "interactive",
        format: "native",
        package_file: undefined,
        external_url: "",
        definition: {
          version: 2,
          learningObjective: "",
          completionMode: "all",
          passScore: 70,
          showCelebration: true,
          presentationMode: "journey",
          motionIntensity: "playful",
          showProgress: true,
          showPoints: true,
          showStreak: true,
          blocks: [
            {
              id: "starter-accordion",
              type: "accordion",
              title: "Explore this topic",
              instructions: "Open every section to explore the topic.",
              required: true,
              points: 10,
              items: [{ title: "Section 1", content: "" }],
            },
          ],
        },
        xapi_enabled: true,
      };
    default:
      return { ...base, content_type: "text", body: "" };
  }
}

function contentToFormValues(content: ModuleContent): ModuleContentFormData {
  const base = {
    title: content.title,
    order: content.order,
    xapi_enabled: false,
  };

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
    case "interactive":
      return {
        ...base,
        content_type: "interactive",
        format: content.data.format ?? "native",
        package_file: ["html5", "scorm12", "scorm2004"].includes(
          content.data.format ?? ""
        )
          ? "existing"
          : undefined,
        external_url: content.data.external_url ?? "",
        definition: content.data.definition ?? { blocks: [] },
        xapi_enabled: content.data.xapi_enabled ?? true,
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
  initialType,
  onSuccess,
  onCancel,
}: ContentFormProps) {
  const navigate = useNavigate();
  const { orgId = "" } = useParams<{ orgId: string }>();
  const isEditing = !!content;

  const createContent = useCreateModuleContent();
  const updateContent = useUpdateModuleContent();

  const form = useForm({
    resolver: moduleContentResolver,
    defaultValues: content
      ? contentToFormValues(content)
      : initialType
        ? typeDefaults(initialType)
        : defaultContentValues,
  });

  const contentType = useWatch({ control: form.control, name: "content_type" });
  const fileName = useWatch({ control: form.control, name: "file_name" });
  const xapiEnabled = useWatch({
    control: form.control,
    name: "xapi_enabled",
  });
  const interactiveFormat = useWatch({ control: form.control, name: "format" });
  const interactiveDefinition = useWatch({
    control: form.control,
    name: "definition",
  });

  const handleContentTypeChange = useCallback(
    (newType: string) => {
      const currentValues = form.getValues();
      const base = {
        title: currentValues.title,
        order: currentValues.order,
        xapi_enabled: false,
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
        case "interactive":
          form.reset(typeDefaults("interactive"));
          form.setValue("title", base.title);
          form.setValue("order", base.order);
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

      form.setValue("file", file);
    },
    [form]
  );

  const back = redirectTo ?? orgRoutes.courseModules(orgId, coursePk);

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

        if (data.file instanceof File) payload.file = data.file;

        break;
      case "interactive":
        payload.format = data.format;

        if (data.package_file instanceof File)
          payload.package_file = data.package_file;

        payload.external_url = data.external_url;
        payload.definition = data.definition;
        payload.xapi_enabled = data.xapi_enabled;
        break;
    }

    const done = onSuccess ?? (() => navigate(back));

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
            {fileName && (
              <p className="text-muted-foreground text-xs">
                Selected: {fileName}
              </p>
            )}
            {form.formState.errors.file && (
              <p className="text-destructive text-xs">
                {String(
                  form.formState.errors.file.message ?? "A file is required"
                )}
              </p>
            )}
          </div>
        )}

        {contentType === "interactive" && (
          <div className="space-y-5">
            <FormSelectField
              control={form.control}
              name="format"
              label="Interactive format"
              required
              disabled={isLoading || isEditing}
              options={[
                { value: "native", label: "Build in Learning Africa" },
                { value: "scorm12", label: "Import SCORM 1.2" },
                { value: "scorm2004", label: "Import SCORM 2004" },
                { value: "html5", label: "Import HTML5 package" },
                { value: "external", label: "Embed H5P or external activity" },
              ]}
            />

            {interactiveFormat === "native" && (
              <NativeInteractiveBuilder
                value={
                  interactiveDefinition as {
                    version?: 1 | 2;
                    blocks: NativeBlock[];
                  }
                }
                disabled={isLoading}
                onChange={(definition) =>
                  form.setValue("definition", definition, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
            )}

            {["scorm12", "scorm2004", "html5"].includes(
              interactiveFormat ?? ""
            ) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Course package <span className="text-destructive">*</span>
                </label>
                <input
                  type="file"
                  accept=".zip,.scorm,application/zip"
                  disabled={isLoading}
                  onChange={(event) =>
                    form.setValue("package_file", event.target.files?.[0], {
                      shouldValidate: true,
                    })
                  }
                  className="border-input bg-background block w-full rounded-md border px-3 py-2 text-sm"
                />
                <p className="text-muted-foreground text-xs">
                  Upload a package up to 250 MB. SCORM packages must contain
                  imsmanifest.xml; HTML5 packages must contain index.html.
                </p>
              </div>
            )}

            {interactiveFormat === "external" && (
              <FormTextField
                control={form.control}
                name="external_url"
                label="H5P or activity embed URL"
                placeholder="https://..."
                type="url"
                required
                disabled={isLoading}
              />
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={xapiEnabled}
                onChange={(event) =>
                  form.setValue("xapi_enabled", event.target.checked)
                }
              />
              Record learner interactions using xAPI
            </label>
          </div>
        )}

        {/* Sticky action bar — stays in view without scrolling to the bottom */}
        <div className="border-la-rule bg-la-paper sticky bottom-0 z-10 -mx-4 flex justify-end gap-3 border-t px-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel ?? (() => navigate(back))}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? "Save changes" : "Add content"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
