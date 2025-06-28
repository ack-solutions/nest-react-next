import {
    GlobalStyles,
    createTheme,
    Experimental_CssVarsProvider as CssVarsProvider,
    getInitColorSchemeScript as _getInitColorSchemeScript,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';

import { components } from './components';
import { customShadows } from './custom-shadows';
import { colorSchemes } from './palette';
import {
    initialSetting,
    useSettingsContext,
} from '../contexts/settings-provider';
import { presets } from './options/presets';
import { shadows } from './shadows';
import { typography } from './typography';


type ThemeProviderProps = {
    children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const settings = useSettingsContext();
    // const darkModeOption = darkMode(settings.themeMode);
    // const presetsOption = presets(settings.themeColorPresets);
    // const contrastOption = contrast(settings.themeContrast === 'bold', settings.themeMode);

    const initialTheme = useMemo(() => ({
        colorSchemes,
        shadows: shadows(settings.colorScheme),
        customShadows: customShadows(settings.colorScheme),
        shape: { borderRadius: 8 },
        components,
        typography,
        cssVarPrefix: '',
    }), [settings.colorScheme]);

    const updateTheme = useMemo(() => {
        return {
            ...initialTheme,
            colorSchemes: {
                ...colorSchemes,
                light: {
                    palette: {
                        ...colorSchemes?.light?.palette,
                        ...presets(settings.primaryColor).palette,
                        background: {
                            ...colorSchemes?.light?.palette?.background,
                            default: settings.contrast,
                            defaultChannel: settings.contrast,
                        },
                    },
                },
                dark: {
                    palette: {
                        ...colorSchemes?.dark?.palette,
                        ...presets(settings.primaryColor),
                    },
                },
            },
            customShadows: {
                ...customShadows(settings.colorScheme),
                ...presets(settings.primaryColor).customShadows,
            },
        };
    }, [settings, initialTheme]);

    const theme = createTheme(updateTheme);

    const schemeConfig = {
        modeStorageKey: 'theme-mode',
        defaultMode: initialSetting.colorScheme,
    };

    return (
        <CssVarsProvider
            theme={theme}
            defaultMode={schemeConfig.defaultMode}
            modeStorageKey={schemeConfig.modeStorageKey}
        >
            <CssBaseline />
            <GlobalStyles
                styles={{
                    '*': {
                        '::-webkit-scrollbar': {
                            width: 5,
                            height: 4,
                        },
                        ' ::-webkit-scrollbar-track': {
                            background: theme.palette.grey[50],
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: theme.palette.grey[300],
                            borderRadius: 12,
                        },
                        '::-webkit-scrollbar-thumb:hover': {
                            background: theme.palette.grey[400],
                        },
                    },
                    input: {
                        '&[type=number]': {
                            MozAppearance: 'textfield',
                            '&::-webkit-outer-spin-button': {
                                margin: 0,
                                WebkitAppearance: 'none',
                            },
                            '&::-webkit-inner-spin-button': {
                                margin: 0,
                                WebkitAppearance: 'none',
                            },
                        },
                    },
                    body: {
                        a: {
                            textDecoration: 'none',
                            color: 'inherit',
                        },
                    },
                }}
            />
            {children}
        </CssVarsProvider>
    );
}
