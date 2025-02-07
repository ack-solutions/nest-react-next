import { alpha } from '@mui/material/styles';


export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
    interface TypeBackground {
        neutral: string;
    }

    interface SimplePaletteColorOptions {
        lighter: string;
        darker: string;
    }

    interface PaletteColor {
        lighter: string;
        darker: string;
    }
}

const GREY = {
    0: '#FFFFFF',
    100: '#F9FAFB',
    200: '#F4F6F8',
    300: '#DFE3E8',
    400: '#C4CDD5',
    500: '#919EAB',
    600: '#637381',
    700: '#454F5B',
    800: '#212B36',
    900: '#161C24',
    lighter: '#F9FAFB',
    light: '#DFE3E8',
    main: '#919EAB',
    dark: '#454F5B',
    darker: '#161C24',
    contrastText: '#FFFFFF',
};

const PRIMARY = {
    lighter: '#bac0d1',
    light: '#657192',
    main: '#293b6b',
    dark: '#15234d',
    darker: '#0b1436',
    contrastText: '#FFFFFF',
};

const SECONDARY = {
    lighter: '#c7cae9',
    light: '#7f85cb',
    main: '#4c4fb4',
    dark: '#3e3d9e',
    darker: '#29207d',
    contrastText: '#FFFFFF',
};

const TERTIARY = {
    lighter: '#ffee33',
    light: '#ffee33',
    main: '#ffea00',
    dark: '#b2a300',
    darker: '#b2a300',
    contrastText: '#FFFFFF',
};

const INFO = {
    lighter: '#CAFDF5',
    light: '#61F3F3',
    main: '#00B8D9',
    dark: '#006C9C',
    darker: '#003768',
    contrastText: '#FFFFFF',
};

const SUCCESS = {
    lighter: '#f1fbf5',
    light: '#58af89',
    main: '#118d57',
    dark: '#0c7a46',
    darker: '#055d2c',
    contrastText: '#ffffff',
};

const WARNING = {
    lighter: '#ffe6b3',
    light: '#ffc44d',
    main: '#ffab00',
    dark: '#ff9a00',
    darker: '#ff8000',
    contrastText: '#ffffff',
};

const BLUE = {
    lighter: '#b3cce3',
    light: '#4d88bd',
    main: '#0055a1',
    dark: '#00448f',
    darker: '#002a74',
    contrastText: '#ffffff',
};

const ERROR = {
    lighter: '#FFE9D5',
    light: '#FFAC82',
    main: '#FF5630',
    dark: '#B71D18',
    darker: '#7A0916',
    contrastText: '#FFFFFF',
};

const COMMON = {
    common: {
        black: '#000000',
        white: '#FFFFFF',
    },
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    blue: BLUE,
    tertiary: TERTIARY,
    divider: alpha(GREY[500], 0.2),
    action: {
        hover: alpha(GREY[500], 0.08),
        selected: alpha(GREY[500], 0.16),
        disabled: alpha(GREY[500], 0.8),
        disabledBackground: alpha(GREY[500], 0.24),
        focus: alpha(GREY[500], 0.24),
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
    },
};


export const lightPalette = {
    ...COMMON,
    text: {
        primary: GREY[800],
        secondary: '#637381',
        disabled: GREY[500],
    },
    background: {
        paper: '#FFFFFF',
        default: '#FFFFFF',
        neutral: GREY[200],
        appPink: '#f7dbf8',
        appPositive: '#d6f7e4',
        appNegative: 'rgba(157, 255, 118, 0.49)',
        appTheme: 'rgb(218 230 248)',
    },

    action: {
        ...COMMON.action,
        active: GREY[600],
    },
};

export const darkPalette = {
    ...COMMON,
    text: {
        primary: '#FFFFFF',
        secondary: GREY[500],
        disabled: GREY[600],
    },
    background: {
        paper: GREY[800],
        default: GREY[900],
        neutral: alpha(GREY[500], 0.12),
        appPink: '#a272a4',
        appPositive: '#567a5f',
        appNegative: 'rgba(67, 109, 49, 0.7)',
        appTheme: 'rgb(98 108 116 / 0.9)',
    },
    action: {
        ...COMMON.action,
        active: GREY[500],
    },
};


export function palette(mode: 'light' | 'dark') {
    return mode === 'light' ? lightPalette : darkPalette;
}

export const colorSchemes = {
    light: { palette: lightPalette },
    dark: { palette: darkPalette },
};
