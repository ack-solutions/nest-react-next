import { Theme } from '@mui/material';


export default function Table(theme: Theme) {
    return {
        MuiTable: {
            styleOverrides: {
                root: {
                    padding: '12px'
                }

            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {

                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: theme.typography.fontWeightSemiBold,
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.action.disabledOpacity,
                    borderBottom: 'none'
                },
            }
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                },
                toolbar: {
                    height: 64
                },
                select: {
                    '&:focus': {
                        borderRadius: theme.shape.borderRadius
                    }
                },
                selectIcon: {
                    width: 20,
                    height: 20,
                    marginTop: 2
                }
            }
        }
    };
}
