import { Box, BoxProps } from '@mui/material';
import { forwardRef, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

import { CustomBreadcrumbs, CustomBreadcrumbsProps } from './custom-breadcrumbs';


interface PageProps extends BoxProps {
    children: ReactNode;
    breadcrumbs?: CustomBreadcrumbsProps['links'];
    actions?: CustomBreadcrumbsProps['action']
    title?: string;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
    ({ children, title = '', breadcrumbs = [], actions, ...other }, ref) => {
        return (
            <Box
                ref={ref}
                {...other}
            >
                <Helmet>
                    <title>{title ? `${title}` : 'Portal'}</title>
                </Helmet>
                <CustomBreadcrumbs
                    heading={title}
                    links={breadcrumbs}
                    action={actions}
                />
                <Box sx={{ py: 2 }}>
                    {children}
                </Box>
            </Box>
        );
    },
);
