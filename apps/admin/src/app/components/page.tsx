import { Helmet } from 'react-helmet-async';
import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '@mui/material';

interface PageProps extends BoxProps {
    children: ReactNode;
    title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ children, title = '', ...other }, ref) => {

    return (
        <Box ref={ref} {...other}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
        </Box>
    );
});

export default Page;
