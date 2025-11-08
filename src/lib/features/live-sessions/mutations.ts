import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/api';
import type { LiveSession } from '@/lib/types/live-session';
import { type CreateSessionData } from '@/lib/validators/live-session-schema';
import { liveSessionsKeys } from './query-keys';
import type { AxiosInstance } from 'axios';

/**
 * Data transformation utilities for API requests
 */

// Transform our session data to API request format matching the Swagger schema
const transformSessionDataToApiRequest = (sessionData: CreateSessionData) => {
  // sessionData.start_time is already in datetime-local format (YYYY-MM-DDTHH:mm)
  // Convert it to ISO string for the API
  const startDateTime = new Date(sessionData.start_time);

  // duration is already a number (minutes) from the form
  const durationMinutes = sessionData.duration || 60;

  return {
    topic: sessionData.topic,
    start_time: startDateTime.toISOString(),
    duration: durationMinutes,
    // Note: host, join_url, created_at, updated_at will be set by the API
  };
};

/**
 * API functions for live sessions mutations using /call/zoom-calls/ endpoint
 */

export const liveSessionsMutationsApi = {
  // Create a new session
  createSession: async (
    apiClient: AxiosInstance,
    sessionData: CreateSessionData,
  ): Promise<LiveSession> => {
    try {
      const requestData = transformSessionDataToApiRequest(sessionData);
      const { data } = await apiClient.post<LiveSession>(
        '/call/zoom-calls/',
        requestData,
      );
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create live session');
    }
  },

  // Update an existing session
  updateSession: async (
    apiClient: AxiosInstance,
    sessionData: CreateSessionData,
  ): Promise<LiveSession> => {
    try {
      if (!sessionData.id) {
        throw new Error('Session ID is required for update');
      }

      const requestData = transformSessionDataToApiRequest(sessionData);
      const { data } = await apiClient.put<LiveSession>(
        `/call/zoom-calls/${sessionData.id}/`,
        requestData,
      );
      return data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw new Error('Failed to update live session');
    }
  },

  // Delete a session
  deleteSession: async (
    apiClient: AxiosInstance,
    sessionId: string,
  ): Promise<void> => {
    try {
      await apiClient.delete(`/call/zoom-calls/${sessionId}/`);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete live session');
    }
  },
}; /**
 * React Query mutation hooks for live sessions
 */

// Create session mutation
export const useCreateSession = () => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (sessionData: CreateSessionData) =>
      liveSessionsMutationsApi.createSession(apiClient, sessionData),
    onSuccess: (newSession) => {
      // Invalidate and refetch all sessions
      queryClient.invalidateQueries({ queryKey: liveSessionsKeys.all });

      // Optimistically update the cache
      queryClient.setQueryData<LiveSession[]>(
        liveSessionsKeys.lists(),
        (oldSessions) => {
          if (!oldSessions) return [newSession];
          return [newSession, ...oldSessions];
        },
      );

      // Update specific status queries
      queryClient.setQueryData<LiveSession[]>(
        liveSessionsKeys.list('upcoming'),
        (oldSessions) => {
          if (!oldSessions) return [newSession];
          return [newSession, ...oldSessions];
        },
      );
    },
    onError: (error) => {
      console.error('Error creating session:', error);
    },
  });
};

// Update session mutation
export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (sessionData: CreateSessionData) =>
      liveSessionsMutationsApi.updateSession(apiClient, sessionData),
    onSuccess: (updatedSession) => {
      // Invalidate and refetch all sessions
      queryClient.invalidateQueries({ queryKey: liveSessionsKeys.all });

      // Update specific session in cache
      if (updatedSession.id) {
        queryClient.setQueryData<LiveSession>(
          liveSessionsKeys.detail(updatedSession.id),
          updatedSession,
        );
      }

      // Update sessions list
      queryClient.setQueryData<LiveSession[]>(
        liveSessionsKeys.lists(),
        (oldSessions) => {
          if (!oldSessions) return [updatedSession];
          return oldSessions.map((session) =>
            session.id === updatedSession.id ? updatedSession : session,
          );
        },
      );
    },
    onError: (error) => {
      console.error('Error updating session:', error);
    },
  });
};

// Delete session mutation
export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      liveSessionsMutationsApi.deleteSession(apiClient, sessionId),
    onSuccess: (_, sessionId) => {
      // Invalidate and refetch all sessions
      queryClient.invalidateQueries({ queryKey: liveSessionsKeys.all });

      // Remove session from cache
      queryClient.removeQueries({
        queryKey: liveSessionsKeys.detail(sessionId),
      });

      // Update sessions list
      queryClient.setQueryData<LiveSession[]>(
        liveSessionsKeys.lists(),
        (oldSessions) => {
          if (!oldSessions) return [];
          return oldSessions.filter((session) => session.id !== sessionId);
        },
      );

      // Update all status-specific queries
      ['upcoming', 'ongoing', 'completed'].forEach((status) => {
        queryClient.setQueryData<LiveSession[]>(
          liveSessionsKeys.list(status),
          (oldSessions) => {
            if (!oldSessions) return [];
            return oldSessions.filter((session) => session.id !== sessionId);
          },
        );
      });
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
    },
  });
};
