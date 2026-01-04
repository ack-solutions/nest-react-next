import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// hooks
// routes
import { useAuth } from '@libs/react-shared';
import { PATH_AFTER_LOGIN } from '../layout/config';

const REDIRECT_STORAGE_KEY = 'auth_redirect_path';

const getAndClearRedirectPath = (): string | null => {
    try {
        const path = localStorage.getItem(REDIRECT_STORAGE_KEY);
        if (path) {
            // Clear immediately after reading (one-time use)
            localStorage.removeItem(REDIRECT_STORAGE_KEY);
        }
        return path;
    } catch (error) {
        console.error('Failed to get/clear redirect path:', error);
        return null;
    }
};

type GuestGuardProps = {
    children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return null;
    }
    if (isAuthenticated) {
        // Check if there's a saved redirect path and use it, otherwise use default
        const redirectPath = getAndClearRedirectPath();
        const targetPath = redirectPath || PATH_AFTER_LOGIN;

        return <Navigate to={targetPath} replace />;
    }

    return children;
}
