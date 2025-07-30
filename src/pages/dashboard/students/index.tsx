import React from 'react';
import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import DashboardNotFoundPage from '@/components/error/dashboard-not-found-page';

const StudentDashboardPage = lazy(() => import('./dashboard/student-dashboard-page'));
const StudentCoursesPage = lazy(() => import('./courses/student-courses-page'));
const StudentCourseDetailPage = lazy(() => import('./courses/student-course-details-page'));
const StudentCourseLessonPage = lazy(() => import('./courses/student-course-lesson'));
const StudentLearningPage = lazy(() => import('./learning/student-learning-page'));
const StudentAchievementsPage = lazy(() => import('./achievements/student-achievements-page'));
const StudentAchievementsLoadingPage = lazy(() => import('./achievements/student-achievements-loading'));
const StudentCertificatesPage = lazy(() => import('./certificate/student-certificates-page'));
const StudentCertificateDetailPage = lazy(() => import('./certificate/student-certificate-detail-page'));
const StudentCertificateLoadingPage = lazy(() => import('./certificate/student-certificate-loading'));
const StudentCalendarPage = lazy(() => import('./calendar/student-calendar-page'));
const StudentSupportPage = lazy(() => import('./support/student-support-page'));
const StudentSupportLoadingPage = lazy(() => import('./support/student-support-loading'));
const StudentSupportTicketDetailPage = lazy(() => import('./support/student-support-ticket-detail-page'));
const StudentLiveSessionsPage = lazy(() => import('./live-sessions/student-live-sessions-page'));
const StudentMeetingPage = lazy(() => import('./meeting/student-meeting-page'));

export const studentRouter: RouteObject[] = [
  {
    path: '/dashboard/student',
    children: [
      {
        index: true,
        element: React.createElement(StudentDashboardPage),
      },
      {
        path: 'courses',
        element: React.createElement(StudentCoursesPage),
      },
      {
        path: 'courses/:courseId',
        element: React.createElement(StudentCourseDetailPage),
      },
      {
        path: 'courses/:courseId/lessons/:lessonId',
        element: React.createElement(StudentCourseLessonPage),
      },
      {
        path: 'learning',
        element: React.createElement(StudentLearningPage),
      },
      {
        path: 'achievements',
        element: React.createElement(StudentAchievementsPage),
      },
      {
        path: 'achievements-loading',
        element: React.createElement(StudentAchievementsLoadingPage),
      },
      {
        path: 'certificates',
        element: React.createElement(StudentCertificatesPage),
      },
      {
        path: 'certificates/:certificateId',
        element: React.createElement(StudentCertificateDetailPage),
      },
      {
        path: 'certificate-loading',
        element: React.createElement(StudentCertificateLoadingPage),
      },
      {
        path: 'calendar',
        element: React.createElement(StudentCalendarPage),
      },
      {
        path: 'support',
        element: React.createElement(StudentSupportPage),
      },
      {
        path: 'support-loading',
        element: React.createElement(StudentSupportLoadingPage),
      },
      {
        path: 'support/tickets/:ticketId',
        element: React.createElement(StudentSupportTicketDetailPage),
      },
      {
        path: 'live-sessions',
        element: React.createElement(StudentLiveSessionsPage),
      },
      {
        path: 'meeting/:meetingId',
        element: React.createElement(StudentMeetingPage),
      },
      {
        path: '*',
        element: React.createElement(DashboardNotFoundPage),
      },
    ],
  },
];
