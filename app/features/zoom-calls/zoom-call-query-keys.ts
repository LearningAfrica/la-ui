export interface ZoomCallFilters {
  page?: number;
  page_size?: number;
  status?: ZoomCallStatus;
  search?: string;
}

export type ZoomCallStatus = "scheduled" | "live" | "completed" | "cancelled";

export const zoomCallQueryKeys = {
  all: ["zoom-calls"] as const,
  list: (filters?: ZoomCallFilters) =>
    [...zoomCallQueryKeys.all, "list", filters] as const,
  detail: (id: string) => [...zoomCallQueryKeys.all, "detail", id] as const,
  joinInfo: (id: string) =>
    [...zoomCallQueryKeys.all, "join-info", id] as const,
};

export const zoomCallMutationKeys = {
  createCall: () => ["createZoomCall"] as const,
  updateCall: () => ["updateZoomCall"] as const,
  deleteCall: () => ["deleteZoomCall"] as const,
};
