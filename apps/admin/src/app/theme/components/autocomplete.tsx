import type { Theme, Components } from '@mui/material/styles';


const MuiAutocomplete: Components<Theme>['MuiAutocomplete'] = {
    styleOverrides: {
        paper: ({ theme }) => ({
            boxShadow: theme.customShadows.dropdown,
            // maxHeight: 250,
        }),
    },
};

export const autocomplete = { MuiAutocomplete };
