export const courseQueryKeys = {
  all: ["courses"] as const,
  courses: (
    organizationId?: string,
    page?: number,
    pageSize?: number,
    search?: string
  ) =>
    [...courseQueryKeys.all, organizationId, page, pageSize, search] as const,
  orgProgress: (organizationId?: string, page?: number, pageSize?: number) =>
    [
      ...courseQueryKeys.all,
      "org_progress",
      organizationId,
      page,
      pageSize,
    ] as const,
  myProgress: (organizationId?: string, page?: number, pageSize?: number) =>
    [
      ...courseQueryKeys.all,
      "my_progress",
      organizationId,
      page,
      pageSize,
    ] as const,
  course: (id: string) => ["course", id] as const,
  courseContents: (id: string) => ["course", id, "contents"] as const,
  courseMyProgress: (id: string) => ["course", id, "my_progress"] as const,
  courseLearnerProgress: (id: string) =>
    ["course", id, "learner_progress"] as const,
};

export const courseMutationKeys = {
  createCourse: () => ["createCourse"] as const,
  updateCourse: () => ["updateCourse"] as const,
  deleteCourse: () => ["deleteCourse"] as const,
  enrollCourse: () => ["enrollCourse"] as const,
  generateCertificate: () => ["generateCertificate"] as const,
};
