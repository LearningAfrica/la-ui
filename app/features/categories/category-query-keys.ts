export const categoryQueryKeys = {
  categories: (page?: number, search?: string) =>
    ["categories", page, search] as const,
  category: (id: string) => ["category", id] as const,
};

export const categoryMutationKeys = {
  createCategory: () => ["createCategory"] as const,
};
