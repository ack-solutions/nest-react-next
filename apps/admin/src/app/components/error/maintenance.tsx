import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/auth-context';


export function Maintenance() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleRefresh = () => {
        if (isAuthenticated) {
            navigate('/');
        } else {
            window.location.reload();
        }
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
            <Typography
                variant="h1"
                sx={{
                    fontSize: '5rem',
                    fontWeight: 'bold',
                    color: '#ed6c02',
                }}
            >
                Maintenance Mode
            </Typography>

            <Typography
                variant="h4"
                sx={{ mb: 2 }}
            >
                We'll be back shortly!
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    mb: 4,
                    maxWidth: '600px',
                }}
            >
                Our system is currently undergoing scheduled maintenance to improve your experience.
                We expect to be back online soon. Thank you for your patience and understanding.
            </Typography>

            <Typography
                variant="body1"
                sx={{ maxWidth: '600px' }}
            >
                If you need immediate assistance, please contact your administrator or reach out to us at
                {' '}
                <a href="mailto:contact@ackplus.com">contact@ackplus.com</a>
                .
            </Typography>
            <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="warning"
                onClick={handleRefresh}
            >
                Try Again
            </Button>
        </Box>

    );
}
