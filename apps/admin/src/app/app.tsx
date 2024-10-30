// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AccessProvider, AuthProvider, ConfirmProvider, ReactCore, SettingsProvider } from '@mlm/react-core';
import { Icon } from '@mlm/react-core';
import { IRole } from '@mlm/types'
import NxWelcome from './nx-welcome';

import { Route, Routes, Link, HashRouter } from 'react-router-dom';
import { toDisplayDate } from '@mlm/utils';
import Router from './routes';
import AppRoutes from './AppRoutes';
import { ThemeProvider } from './theme/theme-provider';
import { Box, Typography } from '@mui/material';

export function App() {
  const handlePermissionsDeny = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
        >
            <Typography variant="h2" align="center">
                You are authorized to access the page.
            </Typography>
        </Box>
    );
};
  return (

        //  <HashRouter>
            <SettingsProvider>
                <ThemeProvider>
                    <AccessProvider onDeny={handlePermissionsDeny}>
                        <AuthProvider>
                            <ConfirmProvider>
                                <AppRoutes />
                            </ConfirmProvider>
                        </AuthProvider>
                    </AccessProvider>
                </ThemeProvider>
            </SettingsProvider>
        // </HashRouter>
  );
}

export default App;
