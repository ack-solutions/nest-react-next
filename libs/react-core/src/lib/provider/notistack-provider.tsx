import { ReactNode, useRef } from 'react';
import { SnackbarProvider, SnackbarKey } from 'notistack';
import { useTheme } from '@mui/material/styles';
import { GlobalStyles, Collapse, Box, IconButton, alpha } from '@mui/material';

import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Icon } from '@admin/app/components/icon';


function SnackbarStyles() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  return (
    <GlobalStyles
      styles={{
        // '#root': {
        '& .notistack-Snackbar': {
          width: '100%',
          maxWidth: 500,
          '& .notistack-MuiContent':
          {
            color: theme.palette.text.primary + '!important',
            backgroundColor: theme.palette.background.paper + '!important',
            borderRadius: '8px !important',
          },
          [theme.breakpoints.up('md')]: {
            minWidth: 240,
          },
        },
        '& .SnackbarItem-message': {
          padding: '0 !important',
          fontWeight: theme.typography.fontWeightMedium,
        },
        // '& .SnackbarItem-action': {
        //   marginRight: 0,
        //   color: theme.palette.action.active,
        //   '& svg': { width: 20, height: 20 },
        // },
        // },
      }}
    />
  );
}


type Props = {
  children: ReactNode;
};

export  function NotistackProvider({ children }: Props) {

  const isRTL = false;

  const notistackRef = useRef<any>(null);

  const onClose = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <>
      <SnackbarStyles />

      <SnackbarProvider
        ref={notistackRef}
        dense
        maxSnack={5}
        preventDuplicate
        autoHideDuration={3000}
        TransitionComponent={isRTL ? Collapse : undefined}
        variant="success" // Set default variant
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        iconVariant={{
          info: <SnackbarIcon color="info" > <InfoIcon /></SnackbarIcon>,
          success: <SnackbarIcon color="success" ><Icon icon='tick-circle' size={20} /></SnackbarIcon>,
          warning: <SnackbarIcon color="warning"><WarningIcon /></SnackbarIcon>,
          error: <SnackbarIcon color='error'><ErrorIcon /></SnackbarIcon>,
        }}
        // With close as default
        action={(key) => (
          <IconButton size="small" onClick={onClose(key)} sx={{ p: 0.5 }}>
            <Icon icon='close' size={12} />
          </IconButton>
        )}
      >
        {children}
      </SnackbarProvider>
    </>
  );
}


export interface SnackbarIconProps {
  children: ReactNode,
  color: 'info' | 'success' | 'warning' | 'error' ;
}
function SnackbarIcon({ children, color }: SnackbarIconProps) {

  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      {children}
    </Box>
  );
}
