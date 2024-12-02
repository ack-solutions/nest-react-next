import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the homepage or any other route
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
                backgroundColor: '#f4f4f4',
                px: 2,
            }}
        >
            <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 'bold', color: '#1976d2' }}>
        404
            </Typography>
            <Typography variant="h4" sx={{ mb: 2 }}>
        Oops! Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for does not exist or has been moved.
            </Typography>
            {/* <Box
        component="img"
        src="/404-image.png" 
        alt="Not Found"
        sx={{ width: '300px', mb: 4 }}
      /> */}
            <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Home
            </Button>
        </Box>
    );
};

export default NotFound;