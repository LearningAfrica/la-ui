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
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormAsyncSelectField,
} from "@/components/form-fields";
import { useCourses } from "@/features/courses/course-queries";
import {
  zoomCallResolver,
  defaultZoomCallValues,
  type ZoomCallFormData,
} from "@/lib/schema/zoom-call-schema";
import Video from "~icons/lucide/video";
import Loader2 from "~icons/lucide/loader-2";
import {
  useCreateZoomCall,
  useUpdateZoomCall,
} from "@/features/zoom-calls/zoom-call-mutations";
import type { ZoomCall } from "@/features/zoom-calls/zoom-call-queries";
import { useAppModal } from "@/stores/filters/modal-hooks";

declare module "@/stores/filters/modal-slice" {
  interface ModalRegistry {
    "create-or-update-zoom-call": ZoomCall | undefined;
  }
}

function toDatetimeLocal(iso: string): string {
  if (!iso) return "";

  const d = new Date(iso);

  if (Number.isNaN(d.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function callToFormValues(call: ZoomCall): ZoomCallFormData {
  return {
    topic: call.topic,
    description: call.description ?? "",
    start_time: toDatetimeLocal(call.start_time),
    duration: call.duration,
    course: call.course ?? "none",
  };
}

export function CreateOrUpdateZoomCallDialog() {
  const modal = useAppModal("create-or-update-zoom-call");
  const createCall = useCreateZoomCall();
  const updateCall = useUpdateZoomCall();

  const isEditing = !!modal.data?.id;

  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const courseOptions = [
    { label: "Org-wide session", value: "none" },
    ...(coursesData?.data?.map((c) => ({ label: c.title, value: c.id })) ?? []),
  ];

  const form = useForm({
    resolver: zoomCallResolver,
    defaultValues: defaultZoomCallValues,
  });

  const onDialogOpened = useEffectEvent((data: ZoomCall | undefined) => {
    if (data?.id) {
      form.reset(callToFormValues(data));
    } else {
      form.reset(defaultZoomCallValues);
    }
  });

  useEffect(() => {
    if (modal.isOpen) {
      onDialogOpened(modal.data ?? undefined);
    }
  }, [modal.isOpen, modal.data]);

  const isLoading =
    createCall.isPending || updateCall.isPending || form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit((data) => {
    const payload = {
      topic: data.topic,
      description: data.description,
      start_time: new Date(data.start_time).toISOString(),
      duration: data.duration,
      course: data.course && data.course !== "none" ? data.course : null,
    };

    if (isEditing && modal.data?.id) {
      updateCall.mutate(
        { ...payload, id: modal.data.id },
        {
          onSuccess() {
            modal.close();
            form.reset(defaultZoomCallValues);
          },
        }
      );
    } else {
      createCall.mutate(payload, {
        onSuccess() {
          modal.close();
          form.reset(defaultZoomCallValues);
        },
      });
    }
  });

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
            <Video className="h-5 w-5" />
            {isEditing ? "Edit Live Session" : "Schedule Live Session"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the session details."
              : "Schedule a Zoom session for your organization."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormTextField
              control={form.control}
              name="topic"
              label="Topic"
              placeholder="e.g. Weekly instructor Q&A"
              required
              disabled={isLoading}
            />

            <FormTextareaField
              control={form.control}
              name="description"
              label="Description"
              placeholder="Optional details about this session"
              disabled={isLoading}
              rows={2}
            />

            <FormAsyncSelectField
              control={form.control}
              name="course"
              label="Course"
              placeholder="Org-wide session"
              disabled={isLoading}
              options={courseOptions}
              description="Attach this session to a course, or leave as org-wide."
            />

            <div className="grid grid-cols-2 gap-4">
              <FormTextField
                control={form.control}
                name="start_time"
                label="Start Time"
                placeholder=""
                required
                disabled={isLoading}
                type="datetime-local"
              />
              <FormNumberField
                control={form.control}
                name="duration"
                label="Duration (min)"
                placeholder="60"
                required
                disabled={isLoading}
                inputProps={{ min: 5, max: 480 }}
              />
            </div>

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
                {isEditing ? "Save Changes" : "Schedule"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
