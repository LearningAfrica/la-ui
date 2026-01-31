import { useQuery } from "@tanstack/react-query";
import { organizationQueryKeys } from "./organization-query-keys";
import { apiClient } from "@/lib/api";

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

// Get user's organizations
export const useMyOrganizations = () => {
  return useQuery<Organization[]>({
    queryKey: organizationQueryKeys.myOrganizations(),
    queryFn: async () => {
      const response = await apiClient.get<Organization[]>(
        "/api/organizations/"
      );

      return response.data;
    },
  });
};
