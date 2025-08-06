import type { Paginated } from './global';

export interface ApiCourseCategoriesInterface {
  id: number;
  title: string;
  organization: string;
  category_name: string;
  slug: string;
  description: string;
  category_image: string;
  created: string;
  updated: string;
}
export type PaginatedApiCourseCategoriesInterface =
  Paginated<ApiCourseCategoriesInterface>;
