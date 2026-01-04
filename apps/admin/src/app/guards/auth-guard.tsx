import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import Error500 from '../components/error/error-500';
import { Maintenance } from '../components/error/maintenance';
import { useAuth } from '@libs/react-shared';
import { PATH_AUTH, PATH_DASHBOARD } from '../routes/paths';

const REDIRECT_STORAGE_KEY = 'auth_redirect_path';

const saveRedirectPath = (path: string) => {
    try {
        localStorage.setItem(REDIRECT_STORAGE_KEY, path);
    } catch (error) {
        console.error('Failed to save redirect path:', error);
    }
};

type AuthGuardProps = {
    children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isLoading, isAuthenticated, currentUser, authErrorStatus } = useAuth();
    const { pathname, search } = useLocation();

    if (isLoading) {
        return null;
    }
    if (!isAuthenticated) {
        // Store the requested location in localStorage so it persists across navigation
        const redirectPath = pathname + search;
        saveRedirectPath(redirectPath);
        return <Navigate to={PATH_AUTH.login} replace />;
    }

    if (authErrorStatus === 500) {
        return <Error500 />;
    }

    if (authErrorStatus && authErrorStatus !== 401) {
        return <Maintenance />;
    }

    if (currentUser) {
        if (pathname === PATH_AUTH.onboarding) {
            return <Navigate to={PATH_DASHBOARD.root} replace />;
        }
    }

    return children;
}
