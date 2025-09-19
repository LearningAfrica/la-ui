import { useQuery } from '@tanstack/react-query';

import type { Analytics, Inquiry, Organization } from './types';
import { useApiClient } from '@/lib/api';
import type { Paginated, PaginationMetaData } from '@/lib/types/global';

export const useInquiries = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async ()=> {
      try {
        const { data } = await api.get<Paginated<Inquiry[]>>(
          '/users/organization-setup-requests/?page=1&limit=20',
        );
        return data.data;
      } catch (error) {
        throw new Error('Failed to fetch inquiries');
      }
    },
  });
};

export const useOrganizations = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async (): Promise<Organization[]> => {
      try {
        const { data } = await api.get('/api/organizations');
        return data;
      } catch (error) {
        throw new Error('Failed to fetch organizations');
      }
    },
  });
};

export const useAnalytics = () => {
  const api = useApiClient();
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async (): Promise<Analytics> => {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });
};
