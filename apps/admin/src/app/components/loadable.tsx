/* eslint-disable @typescript-eslint/naming-convention */
import { Suspense } from 'react';

import PageLoading from './loading/page-loading';


export const Loadable = (Component: React.ElementType) => (function (props: any) {
    return (
        <Suspense fallback={<PageLoading />}>
            <Component {...props} />
        </Suspense>
    );
});
