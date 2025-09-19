import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const SuperAdminAnalyticsPage = lazy(
  () => import('./dashboard/analytics-page'),
);
const SuperAdminInquiriesPage = lazy(
  () => import('./dashboard/inquiries-page'),
);
const SuperAdminOrganizationsPage = lazy(
  () => import('./dashboard/organizations-page'),
);
const SuperAdminRequisitionsPage = lazy(
  () => import('./dashboard/requisitions-page'),
);
export const superAdminRouter: RouteObject[] = [
  {
    path: '/dashboard/super-admin',
    children: [
      {
        index: true,
        element: <SuperAdminAnalyticsPage />,
      },
      {
        path: 'inquiries',
        element: <SuperAdminInquiriesPage />,
      },
      {
        path: 'organizations',
        element: <SuperAdminOrganizationsPage />,
      },
      {
        path: 'requisitions',
        element: <SuperAdminRequisitionsPage />,
      },
    ],
  },
];
