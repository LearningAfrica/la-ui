import { useAuthStore } from "@/stores/auth/auth-store";
import type { SystemUserRole } from "@/features/auth/auth-mutations";
import { Navigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  /** If set, only users with one of these roles can access the route */
  allowedRoles?: SystemUserRole[];
  /** If true, also checks that the user's email is verified */
  requireVerified?: boolean;
}

/**
 * Returns the correct home route for a given system role.
 */
function getRoleHome(role: SystemUserRole | null | undefined): string {
  if (role === "super_admin") return "/system/dashboard";

  return "/dashboard";
}

/**
 * Waits for Zustand persist to finish rehydrating from localStorage.
 * Starts false on server (SSR) and resolves on the client once hydration completes.
 */
function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(() => {
    if (typeof window === "undefined") return false;

    return useAuthStore.persist.hasHydrated();
  });

  useEffect(() => {
    if (hasHydrated) return;

    return useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, [hasHydrated]);

  return hasHydrated;
}

/**
 * Protects routes by checking authentication state and optionally role/verification.
 * Waits for store hydration before making redirect decisions.
 * Redirects unauthenticated users to /sign-in with a redirect back parameter.
 * Redirects unauthorized users (wrong role) to their role-appropriate dashboard.
 * Redirects unverified users to /email-verification-pending.
 */
export function RouteGuard({
  children,
  allowedRoles,
  requireVerified = false,
}: RouteGuardProps) {
  const hasHydrated = useHasHydrated();
  const { isAuthenticated, role, isVerified, user } = useAuthStore();
  const location = useLocation();

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectParam = encodeURIComponent(
      location.pathname + location.search
    );

    return <Navigate to={`/sign-in?redirect=${redirectParam}`} replace />;
  }

  if (requireVerified && !isVerified) {
    const emailParam = user?.email
      ? `?email=${encodeURIComponent(user.email)}`
      : "";

    return <Navigate to={`/email-verification-pending${emailParam}`} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to={getRoleHome(role)} replace />;
    }
  }

  return <>{children}</>;
}
