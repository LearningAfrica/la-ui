import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrganizationMembershipRole } from "@/features/organizations/organization-queries";
import { useChangeMemberRole } from "@/features/organizations/organization-mutations";
import { useState } from "react";

interface ChangeMemberRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberId: string;
  organizationId: string;
  currentRole: OrganizationMembershipRole;
}

export function ChangeMemberRoleDialog({
  open,
  onOpenChange,
  memberName,
  memberId,
  organizationId,
  currentRole,
}: ChangeMemberRoleDialogProps) {
  const [selectedRole, setSelectedRole] =
    useState<OrganizationMembershipRole>(currentRole);

  const changeMemberRoleMutation = useChangeMemberRole(organizationId);

  const handleConfirm = async () => {
    if (selectedRole !== currentRole) {
      await changeMemberRoleMutation.mutateAsync({
        memberId,
        role: selectedRole,
      });
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Member Role</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to change the role for <strong>{memberName}</strong>.
            This will affect their permissions and access level.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium">Select New Role</label>
          <Select
            value={selectedRole}
            onValueChange={(value) =>
              setSelectedRole(value as OrganizationMembershipRole)
            }
            disabled={changeMemberRoleMutation.isPending}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
              <SelectItem value="learner">Learner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={changeMemberRoleMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={
              selectedRole === currentRole || changeMemberRoleMutation.isPending
            }
          >
            {changeMemberRoleMutation.isPending ? "Changing..." : "Change Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
