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
