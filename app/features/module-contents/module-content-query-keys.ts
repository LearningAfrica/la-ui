export const moduleContentQueryKeys = {
  all: ["module-contents"] as const,
  contents: (coursePk: string, modulePk: string, page?: number) =>
    [...moduleContentQueryKeys.all, coursePk, modulePk, page] as const,
  content: (coursePk: string, modulePk: string, id: string) =>
    [...moduleContentQueryKeys.all, coursePk, modulePk, id] as const,
};

export const moduleContentMutationKeys = {
  createContent: () => ["createModuleContent"] as const,
  updateContent: () => ["updateModuleContent"] as const,
  deleteContent: () => ["deleteModuleContent"] as const,
};
