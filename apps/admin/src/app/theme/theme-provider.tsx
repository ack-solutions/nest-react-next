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
import { contrast, presets } from './presets';
import { shadows } from './shadows';
import { typography } from './typography';
import {
    initialSetting,
    useSettingsContext,
} from '../contexts/settings-provider';


type ThemeProviderProps = {
    children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const settings = useSettingsContext();

    // Get contrast options
    const contrastOption = contrast(settings.contrast === 'bold', settings.colorScheme);

    const initialTheme = useMemo(() => ({
        colorSchemes,
        shadows: shadows(settings.colorScheme),
        customShadows: customShadows(settings.colorScheme),
        shape: {
            borderRadius: settings.compactLayout ? 4 : 8,
        },
        components: {
            ...components,
            ...contrastOption.components,
        },
        typography: {
            ...typography,
            ...(settings.compactLayout && {
                h1: {
                    ...typography.h1,
                    fontSize: '2rem',
                },
                h2: {
                    ...typography.h2,
                    fontSize: '1.75rem',
                },
                h3: {
                    ...typography.h3,
                    fontSize: '1.5rem',
                },
                h4: {
                    ...typography.h4,
                    fontSize: '1.25rem',
                },
                h5: {
                    ...typography.h5,
                    fontSize: '1.125rem',
                },
                h6: {
                    ...typography.h6,
                    fontSize: '1rem',
                },
            }),
        },
        cssVarPrefix: '',
    }), [
        settings.colorScheme,
        settings.contrast,
        settings.compactLayout,
        contrastOption,
    ]);

    const updateTheme = useMemo(() => {
        return {
            ...initialTheme,
            colorSchemes: {
                ...colorSchemes,
                light: {
                    palette: {
                        ...colorSchemes?.light?.palette,
                        ...presets(settings.primaryColor).palette,
                        ...contrastOption.theme?.palette,
                        background: {
                            ...colorSchemes?.light?.palette?.background,
                            ...contrastOption.theme?.palette?.background,
                        },
                    },
                },
                dark: {
                    palette: {
                        ...colorSchemes?.dark?.palette,
                        ...presets(settings.primaryColor).palette,
                        ...(settings.contrast === 'bold' && {
                            background: {
                                ...colorSchemes?.dark?.palette?.background,
                                default: '#0a0a0a',
                                paper: '#1a1a1a',
                            },
                        }),
                    },
                },
            },
            customShadows: {
                ...customShadows(settings.colorScheme),
                ...presets(settings.primaryColor).customShadows,
            },
            components: {
                ...initialTheme.components,
                ...(settings.compactLayout && {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                padding: '12px',
                            },
                        },
                    },
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                minHeight: '32px',
                                padding: '6px 12px',
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                '& .MuiInputBase-root': {
                                    minHeight: '36px',
                                },
                            },
                        },
                    },
                }),
            },
        };
    }, [
        settings,
        initialTheme,
        contrastOption,
    ]);

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
                        ...(settings.compactLayout && {
                            '& .MuiContainer-root': {
                                paddingTop: '8px !important',
                                paddingBottom: '8px !important',
                            },
                            '& .MuiStack-root': {
                                gap: '8px !important',
                            },
                            '& .MuiBox-root': {
                                padding: '8px',
                            },
                        }),
                    },
                }}
            />
            {children}
        </CssVarsProvider>
    );
}
