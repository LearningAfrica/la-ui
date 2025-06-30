import type {
  Organization,
  OrganizationMember,
  OrganizationSettings,
} from '@/lib/types/organization';
import { useAuth } from './use-auth';
import type { UserRole } from '@/lib/types/auth';

export interface OrganizationActions {
  switchOrganization: (organizationId: string) => Promise<void>;
  getCurrentOrganization: () => Organization | null;
  getCurrentUserRole: (organizationId?: string) => UserRole | null;
  createOrganization: (payload: {
    name: string;
    description?: string;
    domain?: string;
    settings?: Partial<OrganizationSettings>;
  }) => Promise<Organization>;
  updateOrganization: (
    organizationId: string,
    updates: Partial<Organization>,
  ) => Promise<void | Organization>;
  deleteOrganization: (organizationId: string) => Promise<void>;
  inviteUserToOrganization: (
    email: string,
    organizationId: string,
    role: UserRole,
    message?: string,
  ) => Promise<void>;
  removeUserFromOrganization: (
    userId: string,
    organizationId: string,
  ) => Promise<void>;
  updateUserOrganizationRole: (
    userId: string,
    organizationId: string,
    newRole: UserRole,
  ) => Promise<void>;
  acceptOrganizationInvite: (
    inviteToken: string,
  ) => Promise<Organization | void>;
  listOrganizationMembers: (
    organizationId: string,
  ) => Promise<OrganizationMember[]>;
}

export const useOrganization = (): OrganizationActions & {
  organizations: Organization[];
  currentOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
} => {
  const auth = useAuth();

  if (!auth.user) {
    throw new Error('Organization features require authentication');
  }

  const organizations = auth.user.organizations;
  const currentOrganization = auth.user.currentOrganization || null;
  const isLoading = auth.isLoading;
  const error = auth.error;

  // Implement all organization actions that interact with the auth store
  const switchOrganization = async (organizationId: string) => {
    const org = auth.user?.organizations.find(
      (org) => org.id === organizationId,
    );
    if (!org) throw new Error('Organization not found or not accessible');

    auth.setUser({
      ...auth.user!,
      currentOrganization: org,
    });
  };

  const getCurrentOrganization = () => {
    return auth.user?.currentOrganization || null;
  };

  const getCurrentUserRole = (organizationId?: string) => {
    if (!auth.user) return null;

    if (organizationId) {
      return (
        auth.user.organizations.find((org) => org.id === organizationId)
          ?.currentUserRole || null
      );
    }
    return (
      auth.user.currentOrganization?.currentUserRole || auth.user.role || null
    );
  };

  const createOrganization = async (payload: {
    name: string;
    description?: string;
    domain?: string;
    settings?: Partial<OrganizationSettings>;
  }) => {
    if (!payload.name) throw new Error('Organization name is required');

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: payload.name,
      slug: payload.name.toLowerCase().replace(/\s+/g, '-'),
      description: payload.description,
      domain: payload.domain,
      settings: {
        allowSelfRegistration: false,
        defaultRole: 'student',
        ...payload.settings,
      },
      createdAt: new Date().toISOString(),
      status: 'active',
      memberCount: 1,
      currentUserRole: 'admin',
      currentUserMembershipStatus: 'active',
    };

    auth.setUser({
      ...auth.user!,
      organizations: [...auth.user!.organizations, newOrg],
      currentOrganization: newOrg,
    });

    return newOrg;
  };

  // Implement other methods similarly...

  return {
    organizations,
    currentOrganization,
    isLoading,
    error,
    switchOrganization,
    getCurrentOrganization,
    getCurrentUserRole,
    createOrganization,
    updateOrganization: async (organizationId, updates) => {
      // Implementation...
    },
    deleteOrganization: async (organizationId) => {
      // Implementation...
    },
    inviteUserToOrganization: async (email, organizationId, role, message) => {
      // Implementation...
    },
    removeUserFromOrganization: async (userId, organizationId) => {
      // Implementation...
    },
    updateUserOrganizationRole: async (userId, organizationId, newRole) => {
      // Implementation...
    },
    acceptOrganizationInvite: async (inviteToken) => {
      // Implementation...
    },
    listOrganizationMembers: async (organizationId) => {
      // Implementation...
      return [];
    },
  };
};
