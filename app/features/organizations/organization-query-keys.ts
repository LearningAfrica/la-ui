// Organizations Query Keys
export const organizationQueryKeys = {
  organizations: () => ["organizations"] as const,
  organization: (id: string) => ["organization", id] as const,
  myOrganizations: () => ["myOrganizations"] as const,
};
