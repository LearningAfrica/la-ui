import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { studentRouter } from './students';
import { instructorRouter } from './instructor';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { adminRouter } from './admin';
import ErrorPage from '@/components/error/error-page';
import DashboardNotFoundPage from '@/components/error/dashboard-not-found-page';
import { dashboardCommonRoutes } from './common';
import { superAdminRouter } from './super-admin';
import { ProtectedRoute } from '@/router/guards/protected-route';
import { DashboardAccessGuard } from '@/router/guards/dashboard-access-guard';

const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'));
export const dashboardRouter: RouteObject = {
  path: '/dashboard',
  element: <ProtectedRoute />,
  errorElement: <ErrorPage />,
  children: [
    {
      element: <DashboardAccessGuard />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <DashboardPage />,
            },
            ...dashboardCommonRoutes,
            ...studentRouter,
            ...instructorRouter,
            ...adminRouter,
            ...superAdminRouter,
            {
              path: '*',
              element: <DashboardNotFoundPage />,
            },
          ],
        },
      ],
    },
  ],
};
