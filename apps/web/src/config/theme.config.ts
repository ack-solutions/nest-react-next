/**
 * Theme Configuration
 * Design tokens and theme settings for the application
 */

export const themeConfig = {
    // Color Palette
    colors: {
        // Primary Brand Colors
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9', // Main primary color
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
        },
        // Secondary Colors
        secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7', // Main secondary color
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764',
        },
        // Neutral/Gray Scale
        neutral: {
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
            950: '#09090b',
        },
        // Status Colors
        success: {
            light: '#10b981',
            main: '#059669',
            dark: '#047857',
        },
        warning: {
            light: '#fbbf24',
            main: '#f59e0b',
            dark: '#d97706',
        },
        error: {
            light: '#f87171',
            main: '#ef4444',
            dark: '#dc2626',
        },
        info: {
            light: '#60a5fa',
            main: '#3b82f6',
            dark: '#2563eb',
        },
    },

    // Typography
    typography: {
        fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        },
        fontSize: {
            xs: ['0.75rem', { lineHeight: '1rem' }],
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            base: ['1rem', { lineHeight: '1.5rem' }],
            lg: ['1.125rem', { lineHeight: '1.75rem' }],
            xl: ['1.25rem', { lineHeight: '1.75rem' }],
            '2xl': ['1.5rem', { lineHeight: '2rem' }],
            '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            '5xl': ['3rem', { lineHeight: '1.2' }],
            '6xl': ['3.75rem', { lineHeight: '1.1' }],
        },
        fontWeight: {
            thin: '100',
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            extrabold: '800',
        },
    },

    // Spacing
    spacing: {
        section: {
            xs: '2rem',    // 32px
            sm: '3rem',    // 48px
            md: '4rem',    // 64px
            lg: '6rem',    // 96px
            xl: '8rem',    // 128px
        },
        container: {
            padding: {
                mobile: '1rem',
                tablet: '1.5rem',
                desktop: '2rem',
            },
        },
    },

    // Border Radius
    borderRadius: {
        none: '0',
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        glow: '0 0 20px rgba(14, 165, 233, 0.3)',
    },

    // Transitions
    transitions: {
        fast: 'all 0.15s ease',
        DEFAULT: 'all 0.2s ease',
        slow: 'all 0.3s ease',
        bounce: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },

    // Z-Index Scale
    zIndex: {
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modalBackdrop: 1300,
        modal: 1400,
        popover: 1500,
        tooltip: 1600,
    },

    // Breakpoints
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

export default themeConfig;
