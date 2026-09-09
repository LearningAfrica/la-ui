import { useEffect, useEffectEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormTextareaField,
  FormNumberField,
  FormAsyncSelectField,
  FormDateTimeField,
} from "@/components/form-fields";
import { useCourses } from "@/features/courses/course-queries";
import { useMyOrganizationMembers } from "@/features/organizations/organization-queries";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
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

const DURATION_PRESETS = [30, 45, 60, 90, 120];

function formatDuration(m: number): string {
  if (m < 60) return `${m}m`;

  const h = Math.floor(m / 60);
  const rem = m % 60;

  return rem ? `${h}h ${rem}m` : `${h}h`;
}

function callToFormValues(call: ZoomCall): ZoomCallFormData {
  return {
    topic: call.topic,
    description: call.description ?? "",
    start_time: toDatetimeLocal(call.start_time),
    duration: call.duration,
    course: call.course ?? "none",
    invitee_ids: call.invitees?.map((invitee) => invitee.id) ?? [],
  };
}

export function CreateOrUpdateZoomCallDialog() {
  const modal = useAppModal("create-or-update-zoom-call");
  const createCall = useCreateZoomCall();
  const updateCall = useUpdateZoomCall();
  const { selectedOrganization } = useOrganizationStore();

  const isEditing = !!modal.data?.id;

  const { data: coursesData } = useCourses({ page: 1, pageSize: 100 });
  const {
    data: membersData,
    isLoading: membersLoading,
    error: membersError,
  } = useMyOrganizationMembers({
    organizationId: selectedOrganization?.id ?? "",
    filters: { page: 1, page_size: 100, is_active: true },
  });
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

  const minDateTime = toDatetimeLocal(new Date().toISOString());
  const duration = useWatch({ control: form.control, name: "duration" });
  const inviteeIds =
    useWatch({ control: form.control, name: "invitee_ids" }) ?? [];

  const handleSubmit = form.handleSubmit((data) => {
    const payload = {
      topic: data.topic,
      description: data.description,
      start_time: new Date(data.start_time).toISOString(),
      duration: data.duration,
      course_id: data.course && data.course !== "none" ? data.course : null,
      invitee_ids: data.invitee_ids,
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
    <Sheet
      open={modal.isOpen}
      onOpenChange={(v) => {
        if (!v) modal.close();
      }}
    >
      <SheetContent
        side="right"
        dismissible={false}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Video className="h-5 w-5" />
            </span>
            {isEditing ? "Edit live session" : "Schedule live session"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the session details."
              : "Set up a Zoom session for your organization."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
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
                rows={3}
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

              <FormDateTimeField
                control={form.control}
                name="start_time"
                label="Start time"
                required
                disabled={isLoading}
                min={minDateTime}
                description="Click to pick a date and time."
              />

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {DURATION_PRESETS.map((m) => (
                    <Button
                      key={m}
                      type="button"
                      size="sm"
                      variant={duration === m ? "default" : "outline"}
                      disabled={isLoading}
                      onClick={() =>
                        form.setValue("duration", m, { shouldValidate: true })
                      }
                    >
                      {formatDuration(m)}
                    </Button>
                  ))}
                </div>
                <FormNumberField
                  control={form.control}
                  name="duration"
                  label="Duration (minutes)"
                  placeholder="60"
                  required
                  disabled={isLoading}
                  inputProps={{ min: 5, max: 480 }}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Invite members</p>
                  <p className="text-muted-foreground text-xs">
                    Selected members receive an email and see the session in
                    their calendar.
                  </p>
                </div>
                <div className="max-h-44 space-y-1 overflow-y-auto rounded-md border p-2">
                  {(membersData?.data ?? []).map((member) => {
                    const checked = inviteeIds.includes(member.id);

                    return (
                      <label
                        key={member.id}
                        className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded px-2 py-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isLoading}
                          onChange={(event) => {
                            const next = event.target.checked
                              ? [...inviteeIds, member.id]
                              : inviteeIds.filter((id) => id !== member.id);

                            form.setValue("invitee_ids", next, {
                              shouldDirty: true,
                            });
                          }}
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">
                            {[member.first_name, member.last_name]
                              .filter(Boolean)
                              .join(" ") || member.email}
                          </span>
                          <span className="text-muted-foreground block truncate text-xs">
                            {member.email}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  {membersLoading && (
                    <p className="text-muted-foreground flex items-center justify-center px-2 py-4 text-xs">
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Loading members…
                    </p>
                  )}
                  {membersError && (
                    <p className="text-destructive px-2 py-4 text-center text-xs">
                      Members could not be loaded. Close this form and try
                      again.
                    </p>
                  )}
                  {!membersLoading &&
                    !membersError &&
                    (membersData?.data ?? []).length === 0 && (
                      <p className="text-muted-foreground px-2 py-4 text-center text-xs">
                        No active organization members found.
                      </p>
                    )}
                </div>
              </div>
            </div>

            <SheetFooter className="flex-row justify-end gap-3 border-t">
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
                {isEditing ? "Save changes" : "Schedule"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
