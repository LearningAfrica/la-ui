import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiErrorMsg } from '@/lib/utils/axios-err';
import { useApiClient } from '@/lib/api';
import type { CreateCourseCategoryInput } from '@/lib/validators/course-categories-page';
import type { PaginatedApiCourseCategoriesInterface ,ApiCourseCategoriesInterface} from '@/lib/types/course-categories';

export const courseCategoryKeys = {
  all: ['course-categories'] as const,
  lists: () => [...courseCategoryKeys.all, 'list'] as const,
  list: (organizationId: string) =>
    [...courseCategoryKeys.lists(), organizationId] as const,
  details: (organizationId: string) =>
    [...courseCategoryKeys.all, 'detail', organizationId] as const,
};

export const useCourseCategories = () => {
  const auth = useAuth();
  const apiClient = useApiClient();
  if (!auth.user) {
    throw new Error('Course categories features require authentication');
  }

  async function fetchCategories(){
    const { data } = await apiClient.get<PaginatedApiCourseCategoriesInterface>('/api/categories/');
    return data;
  }
  const queryClient = useQueryClient();
  const courseCategoriesQuery = useQuery({
    queryKey: courseCategoryKeys.lists(),
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createCourseCategory = async (payload: CreateCourseCategoryInput) => {
    const { data } = await apiClient.post<ApiCourseCategoriesInterface>(
      '/api/categories/',
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data;
  };

  const createCourseCategoryMutation = useMutation({
    mutationFn: createCourseCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseCategoryKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create course category:', error);
      throw new Error(
        apiErrorMsg(error, 'Failed to create course category'),
      );
    },
  });

  // Implement other methods similarly...

  return {
    mutations: {
      create: createCourseCategoryMutation,
    },
    queries: {
      courseCategories: courseCategoriesQuery,
    },
  };
};
