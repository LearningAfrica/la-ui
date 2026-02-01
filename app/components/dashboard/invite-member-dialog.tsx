import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChipInput } from "@/components/ui/chip-input";
import { useInviteMember } from "@/features/organizations/organization-mutations";
import { useForm, useWatch } from "react-hook-form";
import { inviteMemberResolver, emailSchema } from "@/lib/schema/invite-schema";
import toast from "@/lib/toast";
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

  const validateEmail = (email: string): boolean => {
    return emailSchema.safeParse(email).success;
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    await inviteMemberMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success({
          message: "Invitations sent successfully.",
          description:
            "The invited members will receive an email with instructions to join the organization.",
        });
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
            <FormField
              control={form.control}
              name="receiver_emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Addresses</FormLabel>
                  <FormControl>
                    <ChipInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter email addresses (press Enter or comma to add)"
                      validate={validateEmail}
                      errorMessage="Please enter a valid email address"
                      disabled={inviteMemberMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    You can paste multiple emails separated by commas,
                    semicolons, or spaces.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="learner">
                        <div>
                          <div className="font-medium">Learner</div>
                          <div className="text-muted-foreground text-xs">
                            Can access and enroll in courses
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="instructor">
                        <div>
                          <div className="font-medium">Instructor</div>
                          <div className="text-muted-foreground text-xs">
                            Can create and manage courses
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div>
                          <div className="font-medium">Admin</div>
                          <div className="text-muted-foreground text-xs">
                            Full access to organization management
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
