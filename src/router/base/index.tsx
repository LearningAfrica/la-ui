import { type RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { dashboardRouter } from '@/pages/dashboard';

const LandingPage = lazy(() => import('@/pages/base/landing-page'));
const CoursesPage = lazy(() => import('@/pages/base/courses-page'));
const CourseDetailPage = lazy(() => import('@/pages/base/course-detail-page'));
const CoursePreviewPage = lazy(
  () => import('@/pages/base/course-preview-page'),
);
const CategoriesPage = lazy(() => import('@/pages/base/course-categories'));
const LoginPage = lazy(() => import('@/pages/base/login-page'));
const RegisterPage = lazy(() => import('@/pages/base/register-page'));
const InstructorsPage = lazy(() => import('@/pages/base/instructors-page'));
const InstructorDetailPage = lazy(
  () => import('@/pages/base/instructor-detail-page'),
);
const CategoryCoursesPage = lazy(
  () => import('@/pages/base/category-courses-page'),
);

export const baseRouter: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/courses',
    element: <CoursesPage />,
  },
  {
    path: '/courses/:id',
    element: <CourseDetailPage />,
  },
  { path: '/course-preview/:id', element: <CoursePreviewPage /> },
  {
    path: '/categories',
    element: <CategoriesPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/instructors',
    element: <InstructorsPage />,
  },
  {
    path: '/instructors/:id',
    element: <InstructorDetailPage />,
  },
  {
    path: '/categories/:id',
    element: <CategoryCoursesPage />,
  },
  dashboardRouter,
];
