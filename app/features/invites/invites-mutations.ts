import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitesMutationKeys, invitesQueryKeys } from "./invites-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";

interface AcceptInviteResponse {
  message: string;
  organization_id: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Accept Invite Mutation
export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation<AcceptInviteResponse, ErrorResponse, string>({
    mutationKey: invitesMutationKeys.acceptInvite(),
    mutationFn: async (inviteId: string) => {
      const response = await apiClient.post<AcceptInviteResponse>(
        `/api/invites/${inviteId}/accept/`
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success({
        message: "Invitation accepted",
        description: "You've successfully joined the organization.",
      });
      // Invalidate invites query to refetch
      queryClient.invalidateQueries({ queryKey: invitesQueryKeys.myInvites() });
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

  return useMutation<{ message: string }, ErrorResponse, string>({
    mutationKey: invitesMutationKeys.declineInvite(),
    mutationFn: async (inviteId: string) => {
      const response = await apiClient.post<{ message: string }>(
        `/api/invites/${inviteId}/decline/`
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
