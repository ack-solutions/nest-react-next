import { Box, Link, BoxProps, useTheme } from '@mui/material';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';


export interface LogoProps extends BoxProps {
    disabledLink?: boolean;
    small?: boolean;
    reset?: (values: any) => void;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
    ({ disabledLink = false, small, sx, reset, ...other }, ref) => {
        const theme = useTheme();

        const logoWidth = small ? 80 : 120;
        const logoHeight = small ? 32 : 48;

        const LogoIcon = () => (
            <Box
                component="svg"
                width={logoWidth}
                height={logoHeight}
                viewBox="0 0 120 48"
                sx={{
                    display: 'block',
                    ...sx,
                }}
            >
                {/* Simple gradient for the "A" */}
                <defs>
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={theme.palette.primary.main} />
                        <stop offset="100%" stopColor={theme.palette.primary.dark} />
                    </linearGradient>
                </defs>

                {/* Company initial "A" - larger and better positioned */}
                <text
                    x="8"
                    y="32"
                    fill="url(#textGradient)"
                    fontSize="36"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                >
                    A
                </text>

                {/* Company name - larger and better positioned */}
                <text
                    x="45"
                    y="18"
                    fill={theme.palette.text.primary}
                    fontSize="16"
                    fontWeight="700"
                    fontFamily="Arial, sans-serif"
                >
                    ADMIN
                </text>
                <text
                    x="45"
                    y="36"
                    fill={theme.palette.text.secondary}
                    fontSize="12"
                    fontWeight="500"
                    fontFamily="Arial, sans-serif"
                >
                    PORTAL
                </text>
            </Box>
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
