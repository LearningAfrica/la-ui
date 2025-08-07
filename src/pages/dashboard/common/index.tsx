import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const UserOrgInvitationsPage = lazy(() => import('./org-invitations-page'));

export const dashboardCommonRoutes: RouteObject[] = [
  { path: '/dashboard/invitations', element: <UserOrgInvitationsPage /> },
];
