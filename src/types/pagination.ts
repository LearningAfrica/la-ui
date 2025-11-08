import type { MayBe } from "./utils";

type Pagination = {
  total_docs: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: MayBe<number>;
  prev_page: MayBe<number>;
};

export type Paginated<T> = {
  data: T[];
  pagination: Pagination;
};
