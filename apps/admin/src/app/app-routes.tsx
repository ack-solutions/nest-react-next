import { LoadingScreen, useAuth } from '@mlm/react-core';
import Routes from './routes';

const AppRoutes = () => {

    const { isInitialized } = useAuth();

    // return !isInitialized ? <Routes /> : <LoadingScreen />;
    return <Routes /> ;
};

export default AppRoutes;
