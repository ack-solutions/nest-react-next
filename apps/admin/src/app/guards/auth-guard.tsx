import { useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PATH_AUTH } from "../routes/paths";
import { LoadingScreen, useAuth } from '@mlm/react-core';


type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);
  if (!isInitialized) {
    // Here Loading Screen
    return <LoadingScreen />;
  }
  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    // Here Login Component Import
    return <Navigate to={PATH_AUTH.login} />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
