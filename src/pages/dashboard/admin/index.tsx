// import NotFoundPage from '@/components/error/not-found-page';
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
const NotFoundPage = lazy(() => import('@/components/error/not-found-page'));
const AdminDashboardPage = lazy(
	() => import('./dashboard/admin-dashboard-page'),
);
const AdminOrganizationsPage = lazy(
	() => import('./organizations/admin-organizations-page'),
);
const AdminOrganizationDetailPage = lazy(
	() => import('./organizations/admin-organization-detail-page'),
);
const AdminOrganizationDetailSettingsPage = lazy(
	() => import('./organizations/admin-organization-detail-settings-page'),
);
const AdminApprovalsPage = lazy(
	() => import('./approvals/admin-approvals-page'),
);
const AdminApprovalDetailsPage = lazy(
	() => import('./approvals/admin-approval-details-page'),
);

const AdminCalendarPage = lazy(() => import('./calendar/admin-calendar-page'));
const AdminCategoriesPage = lazy(
	() => import('./categories/admin-categories-page'),
);
const AdminCategoryCreatePage = lazy(
	() => import('./categories/admin-categories-create-page'),
);
const AdminCategoryEditPage = lazy(
	() => import('./categories/admin-categories-edit-page'),
);
const AdminCategoryDetailsPage = lazy(
	() => import('./categories/admin-category-details-page'),
);
const AdminCertificatesPage = lazy(
	() => import('./certificates/admin-certificates-page'),
);
const AdminCertificateDetailsPage = lazy(
	() => import('./certificates/admin-certificate-details-page'),
);
const AdminCertificateCreatePage = lazy(
	() => import('./certificates/admin-certificates-create-page'),
);
const AdminCertificateDetailsEditPage = lazy(
	() => import('./certificates/admin-certificate-details-edit-page'),
);
const AdminCoursesPage = lazy(() => import('./courses/admin-courses-page'));

const AdminCourseStudentsAddPage = lazy(
	() => import('./courses/admin-course-students-add-page'),
);
const AdminCourseDetailsPage = lazy(
	() => import('./courses/admin-course-details-page'),
);
const AdminDiscussionsPage = lazy(
	() => import('./discussions/admin-discussions-page'),
);
const AdminDiscussionDetailsPage = lazy(
	() => import('./discussions/admin-discussion-details-page'),
);
const AdminInstructorsPage = lazy(
	() => import('./instructors/admin-instructors-page'),
);
const AdminInstructorDetailsPage = lazy(
	() => import('./instructors/admin-instructor-details-page'),
);
const AdminInstructorsAddPage = lazy(
	() => import('./instructors/admin-instructors-add-page'),
);

const AdminLearningPage = lazy(() => import('./learning/admin-learning-page'));
const AdminReportsPage = lazy(() => import('./reports/admin-reports-page'));
const AdminReportDetailsPage = lazy(
	() => import('./reports/admin-report-details-page'),
);
const AdminReviewsPage = lazy(() => import('./reviews/admin-reviews-page'));
const AdminReviewDetailsPage = lazy(
	() => import('./reviews/admin-review-details-page'),
);
const AdminSupportPage = lazy(() => import('./support/admin-support-page'));
const AdminSupportCategoriesPage = lazy(
	() => import('./support/admin-support-categories-page'),
);
const AdminSupportCategoryDetailsPage = lazy(
	() => import('./support/admin-support-category-details-page'),
);
const AdminSupportCategoriesCreatePage = lazy(
	() => import('./support/admin-support-categories-create-page'),
);
const AdminSupportCategoriesManagePage = lazy(
	() => import('./support/admin-support-categories-manage-page'),
);
const AdminSupportCategoryDetailsEditPage = lazy(
	() => import('./support/admin-support-category-details-edit-page'),
);
const AdminSupportArticlesPage = lazy(
	() => import('./support/admin-support-articles-page'),
);
const AdminSupportArticleDetailsPage = lazy(
	() => import('./support/admin-support-article-details-view-page'),
);
const AdminSupportArticleDetailsSlugPage = lazy(
	() => import('./support/admin-support-article-details-slug-page'),
);
const AdminSupportArticleDetailsSlugEditPage = lazy(
	() => import('./support/admin-support-article-details-slug-edit-page'),
);

const AdminSupportArticleDetailsEditPage = lazy(
	() => import('./support/admin-support-article-details-edit-page'),
);
const AdminSupportArticlesCreatePage = lazy(
	() => import('./support/admin-support-articles-create-page'),
);
const AdminStudentsPage = lazy(() => import('./students/admin-students-page'));
const AdminStudentDetailsPage = lazy(
	() => import('./students/admin-student-details-page'),
);
const AdminStudentsAddPage = lazy(
	() => import('./students/admin-students-add-page'),
);
const AdminStudentDetailsEditPage = lazy(
	() => import('./students/admin-student-details-edit-page'),
);
/**
 * Admin Router
 * This router handles all admin-related routes.
 * It includes the admin dashboard, organizations management,
 * and organization detail pages.
 * @see https://reactrouter.com/en/main/start/overview
 */
export const adminRouter: RouteObject[] = [
	{
		path: '/dashboard/admin',
		element: <AdminDashboardPage />,
	},
	{
		path: '/dashboard/admin/organizations',
		element: <AdminOrganizationsPage />,
	},
	{
		path: '/dashboard/admin/organizations/:id',
		element: <AdminOrganizationDetailPage />,
	},
	{
		path: '/dashboard/admin/organizations/:id/settings',
		element: <AdminOrganizationDetailSettingsPage />,
	},
	{
		path: '/dashboard/admin/approvals',
		element: <AdminApprovalsPage />,
	},
	{
		path: '/dashboard/admin/approvals/:id',
		element: <AdminApprovalDetailsPage />,
	},
	{
		path: '/dashboard/admin/calendar',
		element: <AdminCalendarPage />,
	},
	{
		path: '/dashboard/admin/categories',
		element: <AdminCategoriesPage />,
	},
	{
		path: '/dashboard/admin/categories/create',
		element: <AdminCategoryCreatePage />,
	},
	{
		path: '/dashboard/admin/categories/:id',
		element: <AdminCategoryDetailsPage />,
	},
	{
		path: '/dashboard/admin/categories/:id/edit',
		element: <AdminCategoryEditPage />,
	},

	{
		path: '/dashboard/admin/certificates',
		element: <AdminCertificatesPage />,
	},
	{
		path: '/dashboard/admin/certificates/create',
		element: <AdminCertificateCreatePage />,
	},
	{
		path: '/dashboard/admin/certificates/:id',
		element: <AdminCertificateDetailsPage />,
	},
	{
		path: '/dashboard/admin/certificates/:id/edit',
		element: <AdminCertificateDetailsEditPage />,
	},
	{
		path: '/dashboard/admin/courses',
		element: <AdminCoursesPage />,
	},
	{
		path: '/dashboard/admin/courses/:id',
		element: <AdminCourseDetailsPage />,
	},
	{
		path: '/dashboard/admin/courses/:id/students/add',
		element: <AdminCourseStudentsAddPage />,
	},
	{
		path: '/dashboard/admin/discussions',
		element: <AdminDiscussionsPage />,
	},
	{
		path: '/dashboard/admin/discussions/:id',
		element: <AdminDiscussionDetailsPage />,
	},
	{
		path: '/dashboard/admin/instructors',
		element: <AdminInstructorsPage />,
	},
	{
		path: '/dashboard/admin/instructors/:id',
		element: <AdminInstructorDetailsPage />,
	},
	{
		path: '/dashboard/admin/instructors/add',
		element: <AdminInstructorsAddPage />,
	},
	{
		path: '/dashboard/admin/learning',
		element: <AdminLearningPage />,
	},
	{
		path: '/dashboard/admin/reports',
		element: <AdminReportsPage />,
	},
	{
		path: '/dashboard/admin/reports/:id',
		element: <AdminReportDetailsPage />,
	},
	{
		path: '/dashboard/admin/reviews',
		element: <AdminReviewsPage />,
	},
	{
		path: '/dashboard/admin/reviews/:id',
		element: <AdminReviewDetailsPage />,
	},
	{
		path: '/dashboard/admin/support',
		element: <AdminSupportPage />,
	},
	{
		path: '/dashboard/admin/support/categories',
		element: <AdminSupportCategoriesPage />,
	},
	{
		path: '/dashboard/admin/support/categories/create',
		element: <AdminSupportCategoriesCreatePage />,
	},
	{
		path: '/dashboard/admin/support/categories/:id',
		element: <AdminSupportCategoryDetailsPage />,
	},
	{
		path: '/dashboard/admin/support/categories/:id/manage',
		element: <AdminSupportCategoriesManagePage />,
	},
	{
		path: '/dashboard/admin/support/categories/:id/edit',
		element: <AdminSupportCategoryDetailsEditPage />,
	},
	{
		path: '/dashboard/admin/support/articles',
		element: <AdminSupportArticlesPage />,
	},
	{
		path: '/dashboard/admin/support/articles/create',
		element: <AdminSupportArticlesCreatePage />,
	},
	{
		path: '/dashboard/admin/support/articles/:id',
		element: <AdminSupportArticleDetailsPage />,
	},
	{
		path: '/dashboard/admin/support/articles/edit/:id',
		element: <AdminSupportArticleDetailsEditPage />,
	},
	{
		path: '/dashboard/admin/support/articles/:slug',
		element: <AdminSupportArticleDetailsSlugPage />,
	},
	{
		path: '/dashboard/admin/support/articles/:slug/edit',
		element: <AdminSupportArticleDetailsSlugEditPage />,
	},
	{
		path: '/dashboard/admin/students',
		element: <AdminStudentsPage />,
	},
	{
		path: '/dashboard/admin/students/:id',
		element: <AdminStudentDetailsPage />,
	},
	{
		path: '/dashboard/admin/students/:id/edit',
		element: <AdminStudentDetailsEditPage />,
	},
	{
		path: '/dashboard/admin/students/add',
		element: <AdminStudentsAddPage />,
	},
	{
		path: '/dashboard/admin/*',
		element: <NotFoundPage />,
	},
];
