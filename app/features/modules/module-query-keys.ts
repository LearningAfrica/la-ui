export const moduleQueryKeys = {
  all: ["modules"] as const,
  modules: (
    coursePk: string,
    page?: number,
    pageSize?: number,
    search?: string
  ) => [...moduleQueryKeys.all, coursePk, page, pageSize, search] as const,
  module: (coursePk: string, id: string) =>
    [...moduleQueryKeys.all, coursePk, id] as const,
};

export const moduleMutationKeys = {
  createModule: () => ["createModule"] as const,
  updateModule: () => ["updateModule"] as const,
  deleteModule: () => ["deleteModule"] as const,
};
