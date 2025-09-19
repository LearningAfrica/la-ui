import { useEffect, useMemo } from 'react';
// import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@/domains/organizations/use-organizations';
import OrganizationsPage from './admin/organizations/admin-organizations-page';

export default function DashboardPage() {
  const {
    user,
    is_loading: isLoading,
    current_org_id,
    getCurrentOrganization,
  } = useAuth();
  const userHasOrgs = useMemo(() => {
    return Array.isArray(user?.organizations) && user.organizations.length > 0;
  }, [user]);
  const currentOrgRole = useMemo(() => {
    const currentOrg = getCurrentOrganization();
    return currentOrg?.role;
  }, [current_org_id]);
  const navigate = useNavigate();
  const {} = useOrganization();

  useEffect(() => {
    if (!isLoading && user) {
      if (!userHasOrgs) {
        if (user.user_role === 'super_admin') {
          navigate('/dashboard/super-admin');
          return;
        }
      }
      console.log({ role: user.user_role });

      // Redirect to the appropriate dashboard based on user role
      switch (currentOrgRole) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'instructor':
          navigate('/dashboard/instructor');
          break;
        case 'learner':
          navigate('/dashboard/student');
          break;
        default:
          navigate('/dashboard/student');
      }
    } else if (!isLoading && !user) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, isLoading, navigate, userHasOrgs]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (Array.isArray(user?.organizations) && user.organizations.length === 0) {
    // check if user can create organization
    // If can create organization, show create organization page
    return <OrganizationsPage />;
    // else show message to contact admin
  }
  return (
    <div className="flex h-screen">
      {/* <DashboardSidebar /> */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Redirecting to your dashboard...</h1>
      </div>
    </div>
  );
}
