/**
 * =================================================================
 * PROFILE SCREEN
 * =================================================================
 *
 * User profile screen with theme toggle and logout.
 */

import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { List, Switch, Avatar } from 'react-native-paper';

import { Screen, AppText, AppButton, AppCard, AppDivider } from '../../src/components';
import { useAuth } from '@libs/react-shared';
import { useTheme, useAppTheme } from '../../src/theme';
import { spacing } from '../../src/constants';

export default function ProfileScreen() {
    const { currentUser: user, logout, isLoading, isAuthenticated } = useAuth();
    const { isDark, toggleTheme, themeMode, setThemeMode } = useTheme();
    const theme = useAppTheme();

    if (isLoading) return null; // or loader

    if (!isAuthenticated) {
        return (
            <Screen scroll padded>
                <View style={[styles.header, { marginTop: spacing.xl }]}>
                    <Avatar.Icon
                        size={80}
                        icon="account"
                        style={{ backgroundColor: theme.colors.surfaceVariant }}
                        color={theme.colors.primary}
                    />
                    <View style={styles.headerText}>
                        <AppText variant="h5" bold>
                            Guest User
                        </AppText>
                        <AppText variant="body2" secondary>
                            Sign in to access your profile
                        </AppText>
                    </View>
                </View>

                <View style={styles.section}>
                    <AppButton
                        fullWidth
                        onPress={() => router.push('/(auth)/login')}
                        style={styles.logoutButton}
                    >
                        Sign In
                    </AppButton>
                    <AppButton
                        mode="text"
                        fullWidth
                        onPress={() => router.push('/(auth)/register')}
                        style={{ marginTop: spacing.sm }}
                    >
                        Create Account
                    </AppButton>
                </View>

                {/* Settings section - show for guests too */}
                <AppCard style={styles.section}>
                    <AppText variant="h6" bold style={styles.sectionTitle}>
                        Appearance
                    </AppText>

                    {/* Dark mode toggle */}
                    <List.Item
                        title="Dark Mode"
                        description={`Currently ${isDark ? 'on' : 'off'}`}
                        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                        right={() => (
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                color={theme.colors.primary}
                            />
                        )}
                        style={styles.listItem}
                    />

                    {/* Theme mode selector */}
                    <List.Item
                        title="Theme Mode"
                        description={themeMode === 'system' ? 'Follow system' : themeMode}
                        left={(props) => <List.Icon {...props} icon="palette" />}
                        onPress={() => {
                            // Cycle through modes: light -> dark -> system
                            const modes = ['light', 'dark', 'system'] as const;
                            const currentIndex = modes.indexOf(themeMode);
                            const nextIndex = (currentIndex + 1) % modes.length;
                            setThemeMode(modes[nextIndex]);
                        }}
                        right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        style={styles.listItem}
                    />
                </AppCard>
            </Screen>
        );
    }

    // Handle logout
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    },
                },
            ]
        );
    };

    // Get initials for avatar
    const initials = user
        ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() ||
        user.authUser?.email?.[0]?.toUpperCase() ||
        'U'
        : 'U';

    return (
        <Screen scroll padded>
            {/* Profile header */}
            <View style={styles.header}>
                <Avatar.Text
                    size={80}
                    label={initials}
                    style={{ backgroundColor: theme.colors.primary }}
                />
                <View style={styles.headerText}>
                    <AppText variant="h5" bold>
                        {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.authUser?.email?.split('@')[0] || 'User'}
                    </AppText>
                    <AppText variant="body2" secondary>
                        {user?.authUser?.email}
                    </AppText>
                </View>
            </View>

            {/* Settings section */}
            <AppCard style={styles.section}>
                <AppText variant="h6" bold style={styles.sectionTitle}>
                    Appearance
                </AppText>

                {/* Dark mode toggle */}
                <List.Item
                    title="Dark Mode"
                    description={`Currently ${isDark ? 'on' : 'off'}`}
                    left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                    right={() => (
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            color={theme.colors.primary}
                        />
                    )}
                    style={styles.listItem}
                />

                {/* Theme mode selector */}
                <List.Item
                    title="Theme Mode"
                    description={themeMode === 'system' ? 'Follow system' : themeMode}
                    left={(props) => <List.Icon {...props} icon="palette" />}
                    onPress={() => {
                        // Cycle through modes: light -> dark -> system
                        const modes = ['light', 'dark', 'system'] as const;
                        const currentIndex = modes.indexOf(themeMode);
                        const nextIndex = (currentIndex + 1) % modes.length;
                        setThemeMode(modes[nextIndex]);
                    }}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    style={styles.listItem}
                />
            </AppCard>

            {/* Account section */}
            <AppCard style={styles.section}>
                <AppText variant="h6" bold style={styles.sectionTitle}>
                    Account
                </AppText>

                <List.Item
                    title="Edit Profile"
                    left={(props) => <List.Icon {...props} icon="account-edit" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        // TODO: Navigate to edit profile
                        Alert.alert('Coming Soon', 'Edit profile feature is not implemented yet.');
                    }}
                    style={styles.listItem}
                />

                <List.Item
                    title="Change Password"
                    left={(props) => <List.Icon {...props} icon="lock-reset" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        // TODO: Navigate to change password
                        Alert.alert('Coming Soon', 'Change password feature is not implemented yet.');
                    }}
                    style={styles.listItem}
                />

                <List.Item
                    title="Notifications"
                    left={(props) => <List.Icon {...props} icon="bell" />}
                    right={(props) => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => {
                        // TODO: Navigate to notifications settings
                        Alert.alert('Coming Soon', 'Notifications settings is not implemented yet.');
                    }}
                    style={styles.listItem}
                />
            </AppCard>

            {/* Logout button */}
            <View style={styles.logoutSection}>
                <AppButton
                    mode="outline"
                    fullWidth
                    onPress={handleLogout}
                    style={styles.logoutButton}
                >
                    Logout
                </AppButton>
            </View>

            {/* App info */}
            <View style={styles.appInfo}>
                <AppText variant="caption" secondary center>
                    Version 1.0.0
                </AppText>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        paddingTop: spacing.md,
    },
    headerText: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    section: {
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    sectionTitle: {
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    listItem: {
        paddingVertical: spacing.xs,
    },
    logoutSection: {
        marginTop: spacing.lg,
    },
    logoutButton: {
        borderColor: 'transparent',
    },
    appInfo: {
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },
});
