import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/material/themeCssVarsAugmentation';
import { initialSetting, useSettingsContext } from '@libs/react-core';
import { GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, Experimental_CssVarsProvider as CssVarsProvider, getInitColorSchemeScript as _getInitColorSchemeScript, ThemeOptions } from '@mui/material/styles';
import { useMemo } from 'react';

import ComponentsOverrides from './components';
import { customShadows } from './custom-shadows';
import { presets } from './options/presets';
import { colorSchemes } from './palette';
import { shadows } from './shadows';
import shape from './shape';
import { typography } from './typography';


type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
    const settings = useSettingsContext();
    // const darkModeOption = darkMode(settings.themeMode);
    // const presetsOption = presets(settings.themeColorPresets);
    // const contrastOption = contrast(settings.themeContrast === 'bold', settings.themeMode);

    const initialTheme = {
        colorSchemes,
        shadows: shadows(settings.colorScheme),
        customShadows: customShadows(settings.colorScheme),
        shape: shape,
        typography,
        cssVarPrefix: '',
    };

    const updateTheme: ThemeOptions = useMemo(() => {
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
                        /** [1] */
                        ...presets(settings.primaryColor),
                    },
                },
            },
            customShadows: {
                ...customShadows(settings.colorScheme),
                /** [1] */
                ...presets(settings.primaryColor).customShadows,
            },
        };
    }, [settings]);

    const theme = createTheme(updateTheme);

    theme.components = ComponentsOverrides(theme);

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
