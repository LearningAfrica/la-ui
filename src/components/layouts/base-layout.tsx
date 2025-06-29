import React from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { QueryProvider } from '@/providers/query-provider'
type QueryClientProviderProps = {
    children: React.ReactNode
}
const queryClient = new QueryClient()
export default function BaseLayout({ children }: QueryClientProviderProps) {
    <QueryProvider>
        {children}
    </QueryProvider>

}
