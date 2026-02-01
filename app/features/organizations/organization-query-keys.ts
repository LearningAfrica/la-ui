import type {
  MembersQueryParams,
  InvitesQueryParams,
} from "./organization-queries";

// Organizations Query Keys
export const organizationQueryKeys = {
  organizations: () => ["organizations"] as const,
  organization: (id: string) => ["organization", id] as const,
  myOrganizations: () => ["myOrganizations"] as const,
  organizationMembers: (
    organizationId: string,
    params?: MembersQueryParams["filters"]
  ) => ["organizationMembers", organizationId, params] as const,
  organizationInvites: (
    organizationId: string,
    params?: InvitesQueryParams["filters"]
  ) => ["organizationInvites", organizationId, params] as const,
};

// Organization Mutation Keys
export const organizationMutationKeys = {
  createOrganization: () => ["createOrganization"] as const,
  changeMemberRole: (organizationId: string) =>
    ["changeMemberRole", organizationId] as const,
  toggleMemberStatus: (organizationId: string) =>
    ["toggleMemberStatus", organizationId] as const,
  inviteMember: (organizationId: string) =>
    ["inviteMember", organizationId] as const,
};
