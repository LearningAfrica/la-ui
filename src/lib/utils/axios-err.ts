import { AxiosError } from 'axios';

export function apiErrorMsg(
  error: unknown,
  fallbackMessage?: string,
): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      fallbackMessage ||
      'An unknown error occurred'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage || 'An unknown error occurred';
}
