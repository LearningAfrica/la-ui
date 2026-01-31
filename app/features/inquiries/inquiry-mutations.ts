import { useMutation } from "@tanstack/react-query";
import type { InquiryFormData } from "@/lib/schema/inquiry-schema";
import { inquiryMutationKeys } from "./inquiry-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";

interface InquiryResponse {
  id: string;
  organization_name: string;
  contact_person_name: string;
  email: string;
  phone_number: string;
  organization_type: string;
  country: string;
  number_of_users: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Create Inquiry Mutation
export const useCreateInquiry = () => {
  return useMutation<InquiryResponse, ErrorResponse, InquiryFormData>({
    mutationKey: inquiryMutationKeys.createInquiry(),
    mutationFn: async (data) => {
      const response = await apiClient.post<InquiryResponse>(
        "/api/invite/organization-permission-requests/",
        data
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success({
        message: "Inquiry submitted successfully",
        description:
          "We've received your inquiry and will get back to you soon.",
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Inquiry submission failed"),
        description:
          "Please try again or contact support if the issue persists.",
      });
    },
  });
};

// Approve Inquiry Mutation (Admin)
export const useApproveInquiry = () => {
  return useMutation<void, ErrorResponse, number>({
    mutationKey: inquiryMutationKeys.approveInquiry(),
    mutationFn: async (inquiryId) => {
      await apiClient.patch(
        `/api/invite/admin-action-to-organization-request/${inquiryId}/`,
        {
          status: "approved",
        }
      );
    },
    onSuccess: () => {
      toast.success({
        message: "Inquiry approved successfully",
        description: "The organization request has been approved.",
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Failed to approve inquiry"),
        description: "Please try again or contact support.",
      });
    },
  });
};

// Reject Inquiry Mutation (Admin)
export const useRejectInquiry = () => {
  return useMutation<
    void,
    ErrorResponse,
    { inquiryId: number; reason: string }
  >({
    mutationKey: inquiryMutationKeys.rejectInquiry(),
    mutationFn: async ({ inquiryId, reason }) => {
      await apiClient.post(
        `/api/invite/admin-action-to-organization-request/${inquiryId}/`,
        {
          status: "rejected",
          rejection_reason: reason,
        }
      );
    },
    onSuccess: () => {
      toast.success({
        message: "Inquiry rejected",
        description: "The organization request has been rejected.",
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error, "Failed to reject inquiry"),
        description: "Please try again or contact support.",
      });
    },
  });
};
