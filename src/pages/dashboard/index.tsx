import { lazy } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';
import { studentRouter } from './students';

const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard-page'));
export const dashboardRouter: RouteObject = {
	path: '/dashboard',
	element: <Outlet />,
	children: [
		{
			index: true,
			element: <DashboardPage />,
		},
		...studentRouter,
	],
};
