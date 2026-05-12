import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import AppRoutes from './app-routes';
import { Toasty } from './components/toasty';
import ConfirmProvider from './contexts/confirm-dialog-context';
import { PromptDialogProvider } from './contexts/prompt-dialog-context';
import { SettingsProvider } from './contexts/settings-provider';
import { ThemeProvider } from './theme/theme-provider';
import { AuthClient, LocalStorageAdapter, createAxiosAdapter } from '@ackplus/nest-auth-client';
import { AuthProvider, config, instanceApi, instanceNestAuth } from '@libs/react-shared';
import { useEffect } from 'react';
import { DataTableStateProvider } from './components/data-grid';

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


// Create auth client for admin
const authClient = new AuthClient({
    baseUrl: config.apiUrl + '/api',
    accessTokenType: 'header',
    storage: new LocalStorageAdapter(),
    httpAdapter: createAxiosAdapter(instanceNestAuth),

    logger: {
        warn: (message: string) => {
            console.warn(message);
        },
        info: (message: string) => {
            console.info(message);
        },
        debug: (message: string) => {
            console.debug(message);
        },
        error: (message: string) => {
            console.error(message);
        },
    },
});
const handleTokenSet = (tokens: { accessToken: string; refreshToken: string, trustToken?: string }) => {
    if (tokens?.accessToken) {
        instanceApi.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    }
};

const handleTokenRemoved = () => {
    delete instanceApi.defaults.headers.common?.['Authorization'];
};



function App() {

    useEffect(() => {
        const accessToken = localStorage.getItem('nest_auth_access_token');
        const refreshToken = localStorage.getItem('nest_auth_refresh_token');
        if (accessToken) {
            handleTokenSet({
                accessToken,
                refreshToken,
            });
        }
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <QueryClientProvider client={queryClient}>
                <SettingsProvider>
                    <ThemeProvider>
                        <AuthProvider
                            client={authClient}
                            onTokensSet={handleTokenSet}
                            onTokensRemoved={handleTokenRemoved}
                        >
                            <DataTableStateProvider>
                                <ConfirmProvider>
                                    <PromptDialogProvider>
                                        <Toasty />
                                        <AppRoutes />
                                    </PromptDialogProvider>
                                </ConfirmProvider>
                            </DataTableStateProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </SettingsProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </LocalizationProvider>
    );
}

export default App;
