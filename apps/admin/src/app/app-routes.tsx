import LoadingScreen from './components/loading-screen';
import { useAuth } from '@libs/react-shared';
import Routes from './routes';


function AppRoutes() {
    const { isInitialized } = useAuth();

    if (!isInitialized) {
        return <LoadingScreen />;
    }

    return <Routes />;
}

export default AppRoutes;
