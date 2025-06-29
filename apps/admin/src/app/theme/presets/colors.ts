// @mui
import { alpha } from '@mui/material';
import { omit } from 'lodash';

import { palette as themePalette } from '../palette';


export function presets(presetsColor: string) {
    const primary = primaryPresets.find((i) => i.name === presetsColor);

    const theme = {
        palette: {
            primary: omit(primary, ['name']),
        },
        customShadows: {
            primary: `0 8px 16px 0 ${alpha(`${primary?.main}`, 0.24)}`,
        },
    };

    return theme;
}

const palette = themePalette('light');

export const primaryPresets = [
    // DEFAULT
    {
        name: 'default',
        lighter: '#B1B0EA',
        light: '#5654D1',
        main: '#0300BB',
        dark: '#0300AA',
        darker: '#020085',
        contrastText: '#FFFFFF',
    },
    // CYAN
    {
        name: 'cyan',
        lighter: '#CCF4FE',
        light: '#68CDF9',
        main: '#078DEE',
        dark: '#0351AB',
        darker: '#012972',
        contrastText: '#FFFFFF',
    },

    // PURPLE
    {
        name: 'purple',
        lighter: '#EBD6FD',
        light: '#B985F4',
        main: '#7635dc',
        dark: '#431A9E',
        darker: '#200A69',
        contrastText: '#FFFFFF',
    },
    // BLUE
    {
        name: 'blue',
        lighter: '#D1E9FC',
        light: '#76B0F1',
        main: '#2065D1',
        dark: '#103996',
        darker: '#061B64',
        contrastText: '#FFFFFF',
    },
    // ORANGE
    {
        name: 'orange',
        lighter: '#FEF4D4',
        light: '#FED680',
        main: '#fda92d',
        dark: '#B66816',
        darker: '#793908',
        contrastText: palette.grey[800],
    },
    // RED
    {
        name: 'red',
        lighter: '#FFE3D5',
        light: '#FFC1AC',
        main: '#FF3030',
        dark: '#B71833',
        darker: '#7A0930',
        contrastText: '#FFFFFF',
    },
    // GREEN
    {
        name: 'green',
        lighter: '#D8F5E3',
        light: '#73D13D',
        main: '#52C41A',
        dark: '#389E0D',
        darker: '#237804',
        contrastText: '#FFFFFF',
    },
    // PINK
    {
        name: 'pink',
        lighter: '#FFE7F1',
        light: '#FF85C0',
        main: '#FF1744',
        dark: '#C2185B',
        darker: '#880E4F',
        contrastText: '#FFFFFF',
    },
    // INDIGO
    {
        name: 'indigo',
        lighter: '#E8EAF6',
        light: '#7986CB',
        main: '#3F51B5',
        dark: '#303F9F',
        darker: '#1A237E',
        contrastText: '#FFFFFF',
    },
    // TEAL
    {
        name: 'teal',
        lighter: '#E0F2F1',
        light: '#4DB6AC',
        main: '#009688',
        dark: '#00695C',
        darker: '#004D40',
        contrastText: '#FFFFFF',
    },
];
