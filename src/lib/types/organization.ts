import type { UserRole } from "../validators/auth-schema";


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

// export type OrganizationStatus =
//   | 'active'
//   | 'pending'
//   | 'suspended'
//   | 'archived';
export interface Organization {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;

}
