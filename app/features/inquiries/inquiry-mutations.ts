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
