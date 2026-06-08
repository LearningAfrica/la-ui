export const statsQueryKeys = {
  all: ["stats"] as const,
  users: () => [...statsQueryKeys.all, "users"] as const,
  organizations: () => [...statsQueryKeys.all, "organizations"] as const,
};
