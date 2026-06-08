import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api";
import { statsQueryKeys } from "./stats-query-keys";

// Backend response shapes are not yet documented in the OpenAPI spec.
// Treat fields as optional and read them safely until backend formalizes the schema.
export interface UserStats {
  total_courses?: number;
  courses_created?: number;
  courses_enrolled?: number;
  courses_completed?: number;
  certificates_earned?: number;
  average_completion?: number;
  total_learners?: number;
  [key: string]: unknown;
}

export interface OrganizationStats {
  total_members?: number;
  total_courses?: number;
  total_categories?: number;
  pending_invites?: number;
  active_learners?: number;
  completion_rate?: number;
  [key: string]: unknown;
}

interface StatsQueryOptions {
  enabled?: boolean;
}

export const useUserStats = (options: StatsQueryOptions = {}) => {
  return useQuery({
    queryKey: statsQueryKeys.users(),
    queryFn: async () => {
      const response = await apiClient.get<UserStats>("/api/stats/users/");

      return response.data;
    },
    enabled: options.enabled ?? true,
    retry: false,
  });
};

export const useOrganizationStats = (options: StatsQueryOptions = {}) => {
  return useQuery({
    queryKey: statsQueryKeys.organizations(),
    queryFn: async () => {
      const response = await apiClient.get<OrganizationStats>(
        "/api/stats/organizations/"
      );

      return response.data;
    },
    enabled: options.enabled ?? true,
    retry: false,
  });
};
