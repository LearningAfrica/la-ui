import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrganizationFormData } from "@/lib/schema/organization-schema";
import {
  organizationMutationKeys,
  organizationQueryKeys,
} from "./organization-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { OrganizationMembershipRole } from "./organization-queries";
import type { InviteMemberFormData } from "@/lib/schema/invite-schema";

interface CreateOrganizationResponse {
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

// Create Organization Mutation
export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: organizationMutationKeys.createOrganization(),
    mutationFn: async (data: OrganizationFormData) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);

      if (data.logo) {
        formData.append("logo", data.logo);
      }

      const response = await apiClient.post<CreateOrganizationResponse>(
        "/api/organizations/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.myOrganizations(),
      });
      toast.success({
        message: `Organization "${data.name}" has been created successfully.`,
        description: "You can now manage your organization.",
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description:
          "Please try again or contact support if the issue persists.",
      });
    },
  });
};

// Change Member Role Mutation
export const useChangeMemberRole = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: organizationMutationKeys.changeMemberRole(organizationId),
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: OrganizationMembershipRole;
    }) => {
      const response = await apiClient.patch(
        `/api/organizations/${organizationId}/members/${memberId}/role/`,
        { role }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.organizationMembers(organizationId),
      });
      toast.success({
        message: "Member role has been updated successfully.",
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to change member role. Please try again.",
      });
    },
  });
};

// Toggle Member Status Mutation
export const useToggleMemberStatus = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: organizationMutationKeys.toggleMemberStatus(organizationId),
    mutationFn: async ({
      memberId,
      isActive,
    }: {
      memberId: string;
      isActive: boolean;
    }) => {
      const response = await apiClient.patch(
        `/api/organizations/${organizationId}/members/${memberId}/status/`,
        { is_active: isActive }
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.organizationMembers(organizationId),
      });
      toast.success({
        message: `Member has been ${variables.isActive ? "activated" : "deactivated"} successfully.`,
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to update member status. Please try again.",
      });
    },
  });
};

// Invite Member Mutation
export const useInviteMember = (organizationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: organizationMutationKeys.inviteMember(organizationId),
    mutationFn: async (payload: InviteMemberFormData) => {
      const response = await apiClient.post(
        `/api/invite/organization-user-invites/`,
        payload
      );

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.organizationMembers(organizationId),
      });

      const count = variables.receiver_emails.length;

      toast.success({
        message: `${count} invitation${count !== 1 ? "s" : ""} sent successfully.`,
        description: "Members will receive an email to join the organization.",
      });
    },
    onError: (error) => {
      const errorMessage = extractError(error);

      toast.error({
        message: errorMessage,
        description: "Failed to send invitations. Please try again.",
      });
    },
  });
};
