import { Components, Theme } from '@mui/material';


// NEW VARIANT
declare module '@mui/material/Chip' {

    interface ChipPropsSizeOverrides {
        'x-small': true;
    }
}

const MuiChip: Components<Theme>['MuiChip'] = {
    defaultProps: {
        onClick: () => undefined,
    },
    variants: [
        {
            props: { size: 'x-small' },
            style: {
                height: 18,
                fontSize: '0.6875rem',
                px: 0.2,
            },
        },
    ],
};

export const chip = { MuiChip };
