/**
 * URL builders for organization-scoped routes.
 *
 * The orgId is the source of truth in the URL — Redux is a fast cache only.
 * Reload, share, or open-in-new-tab continue to work because the URL alone
 * carries the org context.
 */
export const orgRoutes = {
  base: (orgId: string) => `/dashboard/org/${orgId}`,
  overview: (orgId: string) => `/dashboard/org/${orgId}`,
  members: (orgId: string) => `/dashboard/org/${orgId}/members`,
  invitations: (orgId: string) => `/dashboard/org/${orgId}/invitations`,
  liveSessions: (orgId: string) => `/dashboard/org/${orgId}/live-sessions`,

  // Courses
  courses: (orgId: string) => `/dashboard/org/${orgId}/courses`,
  courseNew: (orgId: string) => `/dashboard/org/${orgId}/courses/new`,
  courseEdit: (orgId: string, courseId: string) =>
    `/dashboard/org/${orgId}/courses/${courseId}/edit`,
  coursePreview: (orgId: string, courseId: string) =>
    `/dashboard/org/${orgId}/courses/${courseId}/preview`,
  courseModules: (orgId: string, courseId: string) =>
    `/dashboard/org/${orgId}/courses/${courseId}/modules`,
  lesson: (orgId: string, courseId: string, contentId: string) =>
    `/dashboard/org/${orgId}/courses/${courseId}/lessons/${contentId}`,
  contentNew: (orgId: string, courseId: string, moduleId: string) =>
    `/dashboard/org/${orgId}/courses/${courseId}/modules/${moduleId}/contents/new`,
  contentEdit: (
    orgId: string,
    courseId: string,
    moduleId: string,
    contentId: string
  ) =>
    `/dashboard/org/${orgId}/courses/${courseId}/modules/${moduleId}/contents/${contentId}/edit`,
  quizNew: (orgId: string, courseId: string, moduleId: string) =>
    `/dashboard/org/${orgId}/courses/${courseId}/modules/${moduleId}/quizzes/new`,
  quizEdit: (
    orgId: string,
    courseId: string,
    moduleId: string,
    quizId: string
  ) =>
    `/dashboard/org/${orgId}/courses/${courseId}/modules/${moduleId}/quizzes/${quizId}/edit`,

  // Library
  categories: (orgId: string) => `/dashboard/org/${orgId}/categories`,
  myCourses: (orgId: string) => `/dashboard/org/${orgId}/my-courses`,
  myLearning: (orgId: string) => `/dashboard/org/${orgId}/my-learning`,
  certificates: (orgId: string) => `/dashboard/org/${orgId}/certificates`,
} as const;

export const personalRoutes = {
  home: () => "/dashboard",
  invitations: () => "/dashboard/invitations",
  inquiries: () => "/dashboard/inquiries",
  orgs: () => "/dashboard/orgs",
  profile: () => "/dashboard/profile",
} as const;
