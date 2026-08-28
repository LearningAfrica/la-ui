import { useQuery } from "@tanstack/react-query";
import { moduleContentQueryKeys } from "./module-content-query-keys";
import { apiClient } from "@/lib/api";

export interface ModuleContentData {
  id: string;
  title: string;
  order: number;
  created_at: string;
  updated_at: string;
  // text content
  body?: string;
  // video content
  video_url?: string;
  duration_seconds?: number;
  // file content
  file_name?: string;
  file?: string;
  format?: "native" | "html5" | "scorm12" | "scorm2004" | "external";
  external_url?: string;
  definition?: { blocks: Array<Record<string, unknown>> };
  xapi_enabled?: boolean;
  launch_path?: string;
}

export interface ModuleContent {
  id: string;
  title: string;
  order: number;
  content_type: "text" | "video" | "file" | "interactive";
  data: ModuleContentData;
}

export const useModuleContents = (coursePk: string, modulePk: string) => {
  return useQuery({
    queryKey: moduleContentQueryKeys.contents(coursePk, modulePk),
    queryFn: async () => {
      const response = await apiClient.get<ModuleContent[]>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/`
      );

      return response.data;
    },
    enabled: !!coursePk && !!modulePk,
  });
};

export const useModuleContent = (
  coursePk: string,
  modulePk: string,
  id: string
) => {
  return useQuery({
    queryKey: moduleContentQueryKeys.content(coursePk, modulePk, id),
    queryFn: async () => {
      const response = await apiClient.get<ModuleContent>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${id}/`
      );

      return response.data;
    },
    enabled: !!coursePk && !!modulePk && !!id,
  });
};

export const useModuleContentFile = (
  coursePk: string,
  modulePk: string,
  id: string,
  enabled = true
) => {
  return useQuery({
    queryKey: moduleContentQueryKeys.file(coursePk, modulePk, id),
    queryFn: async () => {
      const response = await apiClient.get<Blob>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/${id}/file/`,
        { responseType: "blob" }
      );

      return response.data;
    },
    enabled: enabled && !!coursePk && !!modulePk && !!id,
    staleTime: 5 * 60 * 1000,
  });
};
