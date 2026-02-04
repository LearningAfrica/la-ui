import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout";
import { useAuthStore } from "@/stores/auth/auth-store";
import { TimerIcon } from "lucide-react";

type InactivityWarningDialogProps = {
  /** Total inactivity time before logout in ms. Defaults to 120000 (2 min). */
  timeoutMs?: number;
  /** Whether to show the warning dialog before logout. Defaults to false. */
  showDialog?: boolean;
};

/**
 * Gate component — renders the inner content only when authenticated.
 * Unmounting destroys all hook state so it starts fresh on next login.
 */
export function InactivityWarningDialog({
  timeoutMs,
  showDialog = false,
}: InactivityWarningDialogProps = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <InactivityWarningContent timeoutMs={timeoutMs} showDialog={showDialog} />
  );
}

function InactivityWarningContent({
  timeoutMs,
  showDialog,
}: InactivityWarningDialogProps) {
  const logout = useAuthStore((s) => s.logout);
  const { showWarning, remainingSeconds, dismissWarning } =
    useInactivityTimeout({ onLogout: logout, timeoutMs });

  if (!showDialog) return null;

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TimerIcon className="text-muted-foreground" />
          </AlertDialogMedia>
          <AlertDialogTitle>Session Expiring</AlertDialogTitle>
          <AlertDialogDescription>
            You have been inactive. You will be logged out in{" "}
            <strong>{remainingSeconds}</strong>{" "}
            {remainingSeconds === 1 ? "second" : "seconds"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={dismissWarning}>
            Stay Logged In
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={logout}>
            Log Out Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
