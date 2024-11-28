import { Theme } from '@mui/material/styles';

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.card,
          borderRadius: theme.shape.borderRadiusMd,
          position: 'relative',
          zIndex: 0 
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: { variant: 'body2', marginTop: theme.spacing(0.5) }
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
          [theme.breakpoints.down('lg')]: {
            padding: theme.spacing(2.5, 2.5, 0),
          },
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2, 2, 0),
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
          [theme.breakpoints.down('lg')]: {
            padding: theme.spacing(2.5),
          },
          [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
          }
        }
      }
    }
  };
}
