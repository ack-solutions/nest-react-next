'use client';

import { ReactNode } from 'react';
import { LayoutProvider } from '@web/contexts/layout-context';
import { ThemeProvider } from '@web/contexts/theme-provider';
import { createInitialState } from '@web/lib/auth.server';
import { AuthClient, type ServerAuthState } from '@ackplus/nest-auth-react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@libs/react-shared';

type AppProvidersProps = {
    children: ReactNode;
    initialAuthState?: ServerAuthState;
};

export const authClient = new AuthClient({
    baseUrl: `${process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:3333'}/api`,
    accessTokenType: 'cookie' as const,
    // debug: false,
});

export function AppProviders({ children, initialAuthState }: AppProvidersProps) {
    return (
        <>
            <ThemeProvider>
                <LayoutProvider>
                    <AuthProvider
                        client={authClient}
                        initialAuthState={initialAuthState ? createInitialState(initialAuthState) : undefined}
                    >
                        {children}
                    </AuthProvider>
                </LayoutProvider>
            </ThemeProvider>
            <Toaster richColors position="top-right" />
        </>
    );
}
