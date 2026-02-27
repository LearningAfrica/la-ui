export const categoryQueryKeys = {
  all: ["categories"] as const,
  categories: (page?: number, search?: string) =>
    [categoryQueryKeys.all, page, search] as const,
  category: (id: string) => ["category", id] as const,
};

export const categoryMutationKeys = {
  createCategory: () => ["createCategory"] as const,
};
