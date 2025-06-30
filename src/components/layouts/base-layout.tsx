import React from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

type QueryClientProviderProps = {
	children: React.ReactNode;
};
export default function BaseLayout({ children }: QueryClientProviderProps) {
	return (
		
		<QueryProvider>
			<ThemeProvider defaultTheme="light">{children}</ThemeProvider>
			<Toaster />
		</QueryProvider>
	);
}
