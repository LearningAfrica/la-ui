import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const InstructorDashboardPage = lazy(
	() => import('./dashboard/instructor-dashboard-page'),
);
const InstructorCalendarPage = lazy(() => import('./calendar/instructor-calendar-page'));
const InstructorCertificatesPage = lazy(
	() => import('./certificates/instructor-certificates-page'),
);
const InstructorCoursesPage = lazy(() => import('./courses/instructor-courses-page'));
const InstructorCreateCoursePage = lazy(
	() => import('./courses/instructor-create-course-page'),
);
const InstructorCourseDetailsPage = lazy(
	() => import('./courses/instructor-course-details-page'),
);
const InstructorCourseDetailsAnalyticsPage = lazy(
	() => import('./courses/instructor-course-details-analytics-page'),
);
const InstructorCourseDetailsCommentsPage = lazy(
	() => import('./courses/instructor-course-details-comments-page'),
);
const InstructorCourseDetalsCurriculumPage = lazy(
	() => import('./courses/instructor-course-details-curriculum-page'),
);
const InstructorCourseDetailsEditPage = lazy(
	() => import('./courses/instructor-course-details-edit-page'),
);
const InstructorCourseDetailsResourcesPage = lazy(
	() => import('./courses/instructor-course-details-resources-page'),
);
const InstructorCourseDetailsStudentsPage = lazy(
	() => import('./courses/instructor-course-details-students-page'),
);
const InstructorDiscussionsPage = lazy(
	() => import('./discussions/instructor-discussions-page'),
);
const InstructorDiscussionDetailsPage = lazy(
	() => import('./discussions/instructor-discussion-details-page'),
);
const InstructorEarningsPage = lazy(() => import('./earnings/instructor-earnings-page'));
const InstructorEarningsSettingsPage = lazy(
	() => import('./earnings/instructor-earnings-settings-page'),
);
const InstructorEarningsTaxInfoPage = lazy(
	() => import('./earnings/instructor-earnings-tax-info-page'),
);
const InstructorStudentsPage = lazy(() => import('./students/instructor-students-page'));
const InstructorStudentDetailsPage = lazy(
	() => import('./students/instructor-student-details-page'),
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
	{
		path: '/dashboard/instructor/courses/:id',
		element: <InstructorCourseDetailsPage />,
	},
	{
		path: '/dashboard/instructor/courses/:id/analytics',
		element: <InstructorCourseDetailsAnalyticsPage />,
	},
	{
		path: '/dashboard/instructor/courses/:id/comments',
		element: <InstructorCourseDetailsCommentsPage />,
	},
	{
		path: '/dashboard/instructor/courses/:id/curriculum',
		element: <InstructorCourseDetalsCurriculumPage />,
	},
	{
		path: ' /dashboard/instructor/courses/:id/edit',
		element: <InstructorCourseDetailsEditPage />,
	},
	{
		path: '/dashboard/instructor/courses/:id/resources',
		element: <InstructorCourseDetailsResourcesPage />,
	},
	{
		path: '/dashboard/instructor/courses/:id/students',
		element: <InstructorCourseDetailsStudentsPage />,
	},
	{
		path: '/dashboard/instructor/discussions',
		element: <InstructorDiscussionsPage />,
	},
	{
		path: '/dashboard/instructor/discussions/:id',
		element: <InstructorDiscussionDetailsPage />,
	},
	{
		path: '/dashboard/instructor/earnings',
		element: <InstructorEarningsPage />,
	},
	{
		path: '/dashboard/instructor/earnings/settings',
		element: <InstructorEarningsSettingsPage />,
	},
	{
		path: '/dashboard/instructor/earnings/tax-info',
		element: <InstructorEarningsTaxInfoPage />,
	},
	{
		path: '/dashboard/instructor/students',
		element: <InstructorStudentsPage />,
	},
	{
		path: '/dashboard/instructor/students/:id',
		element: <InstructorStudentDetailsPage />,
	},
	{
		path: '/dashboard/instructor/*',
		element: <h1>404</h1>,
	},
	// Catch-all route for instructor dashboard
];
