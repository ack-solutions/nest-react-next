import type { Theme } from '@mui/material/styles';

export default function appBar(theme: Theme) {
    return {
        MuiAppBar: {
            defaultProps: {
                color: 'transparent'
            },
            styleOverrides: {
                root: {
                    boxShadow: 'none'
                }
            },
        }
    }
}