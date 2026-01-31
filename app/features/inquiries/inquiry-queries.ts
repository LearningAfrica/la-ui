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

export interface InquiryStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
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

// Get all inquiries (admin)
export const useAllInquiries = (page: number = 1, search?: string) => {
  return useQuery({
    queryKey: inquiryQueryKeys.allInquiries(page, search),
    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("page", page.toString());

      if (search) params.append("search", search);

      const response = await apiClient.get<Paginated<InquiryInterface>>(
        `/api/invite/organization-permission-requests/?${params.toString()}`
      );

      return response.data;
    },
  });
};

// Get inquiry stats (admin)
export const useInquiryStats = () => {
  return useQuery({
    queryKey: inquiryQueryKeys.inquiryStats(),
    queryFn: async () => {
      const response = await apiClient.get<InquiryStats>(
        "/api/invite/organization-permission-requests/stats/"
      );

      return response.data;
    },
  });
};
