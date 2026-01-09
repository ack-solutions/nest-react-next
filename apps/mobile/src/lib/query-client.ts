/**
 * =================================================================
 * QUERY CLIENT
 * =================================================================
 *
 * React Query client configuration.
 * Uses @tanstack/react-query (same as the admin app).
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a React Query client with default options
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Don't refetch on window focus (mobile doesn't have windows)
            refetchOnWindowFocus: false,

            // Retry failed requests up to 2 times
            retry: 2,

            // Consider data stale after 30 seconds
            staleTime: 30 * 1000,

            // Cache for 5 minutes
            gcTime: 5 * 60 * 1000,
        },
        mutations: {
            // Don't retry mutations by default
            retry: false,
        },
    },
});

export default queryClient;
