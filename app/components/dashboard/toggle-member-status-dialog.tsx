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
import { useToggleMemberStatus } from "@/features/organizations/organization-mutations";

interface ToggleMemberStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberId: string;
  organizationId: string;
  isActive: boolean;
}

export function ToggleMemberStatusDialog({
  open,
  onOpenChange,
  memberName,
  memberId,
  organizationId,
  isActive,
}: ToggleMemberStatusDialogProps) {
  const action = isActive ? "deactivate" : "activate";
  const toggleMemberStatusMutation = useToggleMemberStatus(organizationId);

  const handleConfirm = async () => {
    await toggleMemberStatusMutation.mutateAsync({
      memberId,
      isActive: !isActive,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "Deactivate" : "Activate"} Member
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {action} <strong>{memberName}</strong>?
            {isActive ? (
              <> They will lose access to the organization and its resources.</>
            ) : (
              <> They will regain access to the organization.</>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={toggleMemberStatusMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={toggleMemberStatusMutation.isPending}
            className={
              isActive
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90"
            }
          >
            {toggleMemberStatusMutation.isPending
              ? `${action.charAt(0).toUpperCase() + action.slice(1)}ing...`
              : action.charAt(0).toUpperCase() + action.slice(1)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
