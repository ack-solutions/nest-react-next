/**
 * =================================================================
 * APP DIVIDER COMPONENT
 * =================================================================
 *
 * Horizontal divider with optional label.
 * Uses react-native-paper's Divider with custom styling.
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Divider } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { spacing } from '../constants';
import { AppText } from './AppText';

export interface AppDividerProps {
    /** Label to display in the middle */
    label?: string;
    /** Vertical margin */
    marginVertical?: number;
    /** Custom style */
    style?: ViewStyle;
}

/**
 * AppDivider component - use for section separation
 */
export function AppDivider({
    label,
    marginVertical = spacing.base,
    style,
}: AppDividerProps) {
    const theme = useAppTheme();

    if (label) {
        return (
            <View style={[styles.labelContainer, { marginVertical }, style]}>
                <Divider style={styles.labelDivider} />
                <AppText
                    variant="caption"
                    secondary
                    style={styles.label}
                >
                    {label}
                </AppText>
                <Divider style={styles.labelDivider} />
            </View>
        );
    }

    return (
        <Divider style={[styles.divider, { marginVertical }, style]} />
    );
}

const styles = StyleSheet.create({
    divider: {
        width: '100%',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    labelDivider: {
        flex: 1,
    },
    label: {
        marginHorizontal: spacing.md,
    },
});

export default AppDivider;
