import React, { useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import LoadingFallback from '../loading-fallback';

export default function DashboardLayout() {
  const { user, is_loading: isLoading } = useAuth();
  const router = useNavigate();
  const pathname = useLocation().pathname;

  // Check if we're in a lesson page
  const isLessonPage = pathname.includes('/lessons/');

  useEffect(() => {
    if (!isLoading && !user) {
      router('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold">Authentication Required</h2>
          <p className="mb-4">Please log in to access your dashboard.</p>
          <Link
            to="/login"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // If we're in a lesson page, don't show the dashboard sidebar
  if (isLessonPage) {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        <Outlet />;
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      {/* Main layout for the dashboard */}
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </React.Suspense>
  );
}
