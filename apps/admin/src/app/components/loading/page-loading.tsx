import {
    CircularProgress,
    LinearProgress,
    Box,
    Typography,
    Backdrop,
    Card,
    CardContent,
    Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

import { HEADER, BREADCRUMB_HEIGHT, SPACING } from '../../layout/config';
import ProgressBar from '../progress-bar/progress-bar';


interface PageLoadingProps {
    variant?: 'circular' | 'linear' | 'skeleton' | 'pulse';
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large' | number;
    message?: string;
    withBackdrop?: boolean;
    fullScreen?: boolean;
    height?: string | number;
    showCard?: boolean;
    showProgressBar?: boolean;
}

function PageLoading({
    variant = 'circular',
    color = 'primary',
    size = 'medium',
    message = 'Loading...',
    withBackdrop = false,
    fullScreen = true,
    height,
    showCard = false,
    showProgressBar = false,
}: PageLoadingProps) {
    const getSpinnerSize = () => {
        if (typeof size === 'number') return size;
        if (size === 'large') return 60;
        if (size === 'medium') return 40;
        return 30;
    };

    const containerVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
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
                duration: 0.3,
                ease: 'easeOut',
            },
        },
    };

    const pulseVariants = {
        animate: {
            scale: [
                1,
                1.05,
                1,
            ],
            opacity: [
                0.7,
                1,
                0.7,
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    const renderSkeletonContent = () => (
        <Box
            sx={{
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
            }}
        >
            <Skeleton
                variant="rectangular"
                width="100%"
                height={60}
                sx={{
                    mb: 2,
                    borderRadius: 1,
                }}
            />
            <Skeleton
                variant="text"
                sx={{
                    fontSize: '1.5rem',
                    mb: 1,
                }}
            />
            <Skeleton
                variant="text"
                sx={{
                    fontSize: '1rem',
                    mb: 1,
                    width: '80%',
                }}
            />
            <Skeleton
                variant="text"
                sx={{
                    fontSize: '1rem',
                    mb: 2,
                    width: '60%',
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                }}
            >
                <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                />
                <Box sx={{ flex: 1 }}>
                    <Skeleton
                        variant="text"
                        sx={{
                            fontSize: '1rem',
                            mb: 0.5,
                        }}
                    />
                    <Skeleton
                        variant="text"
                        sx={{
                            fontSize: '0.875rem',
                            width: '70%',
                        }}
                    />
                </Box>
            </Box>
            <Skeleton
                variant="rectangular"
                width="100%"
                height={120}
                sx={{ borderRadius: 1 }}
            />
        </Box>
    );

    const renderPulseContent = () => (
        <motion.div
            variants={pulseVariants as any}
            animate="animate"
        >
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${color === 'primary' ? '#1976d2' : '#9c27b0'} 30%, ${color === 'primary' ? '#42a5f5' : '#ba68c8'} 90%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    mb: 3,
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <CircularProgress
                        size={40}
                        thickness={4}
                        color={color}
                    />
                </Box>
            </Box>
        </motion.div>
    );

    const renderContent = () => {
        if (variant === 'skeleton') {
            return (
                <motion.div
                    variants={itemVariants as any}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {renderSkeletonContent()}
                </motion.div>
            );
        }

        if (variant === 'pulse') {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {renderPulseContent()}
                    {message ? (
                        <motion.div variants={itemVariants as any}>
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                            >
                                {message}
                            </Typography>
                        </motion.div>
                    ) : null}
                </Box>
            );
        }

        return variant === 'circular' ? (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <motion.div
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            display: 'inline-flex',
                        }}
                    >
                        <CircularProgress
                            color={color}
                            size={getSpinnerSize()}
                            thickness={size === 'large' ? 3 : 4}
                            sx={{
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                            }}
                        />
                    </Box>
                </motion.div>
                {message ? (
                    <motion.div variants={itemVariants as any}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                textAlign: 'center',
                            }}
                        >
                            {message}
                        </Typography>
                    </motion.div>
                ) : null}

                {/* Loading dots */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 0.5,
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
                                    -4,
                                    4,
                                    -4,
                                ],
                                opacity: [
                                    0.4,
                                    1,
                                    0.4,
                                ],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: 'easeInOut',
                            }}
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: color === 'primary' ? '#1976d2' : '#9c27b0',
                            }}
                        />
                    ))}
                </Box>
            </Box>
        ) : (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    gap: 3,
                }}
            >
                <motion.div
                    variants={itemVariants as any}
                    style={{
                        width: '100%',
                        maxWidth: '300px',
                    }}
                >
                    <LinearProgress
                        color={color}
                        sx={{
                            width: '100%',
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                            },
                        }}
                    />
                </motion.div>
                {message ? (
                    <motion.div variants={itemVariants as any}>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                textAlign: 'center',
                                fontWeight: 500,
                            }}
                        >
                            {message}
                        </Typography>
                    </motion.div>
                ) : null}
            </Box>
        );
    };

    const content = (
        <AnimatePresence mode="wait">
            <motion.div
                variants={containerVariants as any}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                {showCard ? (
                    <Card
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            backgroundColor: 'background.paper',
                            minWidth: variant === 'skeleton' ? 400 : 300,
                        }}
                    >
                        <CardContent sx={{ textAlign: 'center' }}>
                            {renderContent()}
                        </CardContent>
                    </Card>
                ) : (
                    renderContent()
                )}
            </motion.div>
        </AnimatePresence>
    );

    if (withBackdrop) {
        return (
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                }}
                open
            >
                {content}
            </Backdrop>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: fullScreen
                    ? `calc(100vh - ${HEADER.H_DESKTOP + BREADCRUMB_HEIGHT + (4 * SPACING)}px)`
                    : height || '400px',
                width: '100%',
                position: 'relative',
                top: 0,
            }}
            role="progressbar"
            aria-live="polite"
            aria-label="Loading content"
        >
            {showProgressBar ? <ProgressBar /> : null}
            {content}
        </Box>
    );
}

export default PageLoading;
