export type InquiryStatus = 'pending' | 'approved' | 'rejected';

export interface Inquiry {
  id: number;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  company_name: string;
  company_description: string;
  company_category: string;
  company_size: string;
  reason: string;
  status: InquiryStatus;
  created_at: string;
  reviewed_at: null | string;
}

export type OrganizationStatus = 'active' | 'inactive' | 'pending';

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo_url: string;
}

export interface Analytics {
  totalInquiries: number;
  pendingInquiries: number;
  approvedInquiries: number;
  rejectedInquiries: number;
  thisMonthInquiries: number;
  conversionRate: number;
  topIndustries: { name: string; count: number }[];
  organizationSizes: { size: string; count: number }[];
}
