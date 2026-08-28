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
  status: "pending" | "accepted" | "declined" | "revoked";
  is_expired: boolean;
  organization_name?: string | null;
  invited_by_name?: string | null;
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
