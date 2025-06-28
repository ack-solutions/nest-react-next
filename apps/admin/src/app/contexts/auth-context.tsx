import { config, instanceApi, UserService } from '@libs/react-shared';
import { IUser } from '@libs/types';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { chain, map } from 'lodash';
import {
    useState,
    createContext,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';

import useAccess from './react-access-control/use-access';
import { PATH_PAGE } from '../routes/paths';


const userService = UserService.getInstance<UserService>();
export interface AuthState {
    isAuthenticated: boolean;
    isInitialized: boolean;
    currentUser: IUser;
    token?: string;
    authErrorStatus: number | string;
    login: (token: string, user?: IUser) => Promise<any>;
    logout: () => void;
    addLogoutListener?: (value?: any) => void;
    addLoginListener?: (value?: any) => void;
    removeLoginListener?: (value?: any) => void;
    removeLogoutListener?: (value?: any) => void;
    reFetchCurrentUser: () => void;
}

type AuthListener = () => void;

const initialState: Partial<AuthState> = Object.freeze({
    isAuthenticated: false,
    currentUser: null,
    token: '',
    isInitialized: false,
    currentOrganization: null,
    authErrorStatus: null,
});

const defaultValue = initialState as AuthState;

export const AuthContext = createContext<AuthState>(defaultValue);


const setSession = async (accessToken?: string | null): Promise<void> => {
    if (accessToken) {
        await localStorage.setItem('token', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        instanceApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
        await localStorage.removeItem('token');
        await localStorage.removeItem('organization-id');
        delete axios.defaults.headers.common.Authorization;
        delete instanceApi.defaults.headers.common.Authorization;
    }
};

const setOrganizationInHeader = (orgId?: string | null) => {
    if (orgId) {
        axios.defaults.headers.common['organization-id'] = orgId;
        instanceApi.defaults.headers.common['organization-id'] = orgId;
    } else {
        delete axios.defaults.headers.common['organization-id'];
        delete instanceApi.defaults.headers.common['organization-id'];
    }
};

function AuthProvider({ children }: any) {
    const { define } = useAccess();
    const [loginListeners, setLoginListeners] = useState<AuthListener[]>([]);
    const [logoutListeners, setLogoutListeners] = useState<AuthListener[]>([]);
    const queryClient = useQueryClient();
    const [authErrorStatus, setAuthErrorStatus] = useState<any>(null);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        logoutListeners.forEach((listener: any) => listener());
        setIsAuthenticated(false);
        setSession(null);
        setCurrentUser(null);
        setOrganizationInHeader(null);
        queryClient.clear();
    }, [logoutListeners, queryClient]);


    const currentUserRefetch = useCallback(() => {
        return userService.getMe().then((res) => {
            setIsAuthenticated(true);
            setCurrentUser(res);
            return res;
        }).catch((error) => {
            if (error) {
                if (error?.status === 401) {
                    logout();
                } else if (!error?.status) {
                    const formateUrl = config.adminUrl;
                    window.location.href = `${formateUrl}/#/maintenance`;
                    navigate(PATH_PAGE.maintenance);
                    setAuthErrorStatus('api-stopped');
                }
            }
        });
    }, [navigate, logout]);

    const login = useCallback(
        async (token?: string) => {
            await setSession(token);
            loginListeners.forEach((listener: any) => listener());
            if (token) {
                await currentUserRefetch();
            }
        },
        [loginListeners, currentUserRefetch],
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
            const token = localStorage.getItem('token');
            if (token) {
                await login(token);
            } else {
                logout();
            }
            setIsInitialized(true);
        };
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (currentUser?.authUser?.roles?.length > 0) {
            const roles = map(currentUser?.authUser?.roles, 'name');
            const permissions = chain(currentUser?.authUser?.roles)
                .map((role) => role.permissions)
                .flatten()
                .value();
            define({
                roles: roles,
                permissions: permissions,
            });
        } else {
            define({
                roles: [],
                permissions: [],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.authUser?.roles]);


    const authData = useMemo(() => {
        return {
            login,
            logout,
            reFetchCurrentUser: currentUserRefetch,
            addLoginListener,
            addLogoutListener,
            removeLoginListener,
            removeLogoutListener,
            isAuthenticated,
            isInitialized,
            currentUser,
            authErrorStatus,
        };
    }, [
        authErrorStatus,
        currentUser,
        login,
        logout,
        currentUserRefetch,
        isAuthenticated,
        isInitialized,
    ]);

    return (
        <AuthContext.Provider
            value={authData}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
