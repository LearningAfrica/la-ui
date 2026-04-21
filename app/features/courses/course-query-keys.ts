export const courseQueryKeys = {
  all: ["courses"] as const,
  courses: (organizationId?: string, page?: number, search?: string) =>
    [...courseQueryKeys.all, organizationId, page, search] as const,
  course: (id: string) => ["course", id] as const,
  courseContents: (id: string) => ["course", id, "contents"] as const,
  courseMyProgress: (id: string) => ["course", id, "my_progress"] as const,
};

export const courseMutationKeys = {
  createCourse: () => ["createCourse"] as const,
  updateCourse: () => ["updateCourse"] as const,
  deleteCourse: () => ["deleteCourse"] as const,
  enrollCourse: () => ["enrollCourse"] as const,
};
