export const userQueryKeys = {
  users: (page?: number, search?: string) => ["users", page, search] as const,
  user: (id: string) => ["user", id] as const,
};
