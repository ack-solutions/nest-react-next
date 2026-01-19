
/**
 * =================================================================
 * ROOT LAYOUT
 * =================================================================
 *
 * The root layout for the entire app.
 * Sets up all providers and wraps the navigation stack.
 */
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from '../src/theme';
import { AuthProvider, instanceApi } from '@libs/react-shared';
import { queryClient } from '../src/lib';
import { authClient, SecureStorageAdapter } from '@/auth';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Root Layout Component
 *
 * INTEGRATION NOTE:
 * If you want to add your monorepo's shared provider here, you can wrap
 * the AuthProvider with it. For example:
 *
 * ```tsx
 * import { SharedProvider } from '@libs/react-shared';
 *
 * // Inside RootLayout:
 * <SharedProvider>
 *   <AuthProvider>
 *     {children}
 *   </AuthProvider>
 * </SharedProvider>
 * ```
 *
 * Note: Ensure React versions are compatible between web and mobile.
 */
export default function RootLayout() {
    useEffect(() => {
        // Hide splash screen after a brief delay
        // In a real app, you'd wait for fonts/assets to load
        const hideSplash = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await SplashScreen.hideAsync();
        };

        hideSplash();
    }, []);

    const handleTokenSet = (tokens: { accessToken: string; refreshToken: string, trustToken?: string }) => {
        if (tokens?.accessToken) {
            // const token = localStorage.getItem('nest_auth_access_token');
            instanceApi.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        }
    };

    const handleTokenRemoved = () => {
        delete instanceApi.defaults.headers.common?.['Authorization'];
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <AuthProvider
                            client={authClient}
                            onTokensSet={handleTokenSet}
                            onTokensRemoved={handleTokenRemoved}
                            storage={new SecureStorageAdapter()}
                        >
                            <StatusBar style="auto" />
                            <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
                        </AuthProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
