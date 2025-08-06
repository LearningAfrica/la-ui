import type { UserRole } from '../validators/auth-schema';
import type { Paginated } from './global';

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

export interface ApiOrganizationInterface {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
}

export type PaginatedApiOrganizationInterface =
  Paginated<ApiOrganizationInterface>;
