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
}

export interface ModuleContent {
  id: string;
  title: string;
  order: number;
  content_type: "text" | "video" | "file";
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
