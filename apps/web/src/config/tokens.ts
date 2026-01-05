/**
 * Design Tokens - Single Source of Truth
 * All color values are defined here and used by both:
 * - theme.config.ts (TypeScript)
 * - ThemeProvider (CSS Variables)
 */

// ============================================
// COLOR TOKENS
// ============================================

export const colorTokens = {
    // Primary Colors (Blue)
    primary: {
        lighter: '#e0f2fe',
        light: '#38bdf8',
        DEFAULT: '#0ea5e9',
        dark: '#0284c7',
        darker: '#0369a1',
    },

    // Secondary Colors (Purple)
    secondary: {
        lighter: '#f3e8ff',
        light: '#c084fc',
        DEFAULT: '#a855f7',
        dark: '#9333ea',
        darker: '#7c3aed',
    },

    // Ternary/Accent Colors (Teal)
    ternary: {
        lighter: '#ccfbf1',
        light: '#5eead4',
        DEFAULT: '#14b8a6',
        dark: '#0d9488',
        darker: '#0f766e',
    },

    // Success Colors (Green)
    success: {
        lighter: '#dcfce7',
        light: '#4ade80',
        DEFAULT: '#22c55e',
        dark: '#16a34a',
        darker: '#15803d',
    },

    // Error Colors (Red)
    error: {
        lighter: '#fee2e2',
        light: '#f87171',
        DEFAULT: '#ef4444',
        dark: '#dc2626',
        darker: '#b91c1c',
    },

    // Warning Colors (Amber)
    warning: {
        lighter: '#fef3c7',
        light: '#fbbf24',
        DEFAULT: '#f59e0b',
        dark: '#d97706',
        darker: '#b45309',
    },

    // Info Colors (Sky Blue)
    info: {
        lighter: '#e0f2fe',
        light: '#38bdf8',
        DEFAULT: '#0ea5e9',
        dark: '#0284c7',
        darker: '#0369a1',
    },

    // Grey Scale
    grey: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
    },

    // Semantic Colors
    black: '#1a1a1a',
    pureBlack: '#000000',
    white: '#ffffff',

    // Text Colors
    text: {
        primary: '#18181b',
        secondary: '#71717a',
        disabled: '#a1a1aa',
    },

    // Background Colors
    background: {
        DEFAULT: '#ffffff',
        secondary: '#fafafa',
        elevated: '#ffffff',
    },

    // Foreground Colors
    foreground: {
        DEFAULT: '#18181b',
        muted: '#71717a',
    },

    // Border Colors
    border: {
        DEFAULT: '#e4e4e7',
        subtle: '#e5e7eb',
    },

    // Divider Colors
    divider: {
        DEFAULT: '#e4e4e7',
        strong: '#d4d4d8',
    },
} as const;

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export const typographyTokens = {
    fontFamily: {
        sans: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace",
    },
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
    },
    fontWeight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
} as const;

// ============================================
// SPACING TOKENS
// ============================================

export const spacingTokens = {
    section: {
        sm: '3rem',
        md: '4rem',
        lg: '6rem',
        xl: '8rem',
    },
} as const;

// ============================================
// BORDER RADIUS TOKENS
// ============================================

export const radiusTokens = {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px',
} as const;

// ============================================
// SHADOW TOKENS
// ============================================

export const shadowTokens = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    glow: '0 0 20px rgba(14, 165, 233, 0.3)',
} as const;

// ============================================
// TRANSITION TOKENS
// ============================================

export const transitionTokens = {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// Z-INDEX TOKENS
// ============================================

export const zIndexTokens = {
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
} as const;

// ============================================
// BREAKPOINT TOKENS
// ============================================

export const breakpointTokens = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// ============================================
// CSS VARIABLE GENERATOR
// ============================================

/**
 * Generates CSS variable string from color tokens
 * This is used by ThemeProvider to inject variables at runtime
 */
export function generateCSSVariables(): string {
    const { primary, secondary, ternary, success, error, warning, info, grey, text, background, foreground, border, divider, black, pureBlack } = colorTokens;

    return `
    /* Primary */
    --color-primary-lighter: ${primary.lighter};
    --color-primary-light: ${primary.light};
    --color-primary: ${primary.DEFAULT};
    --color-primary-dark: ${primary.dark};
    --color-primary-darker: ${primary.darker};

    /* Secondary */
    --color-secondary-lighter: ${secondary.lighter};
    --color-secondary-light: ${secondary.light};
    --color-secondary: ${secondary.DEFAULT};
    --color-secondary-dark: ${secondary.dark};
    --color-secondary-darker: ${secondary.darker};

    /* Ternary */
    --color-ternary-lighter: ${ternary.lighter};
    --color-ternary-light: ${ternary.light};
    --color-ternary: ${ternary.DEFAULT};
    --color-ternary-dark: ${ternary.dark};
    --color-ternary-darker: ${ternary.darker};

    /* Success */
    --color-success-lighter: ${success.lighter};
    --color-success-light: ${success.light};
    --color-success: ${success.DEFAULT};
    --color-success-dark: ${success.dark};
    --color-success-darker: ${success.darker};

    /* Error */
    --color-error-lighter: ${error.lighter};
    --color-error-light: ${error.light};
    --color-error: ${error.DEFAULT};
    --color-error-dark: ${error.dark};
    --color-error-darker: ${error.darker};

    /* Warning */
    --color-warning-lighter: ${warning.lighter};
    --color-warning-light: ${warning.light};
    --color-warning: ${warning.DEFAULT};
    --color-warning-dark: ${warning.dark};
    --color-warning-darker: ${warning.darker};

    /* Info */
    --color-info-lighter: ${info.lighter};
    --color-info-light: ${info.light};
    --color-info: ${info.DEFAULT};
    --color-info-dark: ${info.dark};
    --color-info-darker: ${info.darker};

    /* Grey Scale */
    --color-grey-50: ${grey[50]};
    --color-grey-100: ${grey[100]};
    --color-grey-200: ${grey[200]};
    --color-grey-300: ${grey[300]};
    --color-grey-400: ${grey[400]};
    --color-grey-500: ${grey[500]};
    --color-grey-600: ${grey[600]};
    --color-grey-700: ${grey[700]};
    --color-grey-800: ${grey[800]};
    --color-grey-900: ${grey[900]};

    /* Semantic */
    --color-black: ${black};
    --color-pure-black: ${pureBlack};

    /* Text */
    --color-text-primary: ${text.primary};
    --color-text-secondary: ${text.secondary};
    --color-text-disabled: ${text.disabled};

    /* Background */
    --color-background: ${background.DEFAULT};
    --color-background-secondary: ${background.secondary};
    --color-background-elevated: ${background.elevated};

    /* Foreground */
    --color-foreground: ${foreground.DEFAULT};
    --color-foreground-muted: ${foreground.muted};

    /* Border */
    --color-border: ${border.DEFAULT};
    --color-border-subtle: ${border.subtle};

    /* Divider */
    --color-divider: ${divider.DEFAULT};
    --color-divider-strong: ${divider.strong};

    /* Typography */
    --font-sans: ${typographyTokens.fontFamily.sans};
    --font-mono: ${typographyTokens.fontFamily.mono};

    /* Gradient */
    --gradient-primary: linear-gradient(135deg, ${primary.DEFAULT} 0%, ${secondary.DEFAULT} 100%);
    `;
}

// Type exports
export type ColorTokens = typeof colorTokens;
export type TypographyTokens = typeof typographyTokens;
