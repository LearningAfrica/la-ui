// Global type aliases for common TypeScript issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TSFixMe = any;

// Common event types
export type EventHandler<T = TSFixMe> = (event: T) => void;

// Common API response types
export type APIResponse<T = TSFixMe> = {
  data: T;
  message?: string;
  success: boolean;
};

// Common form types
export type FormData = Record<string, TSFixMe>;

// Common component props
export type ComponentProps = Record<string, TSFixMe>;

export type Nullable<T> = T | null | undefined;

export type Optional<T> = T | undefined;
export type PaginationMetaData = {
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type Paginated<T> = {
  meta: PaginationMetaData;
  data: T[];
};
