'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { IMessageResponse, IMfaDevice, IMfaStatusResponse, IToggleMfaRequest, ITotpSetupResponse, IUser, IVerifyTotpSetupRequest } from '@libs/types';
import { AuthProvider as NestAuthClientProvider, AuthProviderProps as NestAuthClientProviderProps, useNestAuth } from '@ackplus/nest-auth-react';
import type { AuthClient } from '@ackplus/nest-auth-react';
import { UserService } from '../services';
import { INestAuthUser } from '@ackplus/nest-auth-client';
import { instanceApi } from '../config';
import { IStorageAdapter } from '@libs/utils';

const userService = UserService.getInstance<UserService>();

/**
 * -----------------------------
 * useEvent (stable alternative to useEffectEvent)
 * -----------------------------
 */
function useEvent<T extends (...args: any[]) => any>(fn: T): T {
    const fnRef = useRef(fn);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    return useCallback(((...args: any[]) => fnRef.current(...args)) as T, []);
}

/**
 * -----------------------------
 * Context Types
 * -----------------------------
 */
type NestAuth = ReturnType<typeof useNestAuth>;

export interface AuthContextValue {
    // Nest Auth properties
    status: NestAuth['status'];
    authUser: NestAuth['user'];
    session: NestAuth['session'];
    isLoading: boolean;
    isAuthenticated: boolean;
    error: NestAuth['error'];
    client: NestAuth['client'];

    // App User
    currentUser: IUser | null;
    isInitialized: boolean;

    // Organization (optional, for admin)
    organizationId?: string | null;
    setOrganization?: (orgId: string | null) => void;

    // Auth methods
    login: NestAuth['login'];
    signup: NestAuth['signup'];
    logout: () => Promise<void>;
    refresh: NestAuth['refresh'];
    forgotPassword: NestAuth['forgotPassword'];
    verifyForgotPasswordOtp: NestAuth['verifyForgotPasswordOtp'];
    resetPassword: NestAuth['resetPassword'];
    changePassword: NestAuth['changePassword'];
    send2fa: NestAuth['send2fa'];
    verify2fa: NestAuth['verify2fa'];
    resetMfa: NestAuth['resetMfa'];

    // TOTP / MFA Management
    setupTotp: NestAuth['setupTotp'];
    verifyTotpSetup: NestAuth['verifyTotpSetup'];
    getMfaStatus: NestAuth['getMfaStatus'];
    listTotpDevices: NestAuth['listTotpDevices'];
    removeTotpDevice: NestAuth['removeTotpDevice'];
    toggleMfa: NestAuth['toggleMfa'];
    generateRecoveryCode: NestAuth['generateRecoveryCode'];

    // User management
    refetchUser: () => Promise<IUser | null>;

    // Error status
    authErrorStatus?: number | string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * -----------------------------
 * Auth Provider Props
 * -----------------------------
 */
export interface AuthProviderProps extends NestAuthClientProviderProps {
    children: React.ReactNode;
    client: AuthClient;
    initialAuthState?: any; // Transformed auth state from createInitialState
    storage?: IStorageAdapter;
}

/**
 * -----------------------------
 * Bridge Auth Provider (internal)
 * -----------------------------
 */
function BridgeAuthProvider({
    children,
    storage,
}: {
    children: ReactNode;
    storage?: IStorageAdapter;
}) {
    const auth = useNestAuth();
    const [authUser, setAuthUser] = useState<INestAuthUser | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [authErrorStatus, setAuthErrorStatus] = useState<number | string | null>(null);
    /**
     * Mark initialized once auth lib finishes booting.
     */
    useEffect(() => {
        const initializeAuth = async () => {
            if (!auth.isLoading && !isInitialized) {
                const tokenStorage = storage ? storage : localStorage;
                let accessToken = await tokenStorage.getItem('nest_auth_access_token');
                if (!accessToken) {
                    accessToken = await tokenStorage.getItem('access_token');
                }
                if (accessToken) {
                    instanceApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                }
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [auth.isLoading, auth.status, isInitialized, storage]);


    /**
     * Fetch current user
     */
    const fetchUser = useCallback(async (): Promise<IUser | null> => {
        if (auth.status !== 'authenticated') {
            setCurrentUser(null);
            setAuthUser(null);
            return null;
        }

        setIsLoadingUser(true);
        setAuthErrorStatus(null);

        try {
            const user = await userService.getMe();
            setCurrentUser(user);
            setAuthUser(user?.authUser || null);
            setAuthErrorStatus(null);
            return user;
        } catch (err: any) {
            const status = err?.status ?? err?.response?.status;

            if (status === 401) {
                console.warn('[Auth] 401 - Logging out');
                await auth.logout();
                return null;
            }

            console.error('[Auth] Fetch user error:', status || 'network');
            if (!status) {
                setAuthErrorStatus('api-stopped');
            } else {
                setAuthErrorStatus(status);
            }

            return null;
        } finally {
            setIsLoadingUser(false);
        }
    }, [auth.status, auth.logout]);

    /**
     * Fetch user when auth status changes to authenticated
     */
    useEffect(() => {
        if (isInitialized && auth.status === 'authenticated') {
            fetchUser();
        } else if (auth.status === 'unauthenticated') {
            setCurrentUser(null);
            setAuthUser(null);
        }
    }, [isInitialized, auth.status, fetchUser]);

    /**
     * Force fetch /me
     */
    const refetchUser = useCallback(async (): Promise<IUser | null> => {
        return await fetchUser();
    }, [fetchUser]);

    /**
     * Clear app state
     */
    const clearAppState = useEvent(async () => {
        setCurrentUser(null);
        setAuthUser(null);
        setAuthErrorStatus(null);
    });

    /**
     * Logout + cleanup
     */
    const logoutAndClear = useEvent(async () => {
        try {
            await auth.logout();
        } catch (error) {
            console.error('[Auth] Logout error:', error);
        } finally {
            await clearAppState();
        }
    });
    /**
     * Memo context value
     */
    const value = useMemo<AuthContextValue>(
        () => ({
            status: auth.status,
            authUser,
            session: auth.session,
            isLoading: auth.isLoading || isLoadingUser,
            isAuthenticated: auth.status === 'authenticated',
            error: auth.error,
            client: auth.client,

            currentUser,
            isInitialized,

            login: auth.login,
            signup: auth.signup,
            logout: logoutAndClear,
            refresh: auth.refresh,
            forgotPassword: auth.forgotPassword,
            verifyForgotPasswordOtp: auth.verifyForgotPasswordOtp,
            resetPassword: auth.resetPassword,
            changePassword: auth.changePassword,
            send2fa: auth.send2fa,
            verify2fa: auth.verify2fa,
            resetMfa: auth.resetMfa,

            // TOTP / MFA Management
            setupTotp: auth.setupTotp,
            verifyTotpSetup: auth.verifyTotpSetup,
            getMfaStatus: auth.getMfaStatus,
            listTotpDevices: auth.listTotpDevices,
            removeTotpDevice: auth.removeTotpDevice,
            toggleMfa: auth.toggleMfa,
            generateRecoveryCode: auth.generateRecoveryCode,

            refetchUser,
            authErrorStatus,
        }),
        [
            auth.status,
            authUser,
            auth.session,
            auth.isLoading,
            isLoadingUser,
            auth.error,
            auth.client,
            currentUser,
            isInitialized,
            auth.login,
            auth.signup,
            logoutAndClear,
            auth.refresh,
            auth.forgotPassword,
            auth.verifyForgotPasswordOtp,
            auth.resetPassword,
            auth.changePassword,
            auth.send2fa,
            auth.verify2fa,
            auth.setupTotp,
            auth.verifyTotpSetup,
            auth.getMfaStatus,
            auth.listTotpDevices,
            auth.removeTotpDevice,
            auth.toggleMfa,
            auth.resetMfa,
            auth.generateRecoveryCode,
            refetchUser,
            authErrorStatus,
        ]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * -----------------------------
 * Main Auth Provider
 * -----------------------------
 */
export function AuthProvider({
    children,
    client,
    initialAuthState,
    storage,
    ...props
}: AuthProviderProps) {
    const NestProvider = NestAuthClientProvider as React.ComponentType<{
        client: AuthClient;
        initialState?: any;
        children: React.ReactNode;
    }>;

    return (
        <NestProvider client={client} initialState={initialAuthState} {...props}>
            <BridgeAuthProvider storage={storage} >
                {children}
            </BridgeAuthProvider>
        </NestProvider>
    );
}


/**
 * -----------------------------
 * Hook
 * -----------------------------
 */
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export default AuthProvider;
