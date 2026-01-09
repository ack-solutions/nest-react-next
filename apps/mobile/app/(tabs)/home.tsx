/**
 * =================================================================
 * HOME SCREEN
 * =================================================================
 *
 * Main home screen for authenticated users.
 */

import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen, AppText, AppCard } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useAppTheme } from '../../src/theme';
import { spacing } from '../../src/constants';
import { appConfig } from '../../src/config/app.config';

export default function HomeScreen() {
    const { currentUser: user } = useAuth();
    const theme = useAppTheme();

    const greeting = getGreeting();

    return (
        <Screen scroll padded>
            {/* Header */}
            <View style={styles.header}>
                <AppText variant="body1" secondary>
                    {greeting}
                </AppText>
                <AppText variant="h4" bold>
                    {user?.firstName || user?.authUser?.email?.split('@')[0] || 'User'}
                </AppText>
            </View>

            {/* Welcome card */}
            <AppCard style={styles.welcomeCard}>
                <View
                    style={[
                        styles.welcomeIcon,
                        { backgroundColor: theme.colors.primaryContainer },
                    ]}
                >
                    <MaterialCommunityIcons
                        name="hand-wave"
                        size={32}
                        color={theme.colors.primary}
                    />
                </View>
                <AppText variant="h5" bold>
                    Welcome to {appConfig.app.name}!
                </AppText>
                <AppText variant="body2" secondary style={styles.welcomeText}>
                    You've successfully set up your mobile app template.
                    Start building amazing features!
                </AppText>
            </AppCard>

            {/* Quick actions */}
            <View style={styles.section}>
                <AppText variant="h6" bold style={styles.sectionTitle}>
                    Quick Actions
                </AppText>

                <View style={styles.actionsGrid}>
                    <ActionCard
                        icon="chart-bar"
                        title="Dashboard"
                        description="View stats"
                    />
                    <ActionCard
                        icon="plus-circle"
                        title="Create"
                        description="New item"
                    />
                    <ActionCard
                        icon="magnify"
                        title="Search"
                        description="Find anything"
                    />
                    <ActionCard
                        icon="cog"
                        title="Settings"
                        description="Configure"
                    />
                </View>
            </View>

            {/* Recent activity placeholder */}
            <View style={styles.section}>
                <AppText variant="h6" bold style={styles.sectionTitle}>
                    Recent Activity
                </AppText>

                <AppCard>
                    <AppText variant="body1" secondary center>
                        No recent activity yet.
                    </AppText>
                </AppCard>
            </View>
        </Screen>
    );
}

/**
 * Action card component
 */
function ActionCard({
    icon,
    title,
    description,
}: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    title: string;
    description: string;
}) {
    const theme = useAppTheme();

    return (
        <AppCard style={styles.actionCard} onPress={() => { }}>
            <View style={styles.actionIcon}>
                <MaterialCommunityIcons name={icon} size={32} color={theme.colors.primary} />
            </View>
            <AppText variant="body2" bold>
                {title}
            </AppText>
            <AppText variant="caption" secondary>
                {description}
            </AppText>
        </AppCard>
    );
}

/**
 * Get time-based greeting
 */
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
}

const styles = StyleSheet.create({
    header: {
        marginBottom: spacing.lg,
    },
    welcomeCard: {
        alignItems: 'center',
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    welcomeIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    welcomeText: {
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    actionCard: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        padding: spacing.md,
    },
    actionIcon: {
        marginBottom: spacing.xs,
    },
});
