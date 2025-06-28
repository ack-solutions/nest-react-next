import type { Theme, Components } from '@mui/material/styles';


declare module '@mui/material/SvgIcon/SvgIcon' {
    interface SvgIconPropsSizeOverrides {
        'x-small': true;
        'x-large': true;
    }
}

const MuiSvgIcon: Components<Theme>['MuiSvgIcon'] = {
    styleOverrides: {
        //     root: ({ ownerState }) => ({
        //         ...(ownerState.fontSize === 'x-small' && {
        //             width: 10,
        //             height: 10,
        //             fontSize: 'inherit',
        //         }),
        //         ...(ownerState.fontSize === 'x-large' && {
        //             width: 20,
        //             height: 20,
        //             fontSize: 'inherit',
        //         }),
        //     }),
        //     fontSizeLarge: {
        //         width: 16,
        //         height: 16,
        //         fontSize: 'inherit',
        //     },
        // fontSizeMedium: {
        //     width: 18,
        //     height: 18,
        //     fontSize: 'inherit',
        // },
        //     fontSizeSmall: {
        //         width: 12,
        //         height: 12,
        //         fontSize: 'inherit',
        //     },
    },
};


export const svgIcon = { MuiSvgIcon };
