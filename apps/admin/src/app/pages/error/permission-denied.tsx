import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { PATH_DASHBOARD } from '../../routes/paths';


export interface PermissionDeniedProps {
    message?: string;
    showBackButton?: boolean;
    showHomeButton?: boolean;
}

function PermissionDenied({
    message = "You don't have permission to access this page.",
    showBackButton = true,
    showHomeButton = true,
}: PermissionDeniedProps) {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoHome = () => {
        navigate(PATH_DASHBOARD.root);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: theme.palette.background.default,
                zIndex: theme.zIndex.drawer + 1,
                px: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
                py: 4,
            }}
        >

            {/* Error Code */}
            <Typography
                variant="h1"
                sx={{
                    fontSize: {
                        xs: '3rem',
                        sm: '4rem',
                        md: '5rem',
                    },
                    fontWeight: 'bold',
                    color: theme.palette.error.main,
                    mb: 1,
                    lineHeight: 1,
                }}
            >
                403
            </Typography>

            {/* Title */}
            <Typography
                variant="h4"
                sx={{
                    fontSize: {
                        xs: '1.5rem',
                        sm: '2rem',
                        md: '2.125rem',
                    },
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 2,
                }}
            >
                Oops! Permission Denied
            </Typography>

            {/* Message */}
            <Typography
                variant="body1"
                sx={{
                    fontSize: {
                        xs: '0.875rem',
                        sm: '1rem',
                    },
                    color: theme.palette.text.secondary,
                    mb: 4,
                    maxWidth: {
                        xs: '100%',
                        sm: '400px',
                        md: '500px',
                    },
                    lineHeight: 1.6,
                }}
            >
                {message}
            </Typography>

            {/* Action Buttons */}
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row',
                }}
                spacing={2}
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    justifyContent: 'center',
                }}
            >
                {showBackButton ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleGoBack}
                        startIcon={<ArrowBackOutlinedIcon />}
                    >
                        Go Back
                    </Button>
                ) : null}

                {showHomeButton ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGoHome}
                        startIcon={<HomeOutlinedIcon />}
                    >
                        Go Home
                    </Button>
                ) : null}
            </Stack>

        </Box>
    );
}

export default PermissionDenied;
