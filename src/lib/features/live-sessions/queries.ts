import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api';
import type { LiveSession } from '@/lib/types/live-session';
import { liveSessionsKeys } from './query-keys';
import type { AxiosInstance } from 'axios';
import type { Paginated } from '@/types/pagination';

/**
 * Data transformation utilities
 */

/**
 * API functions for live sessions using /call/zoom-calls/ endpoint
 */

// API service functions
export const liveSessionsApi = {
  // Get all sessions
  getSessions: async (apiClient: AxiosInstance) => {
    try {
      const { data } =
        await apiClient.get<Paginated<LiveSession>>('/call/zoom-calls/');
      await apiClient.get<Paginated<LiveSession>>('/call/zoom-calls/');
      // Transform the response data if needed
      return data.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('Failed to fetch live sessions');
    }
  },

  // Get sessions by status
  getSessionsByStatus: async (
    apiClient: AxiosInstance,
    status: LiveSession['topic'],
  ): Promise<LiveSession[]> => {
    try {
      const { data } = await apiClient.get<Paginated<LiveSession>>(
        `/call/zoom-calls/?status=${status}`,
      );
      // Transform the response data if needed
      return data.data;
    } catch (error) {
      console.error(`Error fetching ${status} sessions:`, error);
      throw new Error(`Failed to fetch ${status} sessions`);
    }
  },

  // Get single session
  getSessionById: async (apiClient: AxiosInstance, id: string) => {
    try {
      const { data } = await apiClient.get<LiveSession>(
        `/call/zoom-calls/${id}/`,
      );
      return data;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error);
      throw new Error(`Failed to fetch session with ID: ${id}`);
    }
  },
};

/**
 * React Query hooks for live sessions
 */

// Get all live sessions
export const useLiveSessions = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: liveSessionsKeys.lists(),
    queryFn: () => liveSessionsApi.getSessions(apiClient),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime)
  });
};

// Get sessions by status
export const useSessionsByStatus = (status: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: liveSessionsKeys.list(status),
    queryFn: () => liveSessionsApi.getSessionsByStatus(apiClient, status),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Get single session
export const useSession = (id: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: liveSessionsKeys.detail(id),
    queryFn: () => liveSessionsApi.getSessionById(apiClient, id),
    enabled: !!id, // Only run if id exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Convenience hooks for different status types
export const useUpcomingSessions = () => useSessionsByStatus('upcoming');
export const useOngoingSessions = () => useSessionsByStatus('ongoing');
export const usePastSessions = () => useSessionsByStatus('completed');
