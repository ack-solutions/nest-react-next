import { logoWhiteSvg, logoSvg } from '@admin/assets';
import { Box, Link, BoxProps, useTheme } from '@mui/material';
import { forwardRef, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';


export interface LogoProps extends BoxProps {
    disabledLink?: boolean;
    isDark?: boolean;
    small?: boolean;
    width?: number;
    height?: number;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ disabledLink = false, small, sx, isDark = false, width, height = null, ...other }, ref) => {
        const logoWidth = useMemo(() => {
            return (width ?? (small ? 130 : 180));
        }, [width, small]);

        const logoHeight = useMemo(() => {
            return (height ?? null);
        }, [height]);
        // const logoHeight = small ? 32 : 48;
        const path = useMemo(() => {
            return isDark ? logoWhiteSvg : logoSvg;
        }, []);

        const LogoIcon = () => (
            <Box
                component="img"
                width={logoWidth}
                height={logoHeight || 'auto'}
                src={path}
                alt="logo"
                sx={sx}
            />
        );

        if (disabledLink) {
            return (
                <Box ref={ref} {...other}>
                    <LogoIcon />
                </Box>
            );
        }

        return (
            <Box ref={ref} {...other}>
                <Link
                    to="/"
                    component={RouterLink}
                    sx={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        '&:hover': {
                            opacity: 0.8,
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s ease-in-out',
                        },
                    }}
                >
                    <LogoIcon />
                </Link>
            </Box>
        );
    },
);
