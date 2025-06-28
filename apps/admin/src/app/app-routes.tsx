import LoadingScreen from './components/loading-screen';
import { useAuth } from './contexts/auth-context';
import Routes from './routes';


function AppRoutes() {
    const { isInitialized } = useAuth();

    if (!isInitialized) {
        return <LoadingScreen hideProgressBar />;
    }

    return <Routes />;
}

export default AppRoutes;
