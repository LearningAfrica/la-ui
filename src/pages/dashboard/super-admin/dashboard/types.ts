export type InquiryStatus = 'pending' | 'approved' | 'rejected';

export type InquiryPriority = 'high' | 'medium' | 'low';

export interface Inquiry {
  first_name: string;
  last_name: string;
  contact_email: string;
  company_name: string;
  company_description: string;
  company_category: string;
  company_size: string;
}

export type OrganizationStatus = 'active' | 'inactive' | 'pending';

export interface Organization {
  id: string;
  name: string;
  type: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone?: string;
  industry: string;
  size: string;
  activeProjects: number;
  revenue: number;
  status: OrganizationStatus;
  location: string;
  website?: string;
  partnershipDate: string;
  services: string[];
  description: string;
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
