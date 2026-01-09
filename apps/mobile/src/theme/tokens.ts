/**
 * =================================================================
 * THEME TOKENS - DESIGN SYSTEM
 * =================================================================
 *
 * This file contains all design tokens for the app.
 * Update these values to rebrand the app with your colors.
 *
 * The color palette is based on the admin app's palette.ts
 * for consistency across the monorepo.
 */

// ==================== COLORS ====================
// Update these to match your brand colors

export const colors = {
    // Primary brand colors (from admin palette.ts)
    primary: {
        lighter: '#bac0d1',
        light: '#657192',
        main: '#293b6b',
        dark: '#15234d',
        darker: '#0b1436',
    },

    // Secondary brand colors
    secondary: {
        lighter: '#c7cae9',
        light: '#7f85cb',
        main: '#4c4fb4',
        dark: '#3e3d9e',
        darker: '#29207d',
    },

    // Semantic colors
    success: {
        lighter: '#D3FCD2',
        light: '#77ED8B',
        main: '#22C55E',
        dark: '#118D57',
        darker: '#065E49',
    },

    warning: {
        lighter: '#FFF5CC',
        light: '#FFD666',
        main: '#FFAB00',
        dark: '#B76E00',
        darker: '#7A4100',
    },

    error: {
        lighter: '#FFE9D5',
        light: '#FFAC82',
        main: '#FF5630',
        dark: '#B71D18',
        darker: '#7A0916',
    },

    info: {
        lighter: '#CAFDF5',
        light: '#61F3F3',
        main: '#00B8D9',
        dark: '#006C9C',
        darker: '#003768',
    },

    // Grey scale
    grey: {
        50: '#FCFDFD',
        100: '#F9FAFB',
        200: '#F4F6F8',
        300: '#DFE3E8',
        400: '#C4CDD5',
        500: '#919EAB',
        600: '#637381',
        700: '#454F5B',
        800: '#1C252E',
        900: '#141A21',
    },

    // Common colors
    common: {
        black: '#000000',
        white: '#FFFFFF',
        transparent: 'transparent',
    },
} as const;

// ==================== SPACING ====================
// 4-point grid system

export const spacing = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
} as const;

// ==================== BORDER RADIUS ====================

export const borderRadius = {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
} as const;

// ==================== TYPOGRAPHY ====================
// Font weights and sizes (matching admin typography.ts)

export const typography = {
    fontFamily: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
    },

    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
    },

    fontSize: {
        xs: 10,
        sm: 12,
        md: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 32,
        '4xl': 40,
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

// ==================== SHADOWS ====================

export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: colors.common.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: colors.common.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: colors.common.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
} as const;

// Type exports for TypeScript support
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Typography = typeof typography;
export type Shadows = typeof shadows;
