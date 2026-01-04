import { Box, Button, Typography, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../icons/icon';
import { IconEnum } from '../icons/icons';


export function Maintenance() {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleRefresh = () => {
        navigate('/');
        window.location.reload();
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: theme.palette.background.default,
                px: 2,
            }}
        >
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                    ease: 'easeOut',
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        p: 6,
                        maxWidth: 600,
                        mx: 'auto',
                        transform: 'translateY(-60px)',
                    }}
                >
                    {/* Maintenance Icon */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                        }}
                    >
                        <motion.div
                            animate={{
                                rotate: 360,
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        >
                            <Icon
                                icon={IconEnum.Settings}
                                sx={{
                                    color: theme.palette.warning.main,
                                }}
                            />
                        </motion.div>
                    </Box>

                    {/* Maintenance Title */}
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.warning.main,
                            mb: 2,
                        }}
                    >
                        Maintenance Mode
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                        }}
                    >
                        We'll be back shortly!
                    </Typography>

                    {/* Main Message */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                        }}
                    >
                        Our system is currently undergoing scheduled maintenance to improve your experience.
                        We expect to be back online soon. Thank you for your patience and understanding.
                    </Typography>

                    {/* Contact Information */}
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                        }}
                    >
                        If you need immediate assistance, please contact your administrator.
                    </Typography>

                    {/* Try Again Button */}
                    <Button
                        variant="contained"
                        color="warning"
                        size="large"
                        onClick={handleRefresh}
                    >
                        Try Again
                    </Button>
                </Paper>
            </motion.div>
        </Box>
    );
}
