'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLayout } from '../contexts/layout-context';

/**
 * Hook that automatically manages layout settings based on the current route
 */
export function useRouteLayout() {
    const pathname = usePathname();
    const { settings, setFooterVisibility } = useLayout();

    // useEffect(() => {
    //     // Define routes where footer should be hidden
    //     const hideFooterRoutes = [
    //         '/html-email-checker/validator',
    //         // Add more routes here as needed
    //     ];


    //     // Check if current route should hide footer
    //     const shouldHideFooter = pathname ? hideFooterRoutes.some(route =>
    //         pathname.startsWith(route)
    //     ) : false;

    //     setFooterVisibility(!shouldHideFooter);


    // }, [pathname, settings.showFooter]);
}
