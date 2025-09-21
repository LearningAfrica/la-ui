import type { UserRole, OrgUserRole } from '../validators/auth-schema';
import type { Paginated } from './global';

export interface OrganizationSettings {
  allowSelfRegistration?: boolean;
  defaultRole?: OrgUserRole;
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

export interface ApiOrganizationInterface {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  logo_url?: string;
  banner?: string;
  domain?: string;
  settings?: OrganizationSettings;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  memberCount?: number;
  position?: string | null;
  role?: 'admin' | 'instructor' | 'learner';
  is_active?: boolean;
  features?: string[];
  allowSelfRegistration?: boolean;
  defaultRole?: string;
  currentUserRole?: 'admin' | 'instructor' | 'learner';
  currentUserMembershipStatus?: 'active' | 'pending' | 'suspended';
}

export type PaginatedApiOrganizationInterface =
  Paginated<ApiOrganizationInterface>;
