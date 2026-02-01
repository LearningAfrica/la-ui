import { useQuery } from "@tanstack/react-query";
import { invitesQueryKeys } from "./invites-query-keys";
import { apiClient } from "@/lib/api";

export interface Invite {
  id: string;
  organization_id: string;
  organization_name: string;
  organization_logo?: string;
  inviter_name: string;
  inviter_email: string;
  role: "admin" | "instructor" | "learner";
  status: "pending" | "accepted" | "declined";
  invited_at: string;
  expires_at: string;
}

// Get user's pending invites
export const useMyInvites = () => {
  return useQuery<Invite[]>({
    queryKey: invitesQueryKeys.myInvites(),
    queryFn: async () => {
      const response = await apiClient.get<Invite[]>(
        "/api/invite/my-organization-invites/"
      );

      return response.data;
    },
  });
};
