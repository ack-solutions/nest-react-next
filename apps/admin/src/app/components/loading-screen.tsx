import { Box, CircularProgress, SxProps, Typography } from '@mui/material';
import { styled } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import ProgressBar from './progress-bar/progress-bar';


const RootStyle = styled(motion.div)(({ theme: _theme }) => ({
    right: 0,
    bottom: 0,
    zIndex: 99999,
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
}));

const LoadingContainer = styled(motion.div)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
});

interface LoadingScreenProps {
    isDashboard?: boolean;
    sx?: SxProps;
    hideProgressBar?: boolean;
}

export default function LoadingScreen({
    isDashboard,
    hideProgressBar,
    ...other
}: LoadingScreenProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: {
            y: 20,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [
                    0.25,
                    0.1,
                    0.25,
                    1,
                ],
            },
        },
    };

    return (
        <AnimatePresence>
            {!hideProgressBar && <ProgressBar />}

            {!isDashboard && (
                <RootStyle
                    key="loading-screen-root-style"
                    {...other}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <LoadingContainer variants={itemVariants as any}>
                        <motion.div variants={itemVariants as any}>
                            <CircularProgress
                                size={50}
                                thickness={4}
                                sx={{
                                    mb: 2,
                                }}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants as any}>
                            <Typography
                                variant="h6"
                                textAlign="center"
                                sx={{
                                    fontWeight: 600,
                                    color: '#333',
                                    mb: 1,
                                }}
                            >
                                Loading...
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants as any}>
                            <Typography
                                variant="body2"
                                textAlign="center"
                                sx={{
                                    color: '#666',
                                    fontWeight: 400,
                                }}
                            >
                                Please wait a moment
                            </Typography>
                        </motion.div>

                        {/* Loading Dots Animation */}
                        <Box
                            component={motion.div}
                            sx={{
                                display: 'flex',
                                gap: 0.5,
                                mt: 2,
                            }}
                        >
                            {[
                                0,
                                1,
                                2,
                            ].map((index) => (
                                <motion.div
                                    key={index}
                                    animate={{
                                        y: [
                                            -3,
                                            3,
                                            -3,
                                        ],
                                        opacity: [
                                            0.4,
                                            1,
                                            0.4,
                                        ],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: index * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        backgroundColor: '#1976d2',
                                    }}
                                />
                            ))}
                        </Box>
                    </LoadingContainer>
                </RootStyle>
            )}
        </AnimatePresence>
    );
}
