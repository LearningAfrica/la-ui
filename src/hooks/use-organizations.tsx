import type { Organization } from '@/lib/types/organization';
import { useAuth } from './use-auth';
import type { ICreateOrganizationInput } from '@/lib/validators/organization-schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { extractCorrectErrorMessage } from '@/lib/utils/axios-err';

const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (organizationId: string) =>
    [...organizationKeys.lists(), organizationId] as const,
  details: (organizationId: string) =>
    [...organizationKeys.all, 'detail', organizationId] as const,
};

export const useOrganization = () => {
  const auth = useAuth();

  if (!auth.user) {
    throw new Error('Organization features require authentication');
  }
  const queryClient = useQueryClient();
  const organizationsQuery = useQuery({
    queryKey: organizationKeys.lists(),
    queryFn: async () => {
      // Fetch organizations from the API or auth store
      try {
        const { data } = await apiClient.get<Organization[]>('/organizations/');
        return data || [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createOrganization = async (payload: ICreateOrganizationInput) => {
    await apiClient.post<Organization>('/organizations/', payload);
  };

  const createOrganizationMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: (newOrg) => {
      queryClient.setQueryData(
        organizationKeys.lists(),
        (oldData: Organization[] | undefined) => {
          return [...(oldData || []), newOrg];
        },
      );
    },
    onError: (error) => {
      console.error('Failed to create organization:', error);
      throw new Error(extractCorrectErrorMessage(error,'Failed to create organization'));
    },
  });

  // Implement other methods similarly...

  return {
    mutations: {
      create: createOrganizationMutation,
    },
    queries: {
      organizations: organizationsQuery,
    },
  };
};
