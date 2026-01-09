/**
 * =================================================================
 * USE THEME HOOK
 * =================================================================
 *
 * Hook for accessing theme context in components.
 */

import { useContext } from 'react';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { ThemeContext, ThemeContextValue } from './theme-provider';
import { AppTheme } from './themes';

/**
 * Custom hook to access the theme context
 * Provides theme mode controls and current theme
 */
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}

/**
 * Hook to access react-native-paper theme directly
 * Use this when you just need the theme colors/styles
 */
export function useAppTheme(): AppTheme {
    return usePaperTheme<AppTheme>();
}

/**
 * Hook to get just the theme colors for convenience
 */
export function useThemeColors() {
    const theme = useAppTheme();
    return theme.colors;
}

export default useTheme;
