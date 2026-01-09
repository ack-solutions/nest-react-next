/**
 * =================================================================
 * APP BUTTON COMPONENT
 * =================================================================
 *
 * Button component with multiple modes and states.
 * Uses react-native-paper's Button with custom styling.
 */

import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button, ButtonProps, ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { spacing, borderRadius } from '../constants';

// Button mode types
export type ButtonMode = 'primary' | 'secondary' | 'outline' | 'text';

export interface AppButtonProps extends Omit<ButtonProps, 'mode'> {
    /** Button mode/style */
    mode?: ButtonMode;
    /** Show loading indicator */
    loading?: boolean;
    /** Full width button */
    fullWidth?: boolean;
    /** Custom style */
    style?: ViewStyle;
    /** Custom label style */
    labelStyle?: TextStyle;
}

// Map custom modes to Paper modes
const modeMap: Record<ButtonMode, ButtonProps['mode']> = {
    primary: 'contained',
    secondary: 'contained-tonal',
    outline: 'outlined',
    text: 'text',
};

/**
 * AppButton component - use for all button interactions
 */
export function AppButton({
    mode = 'primary',
    loading = false,
    fullWidth = false,
    disabled,
    children,
    style,
    labelStyle,
    icon,
    ...rest
}: AppButtonProps) {
    const theme = useAppTheme();

    // Build button styles
    const buttonStyles: ViewStyle[] = [
        styles.button,
        fullWidth && styles.fullWidth,
        style,
    ].filter(Boolean) as ViewStyle[];

    // Custom loading icon
    const loadingIcon = loading
        ? () => (
            <ActivityIndicator
                size="small"
                color={
                    mode === 'primary'
                        ? theme.colors.onPrimary
                        : theme.colors.primary
                }
            />
        )
        : undefined;

    return (
        <Button
            mode={modeMap[mode]}
            disabled={disabled || loading}
            icon={loading ? loadingIcon : icon}
            style={buttonStyles}
            labelStyle={[styles.label, labelStyle]}
            contentStyle={styles.content}
            {...rest}
        >
            {children}
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.md,
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        minHeight: 48,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AppButton;
