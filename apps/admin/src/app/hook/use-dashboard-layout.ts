import React, { Dispatch, ReactNode, SetStateAction, useContext } from 'react';

import { CustomBreadcrumbsProps } from '../components';


export interface DashboardLayoutContextType {
    heading: ReactNode;
    setHeading: Dispatch<SetStateAction<ReactNode>>;

    breadcrumbs: CustomBreadcrumbsProps['links'];
    setBreadcrumbs: Dispatch<SetStateAction<CustomBreadcrumbsProps['links']>>;
}

const DashboardLayoutContext = React.createContext<DashboardLayoutContextType>({
    heading: null, // Default heading
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setHeading: () => { }, // Function to change the heading

    breadcrumbs: [], // Default breadcrumbs
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setBreadcrumbs: () => { }, // Function to change the breadcrumbs
});

export default DashboardLayoutContext;


// This is the custom hook
export function useDashboardLayout() {
    const context = useContext(DashboardLayoutContext);

    if (context === undefined) {
        throw new Error('useDashboardLayout must be used within a DashboardLayoutContext');
    }

    return context;
}
