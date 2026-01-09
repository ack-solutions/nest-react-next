/**
 * =================================================================
 * APP CARD COMPONENT
 * =================================================================
 *
 * Card container component with elevation and padding.
 * Uses react-native-paper's Surface with custom styling.
 */

import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Surface } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { spacing, borderRadius } from '../constants';

export interface AppCardProps {
    /** Card content */
    children: ReactNode;
    /** Elevation level (0-5) */
    elevation?: 0 | 1 | 2 | 3 | 4 | 5;
    /** Custom padding */
    padding?: number;
    /** Custom style */
    style?: ViewStyle;
    /** Make card pressable */
    onPress?: () => void;
    /** Disable default border radius */
    noBorderRadius?: boolean;
}

/**
 * AppCard component - use for card containers
 */
export function AppCard({
    children,
    elevation = 1,
    padding = spacing.base,
    style,
    onPress,
    noBorderRadius = false,
}: AppCardProps) {
    const theme = useAppTheme();

    const cardStyles: ViewStyle[] = [
        styles.card,
        { padding },
        !noBorderRadius && styles.rounded,
        style,
    ].filter(Boolean) as ViewStyle[];

    const content = (
        <Surface elevation={elevation} style={cardStyles}>
            {children}
        </Surface>
    );

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    pressed && { opacity: 0.9 },
                ]}
            >
                {content}
            </Pressable>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
    },
    rounded: {
        borderRadius: borderRadius.md,
    },
});

export default AppCard;
