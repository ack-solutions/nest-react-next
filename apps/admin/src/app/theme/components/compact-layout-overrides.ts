import type { Theme, Components } from '@mui/material/styles';

/**
 * Component overrides applied when Settings compactLayout is true.
 * Merged with base theme components so tables, text fields, buttons, cards use smaller density.
 */
export const compactLayoutOverrides: Partial<Components<Theme>> = {
    MuiTextField: {
        defaultProps: {
            size: 'small',
            variant: 'outlined',
        },
    },
    MuiFormControl: {
        defaultProps: {
            size: 'small',
            variant: 'outlined',
        },
    },
    MuiInputBase: {
        styleOverrides: {
            input: ({ theme }) => ({
                '&.MuiInputBase-inputSizeSmall': {
                    paddingTop: theme.spacing(1.5),
                    paddingBottom: theme.spacing(1.5),
                },
            }),
        },
    },
    MuiTable: {
        defaultProps: {
            size: 'small',
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: ({ theme }) => ({
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
                paddingLeft: theme.spacing(1.5),
                paddingRight: theme.spacing(1.5),
            }),
            head: ({ theme }) => ({
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
            }),
        },
    },
    MuiTablePagination: {
        styleOverrides: {
            toolbar: {
                minHeight: 44,
                paddingLeft: 8,
                paddingRight: 8,
            },
        },
    },
    MuiButton: {
        defaultProps: {
            size: 'small',
        },
    },
    MuiIconButton: {
        defaultProps: {
            size: 'small',
        },
    },
    MuiChip: {
        defaultProps: {
            size: 'small',
        },
    },
    MuiCardHeader: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1.5, 2, 0.5),
            }),
        },
    },
    MuiCardContent: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1.5, 2),
                '&:last-of-type': {
                    paddingBottom: theme.spacing(2),
                },
            }),
        },
    },
    MuiCardActions: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1, 2, 1.5),
            }),
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1.5, 2),
            }),
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1.5, 2),
            }),
        },
    },
    MuiDialogActions: {
        styleOverrides: {
            root: ({ theme }) => ({
                padding: theme.spacing(1, 2, 1.5),
            }),
        },
    },
    MuiListItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                paddingTop: theme.spacing(0.5),
                paddingBottom: theme.spacing(0.5),
            }),
        },
    },
    MuiListItemIcon: {
        styleOverrides: {
            root: ({ theme }) => ({
                minWidth: 36,
                '& .MuiSvgIcon-root': {
                    fontSize: 20,
                },
            }),
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: ({ theme }) => ({
                paddingTop: theme.spacing(0.75),
                paddingBottom: theme.spacing(0.75),
            }),
        },
    },
};
