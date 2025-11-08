import type { ApiOrganizationInterface } from '@/lib/types/organization';
import { useAuth } from '@/hooks/use-auth';
import type {
  ICreateOrganizationInput,
  IInviteUsersToOrganizationInput,
} from '@/lib/validators/organization-schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiErrorMsg } from '@/lib/utils/axios-err';
import { useApiClient } from '@/lib/api';

export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (organizationId: string) =>
    [...organizationKeys.lists(), organizationId] as const,
  details: (organizationId: string) =>
    [...organizationKeys.all, 'detail', organizationId] as const,
};

export const useOrganization = () => {
  const auth = useAuth();
  const apiClient = useApiClient();
  if (!auth.user) {
    throw new Error('Organization features require authentication');
  }
  const queryClient = useQueryClient();
  const organizationsQuery = useQuery({
    queryKey: organizationKeys.lists(),
    queryFn: async () => {
      // Fetch organizations from the API or auth store
      try {
        const { data } = await apiClient.get<ApiOrganizationInterface[]>(
          '/api/organizations/',
        );
        return data || [];
      } catch (error) {
        console.log(
          apiErrorMsg(error, 'Failed to fetch organizations'),
        );

        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createOrganization = async (payload: ICreateOrganizationInput) => {
    const { data } = await apiClient.post<ApiOrganizationInterface>(
      '/api/organizations/',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  };

  const inviteUserToOrganization = async (
    payload: IInviteUsersToOrganizationInput,
  ) => {
    const { data } = await apiClient.post<ApiOrganizationInterface>(
      `/invite/admin/`,
      payload,
    );
    return data;
  };

  const createOrganizationMutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create organization:', error);
      throw new Error(
        apiErrorMsg(error, 'Failed to create organization'),
      );
    },
  });

  const inviteUsersToOrganizationMutation = useMutation({
    mutationFn: inviteUserToOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to invite users:', error);
      throw new Error(
        apiErrorMsg(error, 'Failed to invite users'),
      );
    },
  });

  // Implement other methods similarly...

  return {
    mutations: {
      create: createOrganizationMutation,
      inviteUsers: inviteUsersToOrganizationMutation,
    },
    queries: {
      organizations: organizationsQuery,
    },
  };
};
