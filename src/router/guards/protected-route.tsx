import { Navigate, Outlet, useLocation } from 'react-router-dom';

import LoadingFallback from '@/components/loading-fallback';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedRoute() {
  const { is_authenticated, is_loading, hasHydrated } = useAuth();
  const location = useLocation();

  if (!hasHydrated || is_loading) {
    return <LoadingFallback />;
  }

  if (!is_authenticated) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    const search = redirectPath
      ? `?redirect=${encodeURIComponent(redirectPath)}`
      : '';

    return (
      <Navigate
        to={`/login${search}`}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
