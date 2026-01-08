/**
 * =================================================================
 * ONBOARDING SCREEN
 * =================================================================
 *
 * Welcome screen for new users.
 * Shows app features and guides users to get started.
 */

import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

import { Screen, AppText, AppButton } from '../../src/components';
import { useAppTheme } from '../../src/theme';
import { storage } from '../../src/lib';
import { appConfig } from '../../src/config/app.config';
import { spacing } from '../../src/constants';

export default function OnboardingScreen() {
    const theme = useAppTheme();

    const handleGetStarted = async () => {
        // Mark onboarding as complete
        await storage.set(appConfig.storageKeys.onboardingComplete, true);

        // Navigate to login
        router.replace('/(auth)/login');
    };

    return (
        <Screen centered padded>
            <View style={styles.content}>
                {/* Logo placeholder */}
                <View
                    style={[
                        styles.logoPlaceholder,
                        { backgroundColor: theme.colors.primaryContainer },
                    ]}
                >
                    <AppText variant="h2" style={{ color: theme.colors.primary }}>
                        📱
                    </AppText>
                </View>

                {/* Welcome content */}
                <View style={styles.textContainer}>
                    <AppText variant="h3" center bold>
                        Welcome to {appConfig.app.name}
                    </AppText>

                    <AppText
                        variant="body1"
                        secondary
                        center
                        style={styles.description}
                    >
                        {appConfig.app.description || 'Your mobile app template is ready to go!'}
                    </AppText>
                </View>

                {/* Feature highlights */}
                <View style={styles.features}>
                    <FeatureItem
                        icon="🚀"
                        title="Fast & Modern"
                        description="Built with Expo and React Native"
                    />
                    <FeatureItem
                        icon="🎨"
                        title="Beautiful Design"
                        description="Material Design 3 theming"
                    />
                    <FeatureItem
                        icon="🔐"
                        title="Secure"
                        description="Built-in authentication flow"
                    />
                </View>
            </View>

            {/* Action button */}
            <View style={styles.footer}>
                <AppButton
                    fullWidth
                    onPress={handleGetStarted}
                >
                    Get Started
                </AppButton>
            </View>
        </Screen>
    );
}

/**
 * Feature item component
 */
function FeatureItem({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    const theme = useAppTheme();

    return (
        <View style={styles.featureItem}>
            <View
                style={[
                    styles.featureIcon,
                    { backgroundColor: theme.colors.surfaceVariant },
                ]}
            >
                <AppText variant="h5">{icon}</AppText>
            </View>
            <View style={styles.featureText}>
                <AppText variant="body1" bold>
                    {title}
                </AppText>
                <AppText variant="body2" secondary>
                    {description}
                </AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    description: {
        marginTop: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    features: {
        width: '100%',
        gap: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        flex: 1,
    },
    footer: {
        width: '100%',
        paddingTop: spacing.lg,
    },
});
