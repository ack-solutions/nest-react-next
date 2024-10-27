import { Suspense } from "react";
import { LoadingScreen } from "./loading-screen";



export const Loadable = (Component: React.ElementType) => (props: any) => {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Component {...props} />
        </Suspense>
    );
};
