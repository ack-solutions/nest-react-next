// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AccessProvider, AuthProvider,  SettingsProvider } from '@libs/react-core';

import AppRoutes from './app-routes';
import { ThemeProvider } from './theme/theme-provider';
import { Box, Typography } from '@mui/material';
import { ConfirmProvider } from './contexts/confirm-dialog-context';

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
        //  </HashRouter>
  );
}

export default App;
