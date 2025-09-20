import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

import OrganizationsPage from './admin/organizations/admin-organizations-page';

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/dashboard/admin',
  instructor: '/dashboard/instructor',
  learner: '/dashboard/student',
};

export default function DashboardPage() {
  const {
    user,
    is_loading: isLoading,
    hasHydrated,
    getCurrentOrganization,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const organizations = user?.organizations ?? [];
  const activeOrganizationRole = getCurrentOrganization?.()?.role ?? null;

  useEffect(() => {
    if (!hasHydrated || isLoading) {
      return;
    }

    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    if (user.user_role === 'super_admin') {
      navigate('/dashboard/super-admin', { replace: true });
      return;
    }

    if (!organizations.length) {
      return;
    }

    if (activeOrganizationRole) {
      const targetPath = ROLE_REDIRECTS[activeOrganizationRole] ?? '/dashboard/student';
      if (!location.pathname.startsWith(targetPath)) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [
    activeOrganizationRole,
    hasHydrated,
    isLoading,
    navigate,
    location,
    organizations.length,
    user,
  ]);

  if (!hasHydrated || isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <p className="text-muted-foreground">Preparing your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.user_role === 'super_admin') {
    return null;
  }

  if (!organizations.length) {
    if (user.can_create_organization) {
      return (
        <div className="space-y-6 p-6 md:p-10">
          <Card>
            <CardHeader>
              <CardTitle>Set up your organization</CardTitle>
              <CardDescription>
                Create your first organization to get started. You can also review the inquiries you&apos;ve already submitted.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link to="/dashboard/invitations">View submitted inquiries</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/inquiry">Submit a new inquiry</Link>
              </Button>
            </CardContent>
          </Card>
          <OrganizationsPage />
        </div>
      );
    }

    return (
      <div className="flex h-full items-center justify-center p-12">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Awaiting organization access
            </CardTitle>
            <CardDescription>
              You&apos;re not currently assigned to an organization. Track your pending invitations or reach out to your administrator for access.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild>
              <Link to="/dashboard/invitations">View invitations &amp; inquiries</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/inquiry">Submit a new inquiry</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">Redirecting to your workspace…</p>
        <p className="text-muted-foreground text-sm">
          If nothing happens, choose a destination from the sidebar.
        </p>
      </div>
    </div>
  );
}
