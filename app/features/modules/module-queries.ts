import { useQuery } from "@tanstack/react-query";
import { moduleQueryKeys } from "./module-query-keys";
import { apiClient } from "@/lib/api";

import type { ModuleContent } from "@/features/module-contents/module-content-queries";

export interface CourseModuleDetail {
  id: string;
  title: string;
  description: string;
  contents: ModuleContent[];
}

export const useCourseModules = (coursePk: string) => {
  return useQuery({
    queryKey: moduleQueryKeys.modules(coursePk),
    queryFn: async () => {
      const response = await apiClient.get<CourseModuleDetail[]>(
        `/api/courses/${coursePk}/modules/`
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
