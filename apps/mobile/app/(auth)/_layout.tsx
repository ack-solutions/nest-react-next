/**
 * =================================================================
 * AUTH LAYOUT
 * =================================================================
 *
 * Layout for authentication screens.
 * Redirects to home if already authenticated.
 */

import { useEffect } from 'react';
import { Stack, router } from 'expo-router';

import { useAuth } from '@libs/react-shared';

export default function AuthLayout() {
    const { isAuthenticated, status } = useAuth();

    // Redirect to home if already authenticated
    useEffect(() => {
        if (status !== 'loading' && isAuthenticated) {
            router.replace('/(tabs)/home');
        }
    }, [isAuthenticated, status]);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
}
