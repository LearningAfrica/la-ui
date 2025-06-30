import type { UserRole } from './auth';

export interface OrganizationSettings {
  allowSelfRegistration?: boolean;
  defaultRole?: UserRole;
  features?: string[];
  requireDomainVerification?: boolean;
  maxMembers?: number;
  billingEnabled?: boolean;
}

export interface OrganizationMember {
  userId: string;
  role: UserRole;
  joinedAt: string;
  status: 'active' | 'pending' | 'suspended';
}

export type OrganizationStatus =
  | 'active'
  | 'pending'
  | 'suspended'
  | 'archived';
export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  domain?: string;
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt?: string;
  status: OrganizationStatus;
  memberCount: number;
  currentUserRole?: UserRole;
  currentUserMembershipStatus?: OrganizationMember['status'];
}
