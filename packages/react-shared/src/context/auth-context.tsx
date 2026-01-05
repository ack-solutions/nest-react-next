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
import { IUser } from '@libs/types';
import { AuthProvider as NestAuthClientProvider, useNestAuth } from '@ackplus/nest-auth-react';
import type { AuthClient } from '@ackplus/nest-auth-react';
import { UserService } from '../services';
import { IAuthUser } from '@ackplus/nest-auth-client';

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
export interface AuthProviderProps {
    children: React.ReactNode;
    client: AuthClient;
    initialAuthState?: any; // Transformed auth state from createInitialState
    onLogoutRedirect?: () => void;
    onUnauthorized?: () => void;
}

/**
 * -----------------------------
 * Bridge Auth Provider (internal)
 * -----------------------------
 */
function BridgeAuthProvider({
    children,
    onLogoutRedirect,
    onUnauthorized,
}: {
    children: ReactNode;
    onLogoutRedirect?: () => void;
    onUnauthorized?: () => void;
}) {
    const auth = useNestAuth();
    const [authUser, setAuthUser] = useState<IAuthUser | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [authErrorStatus, setAuthErrorStatus] = useState<number | string | null>(null);

    /**
     * Mark initialized once auth lib finishes booting.
     */
    useEffect(() => {
        if (!auth.isLoading && !isInitialized) {
            setIsInitialized(true);
        }
    }, [auth.isLoading, auth.status, isInitialized]);


    /**
     * Fetch current user
     */
    const fetchUser = useCallback(async (): Promise<IUser | null> => {
        if (auth.status !== 'authenticated') {
            setCurrentUser(null);
            return null;
        }

        setIsLoadingUser(true);
        setAuthErrorStatus(null);

        try {
            const user = await userService.getMe();
            setCurrentUser(user);
            setAuthErrorStatus(null);
            if (user.authUser) {
                setAuthUser(user.authUser);
            }
            return user;
        } catch (err: any) {
            const status = err?.status ?? err?.response?.status;

            if (status === 401) {
                console.warn('[Auth] 401 - Logging out');
                setCurrentUser(null);
                await auth.logout();
                onUnauthorized?.();
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
    }, [auth.status, auth.logout, onUnauthorized]);

    /**
     * Fetch user when auth status changes to authenticated
     */
    useEffect(() => {
        if (isInitialized && auth.status === 'authenticated') {
            fetchUser();
        } else if (auth.status === 'unauthenticated') {
            setCurrentUser(null);
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
            onLogoutRedirect?.();
        }
    });

    /**
     * Memo context value
     */
    const value = useMemo<AuthContextValue>(
        () => ({
            status: auth.status,
            authUser: authUser,
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

            refetchUser,
            authErrorStatus,
        }),
        [
            auth.status,
            auth.user,
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
    onLogoutRedirect,
    onUnauthorized,
}: AuthProviderProps) {
    const NestProvider = NestAuthClientProvider as React.ComponentType<{
        client: AuthClient;
        initialState?: any;
        children: React.ReactNode;
    }>;

    return (
        <NestProvider client={client} initialState={initialAuthState}>
            <BridgeAuthProvider
                onLogoutRedirect={onLogoutRedirect}
                onUnauthorized={onUnauthorized}
            >
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
