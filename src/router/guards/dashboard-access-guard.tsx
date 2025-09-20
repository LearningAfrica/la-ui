import { useEffect, useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/use-auth';

const ADMIN_PATH = '/dashboard/admin';
const INSTRUCTOR_PATH = '/dashboard/instructor';
const STUDENT_PATH = '/dashboard/student';
const SUPER_ADMIN_PATH = '/dashboard/super-admin';

export function DashboardAccessGuard() {
  const {
    user,
    current_org_id,
    changeCurrentOrganization,
  } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user || !user.organizations?.length) return;

    const hasActiveOrg = user.organizations.some(
      (organization) => organization.id === current_org_id,
    );

    if (!hasActiveOrg) {
      changeCurrentOrganization(user.organizations[0].id);
    }
  }, [user, current_org_id, changeCurrentOrganization]);

  const activeOrgRole = useMemo(() => {
    if (!user?.organizations?.length) return undefined;
    const active = user.organizations.find(
      (organization) => organization.id === current_org_id,
    );
    return active?.role;
  }, [current_org_id, user?.organizations]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_role === 'super_admin') {
    if (!location.pathname.startsWith(SUPER_ADMIN_PATH)) {
      return <Navigate to={SUPER_ADMIN_PATH} replace />;
    }
    return <Outlet />;
  }

  const organizations = user.organizations ?? [];

  if (organizations.length === 0) {
    const fallbackPath = user.can_create_organization
      ? '/dashboard'
      : '/dashboard/invitations';

    // allow admins to review their own inquiries even before joining an organisation
    if (location.pathname === '/dashboard/admin/inquiries') {
      return <Outlet />;
    }

    if (location.pathname.startsWith(SUPER_ADMIN_PATH)) {
      return <Navigate to={fallbackPath} replace />;
    }

    if (
      location.pathname.startsWith(ADMIN_PATH) ||
      location.pathname.startsWith(INSTRUCTOR_PATH) ||
      location.pathname.startsWith(STUDENT_PATH)
    ) {
      return <Navigate to={fallbackPath} replace />;
    }

    if (
      location.pathname !== fallbackPath &&
      location.pathname !== '/dashboard' &&
      location.pathname !== '/dashboard/invitations'
    ) {
      return <Navigate to={fallbackPath} replace />;
    }

    return <Outlet />;
  }

  if (location.pathname.startsWith(SUPER_ADMIN_PATH)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    location.pathname.startsWith(ADMIN_PATH) &&
    activeOrgRole !== 'admin'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    location.pathname.startsWith(INSTRUCTOR_PATH) &&
    activeOrgRole !== 'instructor'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  if (
    location.pathname.startsWith(STUDENT_PATH) &&
    activeOrgRole !== 'learner'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
