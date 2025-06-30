import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { studentRouter } from './students';
import { instructorRouter } from './instructor';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import { adminRouter } from './admin';
import ErrorPage from '@/components/error/error-page';
import NotFoundPage from '@/components/error/not-found-page';

const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'));
export const dashboardRouter: RouteObject = {
  path: '/dashboard',
  element: <DashboardLayout />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <DashboardPage />,
    },
    ...studentRouter,
    ...instructorRouter,
    ...adminRouter,
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
};
