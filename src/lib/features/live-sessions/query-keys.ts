/**
 * Query keys for live sessions feature
 * Following TanStack Query best practices for query key management
 */

export const liveSessionsKeys = {
  all: ['live-sessions'] as const,
  lists: () => [...liveSessionsKeys.all, 'list'] as const,
  list: (filters: string) => [...liveSessionsKeys.lists(), { filters }] as const,
  details: () => [...liveSessionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...liveSessionsKeys.details(), id] as const,
  // Status-based queries
  upcoming: () => [...liveSessionsKeys.lists(), 'upcoming'] as const,
  ongoing: () => [...liveSessionsKeys.lists(), 'ongoing'] as const,
  past: () => [...liveSessionsKeys.lists(), 'past'] as const,
} as const;
