import { Box, Typography, Button, Stack, Paper, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { PATH_DASHBOARD } from '../../routes/paths';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export interface PermissionDeniedContentProps {
    message?: string;
    showBackButton?: boolean;
    showHomeButton?: boolean;
}

export function PermissionDeniedContent({
    message = "You don't have permission to access this page.",
    showBackButton = true,
    showHomeButton = true,
}: PermissionDeniedContentProps) {
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
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: 'calc(100vh - 200px)', // Account for header and padding
                px: 2,
                py: 4,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    maxWidth: 500,
                    mx: 'auto',
                    backgroundColor: 'transparent',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                    }}
                >
                    <Icon
                        icon={IconEnum.ShieldX}
                        size={40}
                        sx={{
                            color: theme.palette.error.main,
                        }}
                    />
                </Box>

                {/* Error Code */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.error.main,
                        mb: 1,
                    }}
                >
                    403
                </Typography>

                {/* Title */}
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 2,
                    }}
                >
                    Access Denied
                </Typography>

                {/* Message */}
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        mb: 4,
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
                        justifyContent: 'center',
                    }}
                >
                    {showBackButton && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleGoBack}
                            startIcon={<Icon icon={IconEnum.ArrowLeft} />}
                        >
                            Go Back
                        </Button>
                    )}

                    {showHomeButton && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoHome}
                            startIcon={<Icon icon={IconEnum.House} />}
                        >
                            Dashboard
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}

export default PermissionDeniedContent;
