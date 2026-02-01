export type PaginationMeta = {
  total_docs: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: null | number;
  prev_page: null | number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};
