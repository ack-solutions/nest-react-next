import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import Error500 from '../components/error/error-500';
import { Maintenance } from '../components/error/maintenance';
import { useAuth } from '../contexts/auth-context';
import { PATH_AUTH, PATH_DASHBOARD } from '../routes/paths';


type AuthGuardProps = {
    children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, currentUser, authErrorStatus } = useAuth();
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState<string | null>(
        null,
    );

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname);
        }
        return <Navigate to={PATH_AUTH.login} />;
    }

    if (authErrorStatus === 500) {
        return <Error500 />;
    }

    if (authErrorStatus && authErrorStatus !== 401) {
        return <Maintenance />;
    }

    if (currentUser) {
        if (requestedLocation && pathname !== requestedLocation) {
            setRequestedLocation(null);
            return <Navigate to={requestedLocation} />;
        }
        if (pathname === PATH_AUTH.onboarding) {
            return <Navigate to={PATH_DASHBOARD.root} />;
        }
    }

    return children;
}
