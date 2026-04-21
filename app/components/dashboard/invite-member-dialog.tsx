import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormAsyncSelectField } from "@/components/form-fields/form-select-field";
import { FormChipField } from "@/components/form-fields/form-chip-field";
import { Button } from "@/components/ui/button";
import { useInviteMember } from "@/features/organizations/organization-mutations";
import { useForm, useWatch } from "react-hook-form";
import { inviteMemberResolver } from "@/lib/schema/invite-schema";
import { Loader2 } from "lucide-react";
import { useEffect, useEffectEvent } from "react";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  organizationId,
}: InviteMemberDialogProps) {
  const inviteMemberMutation = useInviteMember(organizationId);

  const form = useForm({
    resolver: inviteMemberResolver,
    defaultValues: {
      receiver_emails: [],
      role: "learner",
      organization_id: organizationId,
    },
  });

  const organizationIdWatchEffect = useEffectEvent((id: string) => {
    form.setValue("organization_id", id);
  });

  useEffect(() => {
    organizationIdWatchEffect(organizationId);
  }, [organizationId]);

  const emails = useWatch({ control: form.control, name: "receiver_emails" });
  const role = useWatch({ control: form.control, name: "role" });

  const handleSubmit = form.handleSubmit(async (data) => {
    await inviteMemberMutation.mutateAsync(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !inviteMemberMutation.isPending) {
      form.reset();
    }

    onOpenChange(newOpen);
  };
  const isLoading =
    inviteMemberMutation.status === "pending" || form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Invite new members to your organization by entering their email
            addresses and selecting their role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <FormChipField
              control={form.control}
              name="receiver_emails"
              label="Email Addresses"
              placeholder="Enter email addresses (press Enter or comma to add)"
              disabled={inviteMemberMutation.isPending}
              description="You can paste multiple emails separated by commas or semicolons."
            />

            <FormAsyncSelectField
              control={form.control}
              name="role"
              label="Role"
              disabled={isLoading}
              options={[
                { value: "learner", label: "Learner" },
                { value: "instructor", label: "Instructor" },
                { value: "admin", label: "Admin" },
              ]}
            />

            {emails.length > 0 && (
              <div className="bg-muted rounded-md p-3">
                <p className="text-sm">
                  <strong>{emails.length}</strong> member
                  {emails.length !== 1 ? "s" : ""} will be invited as{" "}
                  <strong className="capitalize">{role}</strong>
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={emails.length === 0 || isLoading || !organizationId}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending Invites..." : "Send Invites"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
