/**
 * =================================================================
 * ROOT LAYOUT
 * =================================================================
 *
 * The root layout for the entire app.
 * Sets up all providers and wraps the navigation stack.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';

import { ThemeProvider } from '../src/theme';
import { AuthProvider } from '@libs/react-shared';
import { queryClient } from '../src/lib';
import { authClient } from '@/auth';

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

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <AuthProvider client={authClient}>
                            <StatusBar style="auto" />
                            <Stack
                                screenOptions={{
                                    headerShown: false,
                                    animation: 'fade',
                                }}
                            >
                                <Stack.Screen name="index" />
                                <Stack.Screen name="(public)" />
                                <Stack.Screen name="(auth)" />
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                        </AuthProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
