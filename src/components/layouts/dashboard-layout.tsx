import React, { useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Link, Outlet, useLocation } from 'react-router-dom';
import LoadingFallback from '../loading-fallback';
import { Menu, Search, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebarStore } from '@/store/sidebar-store';
import { NotificationsPanel } from '@/components/notifications/notifications-panel';
import { SimpleThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout() {
  const { user, is_loading: isLoading, hasHydrated } = useAuth();
  const pathname = useLocation().pathname;

  // Zustand store for sidebar state
  const {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    setMobileOpen,
  } = useSidebarStore();

  // Check if we're in a lesson page
  const isLessonPage = pathname.includes('/lessons/');

  // Close mobile sidebar when pathname changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Array<{
      label: string;
      href: string;
      icon?: React.ComponentType<{ className?: string }>;
      isLast?: boolean;
    }> = [];

    // Always start with Dashboard
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard', icon: Home });

    let currentPath = '';
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      currentPath += `/${segment}`;

      // Skip the first 'dashboard' segment since we already have it
      if (i === 0) continue;

      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: i === pathSegments.length - 1
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (!hasHydrated || isLoading) {
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
        <Outlet />
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={<LoadingFallback />}>
      {/* Main layout for the dashboard */}
      <div className="flex h-screen bg-background">
        {/* Mobile sidebar overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0 z-50 w-64' : '-translate-x-full lg:translate-x-0 lg:z-40'}`}>
          <DashboardSidebar collapsed={isCollapsed && !isMobileOpen} onClose={() => setMobileOpen(false)} />
        </div>

        {/* Main content area */}
        <div className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* Header */}
          <header className="bg-card border-b border-border px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileOpen(true)}
                  className="p-2 lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapsed}
                  className="p-2 hidden lg:flex"
                >
                  <Menu className="h-4 w-4" />
                </Button>

                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <SimpleThemeToggle />
                <NotificationsPanel />

                <UserNav />
              </div>
            </div>
          </header>

          {/* Breadcrumbs */}
          <div className="bg-card border-b border-border/50 px-4 sm:px-6 py-3">
            <nav className="flex items-center space-x-1 text-sm overflow-x-auto">
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.href} className="flex items-center flex-shrink-0">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />
                  )}
                  {breadcrumb.isLast ? (
                    <span className="text-primary font-medium">
                      {breadcrumb.icon ? <breadcrumb.icon className="h-4 w-4 inline mr-1" /> : null}
                      {breadcrumb.label}
                    </span>
                  ) : (
                    <Link
                      to={breadcrumb.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {breadcrumb.icon ? <breadcrumb.icon className="h-4 w-4 inline mr-1" /> : null}
                      {breadcrumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Page content */}
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </React.Suspense>
  );
}
