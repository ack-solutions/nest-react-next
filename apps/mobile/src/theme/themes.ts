/**
 * =================================================================
 * THEME DEFINITIONS - LIGHT & DARK
 * =================================================================
 *
 * This file defines the light and dark themes using react-native-paper.
 * The themes are based on the color tokens defined in tokens.ts.
 */

import {
    MD3LightTheme,
    MD3DarkTheme,
    MD3Theme,
    configureFonts,
} from 'react-native-paper';
import { colors, typography } from './tokens';

// Custom font configuration
const fontConfig = {
    displayLarge: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 0,
        lineHeight: 52,
    },
    displayMedium: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 0,
        lineHeight: 44,
    },
    displaySmall: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 0,
        lineHeight: 32,
    },
    headlineLarge: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.semiBold,
        letterSpacing: 0,
        lineHeight: 32,
    },
    headlineMedium: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semiBold,
        letterSpacing: 0,
        lineHeight: 28,
    },
    headlineSmall: {
        fontFamily: typography.fontFamily.semiBold,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semiBold,
        letterSpacing: 0,
        lineHeight: 24,
    },
    titleLarge: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0,
        lineHeight: 24,
    },
    titleMedium: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    titleSmall: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    bodyLarge: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.regular,
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    bodyMedium: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.regular,
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    bodySmall: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.regular,
        letterSpacing: 0.4,
        lineHeight: 16,
    },
    labelLarge: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelMedium: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelSmall: {
        fontFamily: typography.fontFamily.medium,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0.5,
        lineHeight: 14,
    },
} as const;

// ==================== LIGHT THEME ====================
export const lightTheme: MD3Theme = {
    ...MD3LightTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3LightTheme.colors,
        // Primary
        primary: colors.primary.main,
        onPrimary: colors.common.white,
        primaryContainer: colors.primary.lighter,
        onPrimaryContainer: colors.primary.darker,

        // Secondary
        secondary: colors.secondary.main,
        onSecondary: colors.common.white,
        secondaryContainer: colors.secondary.lighter,
        onSecondaryContainer: colors.secondary.darker,

        // Tertiary (using info colors)
        tertiary: colors.info.main,
        onTertiary: colors.common.white,
        tertiaryContainer: colors.info.lighter,
        onTertiaryContainer: colors.info.darker,

        // Error
        error: colors.error.main,
        onError: colors.common.white,
        errorContainer: colors.error.lighter,
        onErrorContainer: colors.error.darker,

        // Background & Surface
        background: colors.common.white,
        onBackground: colors.grey[800],
        surface: colors.common.white,
        onSurface: colors.grey[800],
        surfaceVariant: colors.grey[100],
        onSurfaceVariant: colors.grey[600],

        // Outline
        outline: colors.grey[400],
        outlineVariant: colors.grey[200],

        // Inverse
        inverseSurface: colors.grey[800],
        inverseOnSurface: colors.common.white,
        inversePrimary: colors.primary.light,

        // Additional
        shadow: colors.common.black,
        scrim: colors.common.black,
        surfaceDisabled: colors.grey[200],
        onSurfaceDisabled: colors.grey[500],
        backdrop: 'rgba(0, 0, 0, 0.5)',
    },
    roundness: 8,
};

// ==================== DARK THEME ====================
export const darkTheme: MD3Theme = {
    ...MD3DarkTheme,
    fonts: configureFonts({ config: fontConfig }),
    colors: {
        ...MD3DarkTheme.colors,
        // Primary
        primary: colors.primary.light,
        onPrimary: colors.primary.darker,
        primaryContainer: colors.primary.dark,
        onPrimaryContainer: colors.primary.lighter,

        // Secondary
        secondary: colors.secondary.light,
        onSecondary: colors.secondary.darker,
        secondaryContainer: colors.secondary.dark,
        onSecondaryContainer: colors.secondary.lighter,

        // Tertiary (using info colors)
        tertiary: colors.info.light,
        onTertiary: colors.info.darker,
        tertiaryContainer: colors.info.dark,
        onTertiaryContainer: colors.info.lighter,

        // Error
        error: colors.error.light,
        onError: colors.error.darker,
        errorContainer: colors.error.dark,
        onErrorContainer: colors.error.lighter,

        // Background & Surface
        background: colors.grey[900],
        onBackground: colors.common.white,
        surface: colors.grey[800],
        onSurface: colors.common.white,
        surfaceVariant: colors.grey[700],
        onSurfaceVariant: colors.grey[300],

        // Outline
        outline: colors.grey[600],
        outlineVariant: colors.grey[700],

        // Inverse
        inverseSurface: colors.grey[100],
        inverseOnSurface: colors.grey[900],
        inversePrimary: colors.primary.main,

        // Additional
        shadow: colors.common.black,
        scrim: colors.common.black,
        surfaceDisabled: colors.grey[700],
        onSurfaceDisabled: colors.grey[500],
        backdrop: 'rgba(0, 0, 0, 0.7)',
    },
    roundness: 8,
};

// Theme type export
export type AppTheme = typeof lightTheme;
