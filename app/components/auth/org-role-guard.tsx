import { Navigate, useParams } from "react-router";
import Loader2 from "~icons/lucide/loader-2";

import {
  useMyOrganizations,
  type OrganizationMembershipRole,
} from "@/features/organizations/organization-queries";
import { orgRoutes, personalRoutes } from "@/lib/utils/org-routes";

interface OrgRoleGuardProps {
  children: React.ReactNode;
  allowedRoles: OrganizationMembershipRole[];
  /** Optional fallback route. Defaults to the org overview. */
  fallback?: string;
}

/**
 * Gates org-scoped routes by membership role.
 *
 * Resolves the user's role from the canonical /organizations/mine response
 * for the org id in the URL — Redux state can be stale after a session swap
 * or a manual URL change, so we treat the server response as the source of
 * truth.
 */
export function OrgRoleGuard({
  children,
  allowedRoles,
  fallback,
}: OrgRoleGuardProps) {
  const { orgId } = useParams<{ orgId: string }>();
  const { data: orgs, isLoading } = useMyOrganizations();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-6">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
        <p className="text-muted-foreground text-sm">
          Checking workspace access…
        </p>
      </div>
    );
  }

  const activeOrg = orgs?.find((o) => o.id === orgId);

  if (!orgId || !activeOrg) {
    return <Navigate to={personalRoutes.orgs()} replace />;
  }

  if (!allowedRoles.includes(activeOrg.role)) {
    return <Navigate to={fallback ?? orgRoutes.overview(orgId)} replace />;
  }

  return <>{children}</>;
}
