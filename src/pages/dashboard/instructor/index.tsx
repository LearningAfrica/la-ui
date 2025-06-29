import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const InstructorDashboardPage = lazy(
	() => import('./instructor-dashboard-page'),
);
const InstructorCalendarPage = lazy(() => import('./instructor-calendar-page'));
const InstructorCertificatesPage = lazy(
	() => import('./instructor-certificates-page'),
);
const InstructorCoursesPage = lazy(() => import('./instructor-courses-page'));
const InstructorCreateCoursePage = lazy(
	() => import('./instructor-create-course-page'),
);
/**
 * Instructor dashboard routes
 * @description This file contains the routes for the instructor dashboard section of the application.
 * It includes routes for the instructor dashboard, calendar, and certificates.
 * Each route is associated with a lazy-loaded component for better performance.
 */

export const instructorRouter: RouteObject[] = [
	{
		path: '/dashboard/instructor',
		element: <InstructorDashboardPage />,
	},
	{
		path: '/dashboard/instructor/calendar',
		element: <InstructorCalendarPage />,
	},
	{
		path: '/dashboard/instructor/certificates',
		element: <InstructorCertificatesPage />,
	},
	{
		path: '/dashboard/instructor/courses',
		element: <InstructorCoursesPage />,
	},
	{
		path: '/dashboard/instructor/courses/create',
		element: <InstructorCreateCoursePage />,
	},
];
