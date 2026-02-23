import { useQuery } from "@tanstack/react-query";
import { invitesQueryKeys } from "./invites-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface Invite {
  id: number;
  organization_id: string;
  role: "admin" | "instructor" | "learner";
  email: string;
  is_used: boolean;
  expiration_time: string;
}

// Get user's invites (paginated)
export const useMyInvites = () => {
  return useQuery<Paginated<Invite>>({
    queryKey: invitesQueryKeys.myInvites(),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<Invite>>(
        "/api/invite/my-organization-invites/"
      );

      return response.data;
    },
  });
};
