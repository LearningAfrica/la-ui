import { useQuery } from "@tanstack/react-query";
import { moduleContentQueryKeys } from "./module-content-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

export interface ModuleContent {
  id: string;
  title: string;
  content_type: string;
  content_url: string;
  order: number;
  created: string;
}

export const useModuleContents = (
  coursePk: string,
  modulePk: string,
  page: number = 1
) => {
  return useQuery({
    queryKey: moduleContentQueryKeys.contents(coursePk, modulePk, page),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<ModuleContent>>(
        `/api/courses/${coursePk}/modules/${modulePk}/contents/`,
        { params: { page } }
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
