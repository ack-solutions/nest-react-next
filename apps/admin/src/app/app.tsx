import { AccessProvider, AuthProvider, NotistackProvider, SettingsProvider } from '@libs/react-core';
import { Box, Typography } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback } from 'react';

import AppRoutes from './app-routes';
import { ConfirmProvider } from './contexts/confirm-dialog-context';
import { ThemeProvider } from './theme/theme-provider';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

export function App() {
    const handlePermissionsDeny = useCallback(
        () => {
            return (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                >
                    <Typography
                        variant="h2"
                        align="center"
                    >
                        You are authorized to access the page.
                    </Typography>
                </Box>
            );
        },
        [],
    );

    return (
        <QueryClientProvider client={queryClient}>
            <SettingsProvider>
                <ThemeProvider>
                    <AccessProvider onDeny={handlePermissionsDeny}>
                        <AuthProvider>
                            <ConfirmProvider>
                                <NotistackProvider>
                                    <AppRoutes />
                                </NotistackProvider>
                            </ConfirmProvider>
                        </AuthProvider>
                    </AccessProvider>
                </ThemeProvider>
            </SettingsProvider>
        </QueryClientProvider>
    );
}

export default App;
