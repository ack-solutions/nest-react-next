import { Home, ArrowBack, Refresh, Search } from '@mui/icons-material';
import { Box, Typography, Button, Paper, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


export interface NotFoundProps {
    entityType?: string;
    redirectPath?: string;
    showRefresh?: boolean;
    showSearch?: boolean;
    customMessage?: string;
    errorCode?: string;
}

function NotFound({
    entityType = 'Page',
    redirectPath = '/',
    showRefresh = false,
    showSearch = false,
    customMessage,
    errorCode = '404',
}: NotFoundProps) {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(redirectPath);
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleSearch = () => {
        navigate('/search');
    };

    const getErrorMessage = () => {
        if (customMessage) return customMessage;

        if (entityType.toLowerCase() === 'data' || entityType.toLowerCase() === 'record') {
            return 'The requested data could not be found. It may have been deleted, moved, or the ID is incorrect.';
        }

        return `The ${entityType.toLowerCase()} you are looking for does not exist or has been moved.`;
    };

    const getErrorTitle = () => {
        if (errorCode === '404') {
            return `${entityType} Not Found`;
        }
        return 'Oops! Something went wrong';
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
                backgroundColor: '#f8f9fa',
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
                        maxWidth: 500,
                        mx: 'auto',
                        transform: 'translateY(-120px)',
                    }}
                >
                    {/* Error Code */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: {
                                xs: '4rem',
                                sm: '5rem',
                                md: '6rem',
                            },
                            fontWeight: 'bold',
                            color: '#1976d2',
                            mb: 2,
                        }}
                    >
                        {errorCode}
                    </Typography>

                    {/* Error Title */}
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            fontWeight: 600,
                            color: 'text.primary',
                            fontSize: {
                                xs: '1.5rem',
                                sm: '2rem',
                            },
                        }}
                    >
                        {getErrorTitle()}
                    </Typography>

                    {/* Error Message */}
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            color: 'text.secondary',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                        }}
                    >
                        {getErrorMessage()}
                    </Typography>

                    {/* Action Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                sm: 'row',
                            },
                            gap: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: showRefresh || showSearch ? 3 : 0,
                        }}
                    >
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGoBack}
                            startIcon={<ArrowBack />}
                            sx={{
                                minWidth: 140,
                                py: 1.2,
                                textTransform: 'none',
                                fontSize: '1rem',
                            }}
                        >
                            Go
                            {' '}
                            {entityType ? `${entityType} List` : 'Back'}
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleGoHome}
                            startIcon={<Home />}
                            sx={{
                                minWidth: 140,
                                py: 1.2,
                                textTransform: 'none',
                                fontSize: '1rem',
                            }}
                        >
                            Home Page
                        </Button>
                    </Box>

                    {/* Additional Action Icons */}
                    {(showRefresh || showSearch) ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                pt: 3,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {showRefresh ? (
                                <Tooltip
                                    title="Refresh Page"
                                    arrow
                                >
                                    <IconButton
                                        onClick={handleRefresh}
                                        sx={{
                                            backgroundColor: 'grey.100',
                                            '&:hover': {
                                                backgroundColor: 'grey.200',
                                            },
                                        }}
                                    >
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            ) : null}

                            {showSearch ? (
                                <Tooltip
                                    title="Search"
                                    arrow
                                >
                                    <IconButton
                                        onClick={handleSearch}
                                        sx={{
                                            backgroundColor: 'grey.100',
                                            '&:hover': {
                                                backgroundColor: 'grey.200',
                                            },
                                        }}
                                    >
                                        <Search />
                                    </IconButton>
                                </Tooltip>
                            ) : null}
                        </Box>
                    ) : null}
                </Paper>
            </motion.div>
        </Box>
    );
}

export default NotFound;
