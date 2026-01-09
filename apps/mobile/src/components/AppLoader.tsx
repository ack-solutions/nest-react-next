/**
 * =================================================================
 * APP LOADER COMPONENT
 * =================================================================
 *
 * Loading indicator component with multiple variants.
 * Uses react-native-paper's ActivityIndicator.
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { AppText } from './AppText';
import { spacing } from '../constants';

export interface AppLoaderProps {
    /** Size of the loader */
    size?: 'small' | 'large' | number;
    /** Custom color (uses primary if not provided) */
    color?: string;
    /** Loading text to display */
    text?: string;
    /** Full screen overlay */
    fullScreen?: boolean;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * AppLoader component - use for loading states
 */
export function AppLoader({
    size = 'large',
    color,
    text,
    fullScreen = false,
    style,
}: AppLoaderProps) {
    const theme = useAppTheme();
    const loaderColor = color ?? theme.colors.primary;

    const content = (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                size={size}
                color={loaderColor}
                animating
            />
            {text && (
                <AppText
                    variant="body2"
                    secondary
                    style={styles.text}
                >
                    {text}
                </AppText>
            )}
        </View>
    );

    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, { backgroundColor: theme.colors.backdrop }]}>
                <View style={[styles.fullScreenContent, { backgroundColor: theme.colors.surface }]}>
                    {content}
                </View>
            </View>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.base,
    },
    text: {
        marginTop: spacing.md,
    },
    fullScreen: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    fullScreenContent: {
        padding: spacing.xl,
        borderRadius: 12,
        alignItems: 'center',
    },
});

export default AppLoader;
