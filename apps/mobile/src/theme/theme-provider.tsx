/**
 * =================================================================
 * THEME PROVIDER
 * =================================================================
 *
 * Provides theme context to the entire app with:
 * - Light/dark mode support
 * - Persistent theme preference
 * - System theme detection
 * - Runtime theme switching
 */

import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, AppTheme } from './themes';

// Storage key for theme preference
const THEME_STORAGE_KEY = '@app/theme-preference';

// Theme mode types
export type ThemeMode = 'light' | 'dark' | 'system';

// Theme context value
export interface ThemeContextValue {
    theme: AppTheme;
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

// Create context
export const ThemeContext = createContext<ThemeContextValue | null>(null);

// Provider props
interface ThemeProviderProps {
    children: ReactNode;
    defaultMode?: ThemeMode;
}

/**
 * ThemeProvider component
 * Wraps the app with theme context and PaperProvider
 */
export function ThemeProvider({
    children,
    defaultMode = 'system',
}: ThemeProviderProps) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>(defaultMode);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme preference on mount
    useEffect(() => {
        const loadThemePreference = async () => {
            try {
                const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
                    setThemeModeState(savedMode as ThemeMode);
                }
            } catch (error) {
                console.warn('Failed to load theme preference:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadThemePreference();
    }, []);

    // Save theme preference when it changes
    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        setThemeModeState(mode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
    }, []);

    // Toggle between light and dark (skips system)
    const toggleTheme = useCallback(() => {
        setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
    }, [themeMode, setThemeMode]);

    // Determine if dark mode is active
    const isDark = useMemo(() => {
        if (themeMode === 'system') {
            return systemColorScheme === 'dark';
        }
        return themeMode === 'dark';
    }, [themeMode, systemColorScheme]);

    // Get the active theme
    const theme = useMemo(() => {
        return isDark ? darkTheme : lightTheme;
    }, [isDark]);

    // Context value
    const contextValue = useMemo<ThemeContextValue>(
        () => ({
            theme,
            themeMode,
            isDark,
            setThemeMode,
            toggleTheme,
        }),
        [theme, themeMode, isDark, setThemeMode, toggleTheme]
    );

    // Don't render until theme is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={contextValue}>
            <PaperProvider theme={theme}>{children}</PaperProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
