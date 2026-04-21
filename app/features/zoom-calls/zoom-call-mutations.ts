import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  zoomCallMutationKeys,
  zoomCallQueryKeys,
} from "./zoom-call-query-keys";
import { apiClient } from "@/lib/api";
import toast from "@/lib/toast";
import { extractError } from "@/lib/error";
import type { ZoomCall } from "./zoom-call-queries";

export interface CreateZoomCallPayload {
  topic: string;
  description?: string;
  start_time: string;
  duration: number;
}

export const useCreateZoomCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: zoomCallMutationKeys.createCall(),
    mutationFn: async (data: CreateZoomCallPayload) => {
      const response = await apiClient.post<ZoomCall>(
        "/api/call/zoom-calls/",
        data
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: zoomCallQueryKeys.all });
      toast.success({
        message: `Zoom call "${data.topic}" scheduled.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to schedule call. Please try again.",
      });
    },
  });
};

export interface UpdateZoomCallPayload extends Partial<CreateZoomCallPayload> {
  id: string;
}

export const useUpdateZoomCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: zoomCallMutationKeys.updateCall(),
    mutationFn: async ({ id, ...data }: UpdateZoomCallPayload) => {
      const response = await apiClient.patch<ZoomCall>(
        `/api/call/zoom-calls/${id}/`,
        data
      );

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: zoomCallQueryKeys.all });
      toast.success({
        message: `Zoom call "${data.topic}" updated.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to update call. Please try again.",
      });
    },
  });
};

export interface DeleteZoomCallPayload {
  id: string;
  topic?: string;
}

export const useDeleteZoomCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: zoomCallMutationKeys.deleteCall(),
    mutationFn: async ({ id }: DeleteZoomCallPayload) => {
      await apiClient.delete(`/api/call/zoom-calls/${id}/`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: zoomCallQueryKeys.all });
      toast.success({
        message: `Zoom call${variables.topic ? ` "${variables.topic}"` : ""} deleted.`,
      });
    },
    onError: (error) => {
      toast.error({
        message: extractError(error),
        description: "Failed to delete call. Please try again.",
      });
    },
  });
};
