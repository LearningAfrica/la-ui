import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const NotFoundPage = lazy(() => import('@/components/error/not-found-page'));
const StudentDashboardPage = lazy(
	() => import('@/pages/dashboard/students/dashboard/student-dashboard-page'),
);
const StudentAchievementsPage = lazy(
	() =>
		import('@/pages/dashboard/students/achievements/student-achievements-page'),
);
const StudentCalendarPage = lazy(
	() => import('@/pages/dashboard/students/calendar/student-calendar-page'),
);
const StudentCertificatesPage = lazy(
	() =>
		import('@/pages/dashboard/students/certificate/student-certificates-page'),
);
const StudentCertificateDetailPage = lazy(
	() =>
		import(
			'@/pages/dashboard/students/certificate/student-certificate-detail-page'
		),
);
const StudentCoursesPage = lazy(
	() => import('@/pages/dashboard/students/courses/student-courses-page'),
);
const StudentCourseDetailPage = lazy(
	() =>
		import('@/pages/dashboard/students/courses/student-course-details-page'),
);
const StudentCourseLessonPage = lazy(
	() => import('@/pages/dashboard/students/courses/student-course-lesson'),
);
const StudentLearningPage = lazy(
	() => import('@/pages/dashboard/students/learning/student-learning-page'),
);

const StudentSupportPage = lazy(
	() => import('@/pages/dashboard/students/support/student-support-page'),
);
const StudentSupportTicketsPage = lazy(
	() =>
		import('@/pages/dashboard/students/support/student-support-tickets-page'),
);
const StudentSupportTicketCreatePage = lazy(
	() =>
		import(
			'@/pages/dashboard/students/support/student-support-tickets-create-page'
		),
);
const StudentSupportTicketDetailPage = lazy(
	() =>
		import(
			'@/pages/dashboard/students/support/student-support-ticket-detail-page'
		),
);
/**
 * Student dashboard routes
 * @description This file contains the routes for the student dashboard section of the application.
 * It includes routes for the student dashboard, achievements, calendar, certificates, and courses.
 * Each route is associated with a lazy-loaded component for better performance.
 */
export const studentRouter: RouteObject[] = [
	{
		path: '/dashboard/student',
		element: <StudentDashboardPage />,
	},
	{
		path: '/dashboard/student/achievements',
		element: <StudentAchievementsPage />,
	},
	{
		path: '/dashboard/student/calendar',
		element: <StudentCalendarPage />,
	},
	{
		path: '/dashboard/student/certificates',
		element: <StudentCertificatesPage />,
	},
	{
		path: '/dashboard/student/certificates/:id',
		element: <StudentCertificateDetailPage />,
	},
	{
		path: '/dashboard/student/courses',
		element: <StudentCoursesPage />,
	},
	{
		path: '/dashboard/student/courses/:id',
		element: <StudentCourseDetailPage />,
	},
	{
		path: '/dashboard/student/courses/:id/lessons/:lessonId',
		element: <StudentCourseLessonPage />,
	},
	{
		path: '/dashboard/student/learning',
		element: <StudentLearningPage />,
	},
	{
		path: '/dashboard/student/support',
		element: <StudentSupportPage />,
	},
	{
		path: '/dashboard/student/support/tickets',
		element: <StudentSupportTicketsPage />,
	},
	{
		path: '/dashboard/student/support/tickets/create',
		element: <StudentSupportTicketCreatePage />,
	},
	{
		path: '/dashboard/student/support/tickets/:id',
		element: <StudentSupportTicketDetailPage />,
	},
	{
		path: '/dashboard/student/*',
		element: <NotFoundPage />,
	},
];
