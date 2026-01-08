/**
 * =================================================================
 * INDEX / ENTRY SCREEN
 * =================================================================
 *
 * The app entry point that handles initial routing.
 * Checks auth state and redirects to appropriate screen.
 */

import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../src/theme';
import { AppLoader, AppText } from '../src/components';
import { storage } from '../src/lib';
import { appConfig } from '../src/config/app.config';

/**
 * Index Screen
 *
 * Handles the initial app flow:
 * 1. Check if onboarding is completed
 * 2. Check if user is authenticated
 * 3. Redirect accordingly
 */
export default function IndexScreen() {
    const { status, isAuthenticated } = useAuth();
    const theme = useAppTheme();

    useEffect(() => {
        const handleInitialRoute = async () => {
            // Wait for auth to initialize (optional, but good for consistent state)
            if (status === 'loading') return;

            // Check if onboarding should be shown
            if (appConfig.features.enableOnboarding) {
                const onboardingComplete = await storage.get<boolean>(
                    appConfig.storageKeys.onboardingComplete
                );

                if (!onboardingComplete) {
                    router.replace('/(public)/onboarding');
                    return;
                }
            }

            // Handle auth routing based on configuration
            if (appConfig.features.requiredLogin) {
                if (isAuthenticated) {
                    router.replace('/(tabs)/home');
                } else {
                    router.replace('/(auth)/login');
                }
            } else {
                // Skip auth check if not required
                router.replace('/(tabs)/home');
            }
        };

        handleInitialRoute();
    }, [status]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <AppLoader text="Loading..." />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
