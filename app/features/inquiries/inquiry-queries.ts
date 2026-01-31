import { useQuery } from "@tanstack/react-query";
import { inquiryQueryKeys } from "./inquiry-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface InquiryInterface {
  id: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_verified: boolean;
    profile: null;
  };
  company_name: string;
  company_description: string;
  company_category: string;
  company_size: string;
  reason: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

// Get user's inquiries
export const useMyInquiries = () => {
  return useQuery({
    queryKey: inquiryQueryKeys.myInquiries(),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<InquiryInterface>>(
        "/api/invite/organization-permission-requests/"
      );

      return response.data;
    },
  });
};
