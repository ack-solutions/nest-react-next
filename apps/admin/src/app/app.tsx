import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import AppRoutes from './app-routes';
import { Toasty } from './components/toasty';
import { AccessProvider, AuthProvider } from './contexts';
import ConfirmProvider from './contexts/confirm-dialog-context';
import { PromptDialogProvider } from './contexts/prompt-dialog-context';
import { SettingsProvider } from './contexts/settings-provider';
import { ThemeProvider } from './theme/theme-provider';


const MINUTE = 60 * 1000;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * MINUTE,
            gcTime: 10 * MINUTE,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
        },
    },
});


function App() {
    const handlePermissionsDeny = () => {
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
    };
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <QueryClientProvider client={queryClient}>
                <SettingsProvider>
                    <ThemeProvider>
                        <AccessProvider onDeny={handlePermissionsDeny}>
                            <AuthProvider>
                                <ConfirmProvider>
                                    <PromptDialogProvider>
                                        <Toasty />
                                        <AppRoutes />
                                    </PromptDialogProvider>
                                </ConfirmProvider>
                            </AuthProvider>
                        </AccessProvider>
                    </ThemeProvider>
                </SettingsProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </LocalizationProvider>
    );
}

export default App;
