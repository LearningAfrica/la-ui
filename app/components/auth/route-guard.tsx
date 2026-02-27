import { useAuthStore } from "@/stores/auth/auth-hooks";
import type { SystemUserRole } from "@/features/auth/auth-mutations";
import { Navigate, useLocation } from "react-router";

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
 * Protects routes by checking authentication state and optionally role/verification.
 * Redirects unauthenticated users to /sign-in with a redirect back parameter.
 * Redirects unauthorized users (wrong role) to their role-appropriate dashboard.
 * Redirects unverified users to /email-verification-pending.
 */
export function RouteGuard({
  children,
  allowedRoles,
  requireVerified = false,
}: RouteGuardProps) {
  const { isAuthenticated, role, isVerified, user } = useAuthStore();
  const location = useLocation();

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
