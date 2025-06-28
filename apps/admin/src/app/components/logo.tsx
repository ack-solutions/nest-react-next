import { Box, Link, BoxProps } from '@mui/material';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useAuth } from '../contexts/auth-context';


export interface LogoProps extends BoxProps {
    disabledLink?: boolean;
    small?: boolean;
    reset?: (values: any) => void;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ disabledLink = false, small, sx, reset, ...other }, ref) => {
        return (
            <Link
                to="/"
                component={RouterLink}
                sx={{ display: 'contents' }}
            >
                LOGO
            </Link>
        );
    },
);
