import { useQuery } from "@tanstack/react-query";
import { organizationQueryKeys } from "./organization-query-keys";
import { apiClient } from "@/lib/api";

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
  return useQuery<MyOrganization[]>({
    queryKey: organizationQueryKeys.myOrganizations(),
    queryFn: async () => {
      const response = await apiClient.get<MyOrganization[]>(
        "/api/organizations/mine/"
      );

      return response.data;
    },
  });
};
