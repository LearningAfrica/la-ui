import React from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthModalProvider } from '@/components/auth/auth-modal.context';

type QueryClientProviderProps = {
  children: React.ReactNode;
};
export default function BaseLayout({ children }: QueryClientProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="light">
        <AuthModalProvider>{children}</AuthModalProvider>
      </ThemeProvider>
      <Toaster />
    </QueryProvider>
  );
}
