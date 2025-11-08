import { useAuth } from '@/hooks/use-auth';
import { useApiClient } from '@/lib/api';
import type { Paginated } from '@/lib/types/global';
import { apiErrorMsg } from '@/lib/utils/axios-err';
import type { SetupInquiryPayload } from '@/lib/validators/setup-requisition-schema';
import type { Inquiry } from '@/pages/dashboard/super-admin/dashboard/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ADMIN_REQUISITION_KEYS = {
  all: ['_admin-requisitions'] as const,
  lists: () => [...ADMIN_REQUISITION_KEYS.all, 'list'] as const,
  list: (filters: string) =>
    [...ADMIN_REQUISITION_KEYS.lists(), { filters }] as const,
  details: () => [...ADMIN_REQUISITION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ADMIN_REQUISITION_KEYS.details(), id] as const,
};

export function useAdminRequisitions() {
  const auth = useAuth();
  const apiClient = useApiClient();
  if (!auth.user) {
    throw new Error('Admin requisitions features require authentication');
  }

  async function fetchRequisitions() {
    const { data } = await apiClient.get<Paginated<Inquiry>>(
      `/invite/organization-permission-requests/?page=1&limit=100`,
    );
    return data.data;
  }
  const queryClient = useQueryClient();
  const adminRequisitionsQuery = useQuery({
    queryKey: ADMIN_REQUISITION_KEYS.lists(),
    queryFn: fetchRequisitions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createRequisition = async (payload: SetupInquiryPayload) => {
    const { data } = await apiClient.post(
      '/users/organization-setup-requests/',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data;
  };

  const createRequisitionMutation = useMutation({
    mutationFn: createRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_REQUISITION_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error('Failed to create requisition:', error);
      throw new Error(apiErrorMsg(error, 'Failed to create requisition'));
    },
  });

  // Implement other methods similarly...

  return {
    queries: {
      adminRequisitions: adminRequisitionsQuery,
    },
    mutations: {
      create: createRequisitionMutation,
    },
  };
}
