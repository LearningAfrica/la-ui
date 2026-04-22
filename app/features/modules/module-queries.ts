import { useQuery } from "@tanstack/react-query";
import { moduleQueryKeys } from "./module-query-keys";
import { apiClient } from "@/lib/api";
import type { Paginated } from "@/lib/types/api";

import type { ModuleContent } from "@/features/module-contents/module-content-queries";

export interface CourseModuleDetail {
  id: string;
  title: string;
  description: string;
  contents: ModuleContent[];
}

export interface UseCourseModulesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const useCourseModules = (
  coursePk: string,
  params: UseCourseModulesParams = {}
) => {
  const { page = 1, pageSize = 10, search } = params;

  return useQuery({
    queryKey: moduleQueryKeys.modules(coursePk, page, pageSize, search),
    queryFn: async () => {
      const response = await apiClient.get<Paginated<CourseModuleDetail>>(
        `/api/courses/${coursePk}/modules/`,
        {
          params: {
            page,
            page_size: pageSize,
            limit: pageSize,
            search,
          },
        }
      );

      return response.data;
    },
    enabled: !!coursePk,
  });
};

export const useCourseModule = (coursePk: string, id: string) => {
  return useQuery({
    queryKey: moduleQueryKeys.module(coursePk, id),
    queryFn: async () => {
      const response = await apiClient.get<CourseModuleDetail>(
        `/api/courses/${coursePk}/modules/${id}/`
      );

      return response.data;
    },
    enabled: !!coursePk && !!id,
  });
};
