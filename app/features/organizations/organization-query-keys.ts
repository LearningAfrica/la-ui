import type { MembersQueryParams } from "./organization-queries";

// Organizations Query Keys
export const organizationQueryKeys = {
  organizations: () => ["organizations"] as const,
  organization: (id: string) => ["organization", id] as const,
  myOrganizations: () => ["myOrganizations"] as const,
  organizationMembers: (
    organizationId: string,
    params?: MembersQueryParams["filters"]
  ) => ["organizationMembers", organizationId, params] as const,
};
