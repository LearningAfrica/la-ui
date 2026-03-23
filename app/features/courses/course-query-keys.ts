export const courseQueryKeys = {
  all: ["courses"] as const,
  courses: (page?: number, search?: string) =>
    [...courseQueryKeys.all, page, search] as const,
  course: (id: string) => ["course", id] as const,
};

export const courseMutationKeys = {
  createCourse: () => ["createCourse"] as const,
  updateCourse: () => ["updateCourse"] as const,
  deleteCourse: () => ["deleteCourse"] as const,
};
