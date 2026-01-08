/**
 * =================================================================
 * AUTH PROVIDER WRAPPER
 * =================================================================
 *
 * Wraps the shared AuthProvider to inject the mobile-configured client.
 */

import React from 'react';
import { AuthProvider as SharedAuthProvider } from '@libs/react-shared';
import { authClient } from './auth-client';
import { router } from 'expo-router';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SharedAuthProvider
            client={authClient}
            onLogoutRedirect={() => {
                // Handle logout redirect
                router.replace('/(auth)/login');
            }}
            onUnauthorized={() => {
                // Handle unauthorized redirect
                router.replace('/(auth)/login');
            }}
        >
            {children}
        </SharedAuthProvider>
    );
}

export { useAuth } from '@libs/react-shared';
export { authClient };
