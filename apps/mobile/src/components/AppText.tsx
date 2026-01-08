/**
 * =================================================================
 * APP TEXT COMPONENT
 * =================================================================
 *
 * Typography component with predefined variants.
 * Uses react-native-paper's Text with custom styling.
 */

import React, { ReactNode } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { Text, TextProps } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { typography as typographyTokens } from '../constants';

// Typography variant types
export type TextVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'overline'
    | 'label';

// Map custom variants to Paper variants
const variantMap: Record<TextVariant, TextProps<string>['variant']> = {
    h1: 'displayLarge',
    h2: 'displayMedium',
    h3: 'displaySmall',
    h4: 'headlineMedium',
    h5: 'headlineSmall',
    h6: 'titleLarge',
    body1: 'bodyLarge',
    body2: 'bodyMedium',
    caption: 'bodySmall',
    overline: 'labelSmall',
    label: 'labelMedium',
};

export interface AppTextProps extends Omit<TextProps<string>, 'variant'> {
    /** Typography variant */
    variant?: TextVariant;
    /** Text color (uses theme if not provided) */
    color?: string;
    /** Make text bold */
    bold?: boolean;
    /** Make text semibold */
    semiBold?: boolean;
    /** Center align text */
    center?: boolean;
    /** Secondary color (grey) */
    secondary?: boolean;
    /** Muted color (lighter grey) */
    muted?: boolean;
    /** Custom style */
    style?: TextStyle;
    /** Children */
    children: ReactNode;
}

/**
 * AppText component - use for all text rendering
 */
export function AppText({
    variant = 'body1',
    color,
    bold,
    semiBold,
    center,
    secondary,
    muted,
    style,
    children,
    ...rest
}: AppTextProps) {
    const theme = useAppTheme();

    // Determine text color
    let textColor = color ?? theme.colors.onBackground;
    if (secondary) {
        textColor = theme.colors.onSurfaceVariant;
    }
    if (muted) {
        textColor = theme.colors.outline;
    }

    // Build style array
    const textStyles: TextStyle[] = [
        { color: textColor },
        bold && { fontWeight: typographyTokens.fontWeight.bold },
        semiBold && { fontWeight: typographyTokens.fontWeight.semiBold },
        center && styles.center,
        style,
    ].filter(Boolean) as TextStyle[];

    return (
        <Text
            variant={variantMap[variant]}
            style={textStyles}
            {...rest}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    center: {
        textAlign: 'center',
    },
});

export default AppText;
