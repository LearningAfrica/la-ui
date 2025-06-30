import { useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect to the appropriate dashboard based on user role
      switch (user.role) {
        case 'superAdmin':
          navigate('/dashboard/super-admin');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'instructor':
          navigate('/dashboard/instructor');
          break;
        case 'student':
          navigate('/dashboard/student');
          break;
        default:
          navigate('/dashboard/student');
      }
    } else if (!isLoading && !user) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Redirecting to your dashboard...</h1>
      </div>
    </div>
  );
}
