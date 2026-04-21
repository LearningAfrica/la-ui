import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { invitesMutationKeys, invitesQueryKeys } from "./invites-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import { organizationQueryKeys } from "../organizations/organization-query-keys";
import type { MyOrganization } from "../organizations/organization-queries";
import { useOrganizationStore } from "@/stores/organization/organization-hooks";
import type { Paginated } from "@/lib/types/api";

interface AcceptInviteResponse {
  message: string;
  // Backend may or may not include this; code falls back to the
  // most-recently-joined org when it's missing.
  organization_id?: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Accept Invite Mutation — also switches the active organization to the
// newly joined org and navigates to its dashboard so the user doesn't have
// to hunt for the organization selector after accepting.
export const useAcceptInvite = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setSelectedOrganization } = useOrganizationStore();

  return useMutation<AcceptInviteResponse, ErrorResponse, number>({
    mutationKey: invitesMutationKeys.acceptInvite(),
    mutationFn: async (inviteId: number) => {
      const response = await apiClient.post<AcceptInviteResponse>(
        `/api/invite/my-organization-invites/${inviteId}/accept/`
      );

      return response.data;
    },
    onSuccess: async (data) => {
      toast.success({
        message: "Invitation accepted",
        description: "You've successfully joined the organization.",
      });
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.myInvites() });

      const orgs = await queryClient.fetchQuery<MyOrganization[] | undefined>({
        queryKey: organizationQueryKeys.myOrganizations(),
        queryFn: async () => {
          const response = await apiClient.get<Paginated<MyOrganization>>(
            "/api/organizations/mine/"
          );

          return response.data?.data;
        },
        staleTime: 0,
      });

      // Prefer matching the org id from the response. Backend sometimes
      // omits it — in that case, pick the most-recently-joined org so the
      // user lands in the one they just accepted.
      const joinedOrg =
        (data.organization_id &&
          orgs?.find((org) => org.id === data.organization_id)) ||
        orgs
          ?.slice()
          .sort(
            (a, b) =>
              new Date(b.date_joined).getTime() -
              new Date(a.date_joined).getTime()
          )[0];

      if (joinedOrg) {
        setSelectedOrganization(joinedOrg);
      }

      navigate("/client/dashboard");
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Failed to accept invitation"),
        description:
          "Please try again or contact support if the issue persists.",
      });
    },
  });
};

// Decline Invite Mutation
export const useDeclineInvite = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponse, number>({
    mutationKey: invitesMutationKeys.declineInvite(),
    mutationFn: async (inviteId: number) => {
      const response = await apiClient.post<{ message: string }>(
        `/api/invite/my-organization-invites/${inviteId}/decline/`
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success({
        message: "Invitation declined",
        description: "You've declined the invitation.",
      });
      // Invalidate invites query to refetch
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.myInvites() });
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.myOrganizations(),
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Failed to decline invitation"),
        description:
          "Please try again or contact support if the issue persists.",
      });
    },
  });
};
