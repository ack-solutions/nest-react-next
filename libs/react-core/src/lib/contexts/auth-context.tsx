import { IUser } from '@libs/types';
import axios from 'axios';
import { chain, map } from 'lodash';
import { useState } from 'react';
import {
    createContext, useReducer, useEffect, useContext, useCallback,
} from 'react';

import { useUserQuery } from '../query-hooks';
import { instanceApi } from '../utils';
import useAccess from './react-access-control/use-access';


export interface AuthState {
    isAuthenticated: boolean,
    isInitialized: boolean,
    currentUser: IUser | null,
    token?: string,
    login: (token: string, user?: IUser) => Promise<any>,
    logout: () => void,
    reFetchCurrentUser: (user?: IUser) => void;
    addLogoutListener?: (value?: any) => void;
    addLoginListener?: (value?: any) => void;
    removeLoginListener?: (value?: any) => void;
    removeLogoutListener?: (value?: any) => void;
}

const initialState: Partial<AuthState> = Object.freeze({
    isAuthenticated: false,
    token: '',
    isInitialized: false,
});

const defaultValue: any = {
    login: () => Promise.resolve(),
    logout: () => {
        //
    },
};

export const AuthContext = createContext<AuthState>(defaultValue);

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'INITIALIZE': {
            return {
                ...state,
                ...action.payload,
                isInitialized: true,
            };
        }
        case 'UPDATE': {
            return {
                ...state,
                ...action.payload,
            };
        }
        case 'SIGN_IN': {
            return {
                ...state,
                isAuthenticated: true,
                ...action.payload,
            };
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                token: null,
            };
        }
        default:
            return initialState;
    }
};

const setSession = async (accessToken?: string | null): Promise<void> => {
    if (accessToken) {
        await localStorage.setItem('token', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        instanceApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        await localStorage.removeItem('token');
        delete axios.defaults.headers.common.Authorization;
        delete instanceApi.defaults.headers.common.Authorization;
    }
};


const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { define } = useAccess();
    const [token, setToken] = useState(null);
    const [loginListeners, setLoginListeners] = useState<any>([]);
    const [logoutListeners, setLogoutListeners] = useState<any>([]);
    const { useGetMe } = useUserQuery();
    const { data: currentUser, refetch: refetchUserData } = useGetMe({
        enabled: Boolean(token),
        throwOnError: (error, _query) => {
            logout();
            throw error;
        },
    });


    const logout = useCallback(
        async () => {
            logoutListeners.forEach((listener: any) => listener());
            setSession(null);
            dispatch({ type: 'LOGOUT' });
        },
        [logoutListeners],
    );


    const initPermissions = useCallback(
        (user: any) => {
            const roles = map(user?.roles, 'name');
            const permissions = chain(user?.roles).map((role) => map(role.permissions, 'name')).flatten().value();
            define({
                roles: roles,
                permissions: permissions,
            });
        },
        [define],
    );

    const reFetchCurrentUser = useCallback(
        async (user?: IUser | null) => {
            refetchUserData();
            initPermissions(user);
            dispatch({
                type: 'UPDATE',
                payload: {
                    user,
                },
            });
        },
        [initPermissions, refetchUserData],
    );


    const login = useCallback(
        async (token?: string, user?: any) => {
            await setSession(token);
            setToken(token);
            dispatch({
                type: 'SIGN_IN',
                payload: {
                    token,
                },
            });
            loginListeners.forEach((listener: any) => listener(user));
        },
        [loginListeners],
    );

    const addLoginListener = (listener: any) => {
        setLoginListeners((prevListeners: any) => [...prevListeners, listener]);
    };

    const addLogoutListener = (listener: any) => {
        setLogoutListeners((prevListeners: any) => [...prevListeners, listener]);
    };

    const removeLoginListener = (listener: any) => {
        setLoginListeners((prevListeners: any) => prevListeners.filter((l: any) => l !== listener));
    };

    const removeLogoutListener = (listener: any) => {
        setLogoutListeners((prevListeners: any) => prevListeners.filter((l: any) => l !== listener));
    };

    useEffect(() => {
        const initialize = async () => {
            const token = await localStorage.getItem('token');
            if (token) {
                await login(token);
            } else {
                await logout();
            }

            dispatch({ type: 'INITIALIZE' });
        };
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                reFetchCurrentUser,
                addLoginListener,
                addLogoutListener,
                removeLoginListener,
                removeLogoutListener,
                currentUser,
                ...state,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
