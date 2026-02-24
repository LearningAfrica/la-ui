export const courseQueryKeys = {
  courses: (page?: number, search?: string) =>
    ["courses", page, search] as const,
  course: (id: string) => ["course", id] as const,
};

export const courseMutationKeys = {
  createCourse: () => ["createCourse"] as const,
};
