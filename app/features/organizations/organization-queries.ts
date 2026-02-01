import { useQuery } from "@tanstack/react-query";
import { organizationQueryKeys } from "./organization-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export type OrganizationMembershipRole = "admin" | "instructor" | "learner";

export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  type: string;
  country: string;
  member_count: number;
  course_count: number;
  created_at: string;
  is_active: boolean;
}

export interface MyOrganization {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  is_active: boolean;
  date_joined: string;
  role: OrganizationMembershipRole;
  created_at: string;
}

export interface OrganizationMember {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: OrganizationMembershipRole;
  invited_by: string | null;
  date_joined: string;
  is_active: boolean;
}

export interface MembersFilters {
  page?: number;
  page_size?: number;
  role?: OrganizationMembershipRole;
  is_active?: boolean;
  search?: string;
}

export interface MembersQueryParams {
  organizationId: string;
  filters?: MembersFilters;
}

export const useOrganizations = () => {
  return useQuery<Organization[]>({
    queryKey: organizationQueryKeys.organizations(),
    queryFn: async () => {
      const response = await apiClient.get<Organization[]>(
        "/api/organizations/"
      );

      return response.data;
    },
  });
};

// Get user's organizations
export const useMyOrganizations = () => {
  return useQuery({
    queryKey: organizationQueryKeys.myOrganizations(),
    queryFn: async () => {
      const { data } = await apiClient.get<Paginated<MyOrganization>>(
        "/api/organizations/mine/"
      );

      return data?.data;
    },
  });
};

// Get organization members
export const useMyOrganizationMembers = (params: MembersQueryParams) => {
  const { organizationId, filters = {} } = params;
  const { page = 1, page_size = 10, role, is_active, search } = filters;

  return useQuery({
    queryKey: organizationQueryKeys.organizationMembers(
      organizationId,
      filters
    ),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: page_size.toString(),
      });

      if (role) queryParams.append("role", role);

      if (is_active !== undefined)
        queryParams.append("is_active", is_active.toString());

      if (search) queryParams.append("search", search);

      const response = await apiClient.get<Paginated<OrganizationMember>>(
        `/api/organizations/mine/${organizationId}/members/?${queryParams.toString()}`
      );

      return response.data;
    },
    enabled: !!organizationId,
  });
};

export interface OrganizationInvite {
  id: string;
  email: string;
  role: OrganizationMembershipRole;
  status: "pending" | "accepted" | "declined" | "expired";
  invited_at: string;
  invited_by: string;
  expires_at: string;
}

export interface InvitesFilters {
  page?: number;
  page_size?: number;
  role?: OrganizationMembershipRole;
  status?: "pending" | "accepted" | "declined" | "expired";
  search?: string;
}

export interface InvitesQueryParams {
  organizationId: string;
  filters?: InvitesFilters;
}

// Get organization invites
export const useOrganizationInvites = (params: InvitesQueryParams) => {
  const { organizationId, filters = {} } = params;
  const { page = 1, page_size = 10, role, status, search } = filters;

  return useQuery({
    queryKey: organizationQueryKeys.organizationInvites(
      organizationId,
      filters
    ),
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: page_size.toString(),
      });

      if (role) queryParams.append("role", role);

      if (status) queryParams.append("status", status);

      if (search) queryParams.append("search", search);

      if (organizationId) {
        queryParams.append("organization_id", organizationId);
      }

      const response = await apiClient.get<Paginated<OrganizationInvite>>(
        `/api/invite/organization-user-invites/?${queryParams.toString()}`
      );

      return response.data;
    },
    enabled: !!organizationId,
  });
};
