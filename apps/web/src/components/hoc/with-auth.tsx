'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@libs/react-shared';
import { AuthLoading } from '../ui/auth-loading';

/**
 * Higher-order component that requires authentication.
 * Redirects to login page if user is not authenticated.
 */
export function withAuth<T extends object>(
    WrappedComponent: React.ComponentType<T>,
    options?: {
        redirectTo?: string;
        loading?: React.ComponentType;
    }
) {
    const AuthGuard = (props: T) => {
        const { isAuthenticated, isInitialized } = useAuth();
        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        const redirectTo = options?.redirectTo || '/auth/login';
        const LoadingComponent = options?.loading;

        useEffect(() => {
            // Only redirect if auth is initialized and user is not authenticated
            if (isInitialized && !isAuthenticated) {
                // Store the current URL as return URL before redirecting
                const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
                localStorage.setItem('returnUrl', currentUrl);
                router.replace(redirectTo);
            }
        }, [isAuthenticated, isInitialized, router, redirectTo, pathname, searchParams]);

        // Show loading component while checking authentication or during redirect
        if (!isInitialized || (isInitialized && !isAuthenticated)) {
            if (LoadingComponent) {
                return <LoadingComponent />;
            }
            return (
                <AuthLoading
                    message={!isInitialized ? 'Loading...' : 'Redirecting to login...'}
                />
            );
        }

        // Render the wrapped component if authenticated
        return <WrappedComponent {...props} />;
    };

    // Set display name for debugging
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    AuthGuard.displayName = `withAuth(${wrappedComponentName})`;

    const FallbackComponent = options?.loading;
    const suspenseFallback = FallbackComponent ? <FallbackComponent /> : (
        <AuthLoading message="Loading..." />
    );

    const WithAuthSuspense = (props: T) => (
        <Suspense fallback={suspenseFallback}>
            <AuthGuard {...props} />
        </Suspense>
    );

    WithAuthSuspense.displayName = `withAuthSuspense(${wrappedComponentName})`;

    return WithAuthSuspense;
}

/**
 * Hook version of the auth guard for use in functional components
 */
export function useAuthGuard(options?: {
    redirectTo?: string;
}): boolean {
    const { isAuthenticated, isInitialized } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const redirectTo = options?.redirectTo || '/auth/login';

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            // Store the current URL as return URL before redirecting
            const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            localStorage.setItem('returnUrl', currentUrl);

            // Use replace instead of push to avoid back button issues
            router.replace(redirectTo);
        }
    }, [isAuthenticated, isInitialized, router, redirectTo, pathname, searchParams]);

    return isAuthenticated && isInitialized;
}
