'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import type {
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';
import type {
    IUser,
} from '@libs/types';
import {
    AuthProvider as NestAuthClientProvider,
    type AuthProviderProps as NestAuthClientProviderProps,
    useNestAuth,
} from '@ackplus/nest-auth-react';
import type { AuthClient } from '@ackplus/nest-auth-client';
import { instanceApi, normalizeAxiosError } from '../config';

function useEvent<T extends (...args: any[]) => any>(fn: T): T {
    const fnRef = useRef(fn);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    return useCallback(((...args: any[]) => fnRef.current(...args)) as T, []);
}

type NestAuth = ReturnType<typeof useNestAuth>;

export interface AuthContextValue extends NestAuth {
    currentUser: IUser | null;
    isInitialized: boolean;
    logout: () => Promise<void>;
    refetchUser: () => Promise<IUser | null>;
    authErrorStatus?: number | string | null;

    organizationId?: string | null;
    setOrganization?: (orgId: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps extends NestAuthClientProviderProps {
    children: React.ReactNode;
    client: AuthClient;
    initialAuthState?: any;
}

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
};

function useAuthRefreshInterceptor(params: {
    runRefresh: () => Promise<any>;
    logoutAndClear: () => Promise<void>;
    onUnauthenticated?: () => void;
    setAuthErrorStatus: React.Dispatch<React.SetStateAction<number | string | null>>;
}) {
    const {
        runRefresh,
        logoutAndClear,
        onUnauthenticated,
        setAuthErrorStatus,
    } = params;

    useEffect(() => {
        const interceptorId = instanceApi.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                console.log('error', error);
                const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;
                const status = error?.status;

                if (!originalRequest) {
                    return Promise.reject(normalizeAxiosError(error));
                }

                if (
                    status !== 401 ||
                    originalRequest._retry ||
                    originalRequest.skipAuthRefresh
                ) {
                    return Promise.reject(normalizeAxiosError(error));
                }

                try {
                    originalRequest._retry = true;
                    setAuthErrorStatus(401);

                    await runRefresh();

                    setAuthErrorStatus(null);

                    return instanceApi(originalRequest);
                } catch (refreshError: any) {
                    const refreshStatus =
                        refreshError?.response?.status ??
                        refreshError?.status ??
                        401;

                    setAuthErrorStatus(refreshStatus);

                    if (refreshStatus === 401) {
                        await logoutAndClear();
                        onUnauthenticated?.();
                    }

                    return Promise.reject(normalizeAxiosError(refreshError));
                }
            }
        );

        return () => {
            instanceApi.interceptors.response.eject(interceptorId);
        };
    }, [runRefresh, logoutAndClear, onUnauthenticated, setAuthErrorStatus]);
}

function BridgeAuthProvider({
    children,
    onUnauthenticated,
}: {
    children: ReactNode;
    onUnauthenticated?: () => void;
}) {
    const auth = useNestAuth();

    const [isInitialized, setIsInitialized] = useState(false);
    const [authErrorStatus, setAuthErrorStatus] = useState<number | string | null>(null);

    const refreshPromiseRef = useRef<Promise<any> | null>(null);

    useEffect(() => {
        if (!auth.isLoading && !isInitialized) {
            setIsInitialized(true);
        }
    }, [auth.isLoading, isInitialized]);

    const clearAppState = useEvent(async () => {
        setAuthErrorStatus(null);
    });

    const logoutAndClear = useEvent(async () => {
        try {
            await auth.logout();
        } catch (error) {
            console.error('[Auth] Logout error:', error);
        } finally {
            await clearAppState();
        }
    });

    const runRefresh = useEvent(async () => {
        if (!refreshPromiseRef.current) {
            refreshPromiseRef.current = auth
                .refresh()
                .finally(() => {
                    refreshPromiseRef.current = null;
                });
        }

        return refreshPromiseRef.current;
    });

    const refetchUser = useEvent(async (): Promise<IUser | null> => {
        const sessionData = await auth.getSessionData();
        return sessionData?.appUser || null;
    });

    useAuthRefreshInterceptor({
        runRefresh,
        logoutAndClear,
        onUnauthenticated,
        setAuthErrorStatus,
    });

    const value = useMemo<AuthContextValue>(() => {
        return {
            ...auth,
            isAuthenticated: auth.status === 'authenticated',
            currentUser: auth.sessionData?.appUser || null,
            isInitialized,
            logout: logoutAndClear,
            refetchUser,
            authErrorStatus,
        };
    }, [auth, isInitialized, logoutAndClear, refetchUser, authErrorStatus]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({
    children,
    client,
    initialAuthState,
    ...props
}: AuthProviderProps) {
    const NestProvider = NestAuthClientProvider as React.ComponentType<{
        client: AuthClient;
        initialState?: any;
        children: React.ReactNode;
    }>;

    return (
        <NestProvider client={client} initialState={initialAuthState} {...props}>
            <BridgeAuthProvider>
                {children}
            </BridgeAuthProvider>
        </NestProvider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return ctx;
}

export default AuthProvider;
