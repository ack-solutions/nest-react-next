import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';


// hooks
// routes
import { useAuth } from '../contexts/auth-context';
import { PATH_DASHBOARD } from '../routes/paths';


type GuestGuardProps = {
    children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
    const { isAuthenticated } = useAuth();
    // console.log({ isAuthenticated })
    if (isAuthenticated) {
        return <Navigate to={PATH_DASHBOARD.root} />;
    }

    return children;
}
