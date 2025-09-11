import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const SuperAdminDashboard = lazy(
  () => import('./dashboard/super-admin-dashboard'),
);
export const superAdminRouter: RouteObject[] = [
  {
    path: '/dashboard/super-admin',
    element: <SuperAdminDashboard />,
  },
];
