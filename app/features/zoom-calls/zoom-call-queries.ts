import { useQuery } from "@tanstack/react-query";
import {
  zoomCallQueryKeys,
  type ZoomCallFilters,
  type ZoomCallStatus,
} from "./zoom-call-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface ZoomCall {
  id: string;
  host: string;
  host_name?: string;
  topic: string;
  description?: string;
  start_time: string;
  duration: number;
  join_url: string;
  status: ZoomCallStatus;
  course?: string | null;
  course_title?: string | null;
  created_at?: string;
}

// The backend returns the credentials using Zoom's own camelCase field names
// (the exact shape `ZoomMtgEmbedded.join()` expects), so we keep them verbatim
// and hand them straight to the SDK. Note `passWord` is Zoom's spelling.
export interface ZoomCallJoinInfo {
  sdkKey: string;
  meetingNumber: string;
  passWord: string;
  userName: string;
  signature: string;
  userEmail?: string;
  leaveUrl?: string;
}

export const useZoomCalls = (filters: ZoomCallFilters = {}) => {
  const { page = 1, page_size = 20, status, search, course } = filters;

  return useQuery({
    queryKey: zoomCallQueryKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: page_size.toString(),
      });

      if (status) params.append("status", status);

      if (search) params.append("search", search);

      if (course) params.append("course", course);

      const response = await apiClient.get<Paginated<ZoomCall>>(
        `/api/call/zoom-calls/?${params.toString()}`
      );

      return response.data;
    },
  });
};

export const useZoomCall = (id: string) => {
  return useQuery({
    queryKey: zoomCallQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<ZoomCall>(
        `/api/call/zoom-calls/${id}/`
      );

      return response.data;
    },
    enabled: !!id,
  });
};

export const useZoomCallJoinInfo = (id: string, enabled = false) => {
  return useQuery({
    queryKey: zoomCallQueryKeys.joinInfo(id),
    queryFn: async () => {
      const response = await apiClient.get<ZoomCallJoinInfo>(
        `/api/call/zoom-calls/${id}/join_info/`
      );

      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 0,
    gcTime: 0,
  });
};
