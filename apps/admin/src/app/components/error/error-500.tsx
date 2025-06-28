import { Box, Typography } from '@mui/material';

export default function Error500() {
    // const navigate = useNavigate();

    // const handleGoBack = () => {
    //     navigate(-1);
    // };

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
                    color: '#d32f2f',
                }}
            >
                500
            </Typography>
            <Typography
                variant="h4"
                sx={{ mb: 2 }}
            >
                Internal Server Error
            </Typography>
            <Typography
                variant="body1"
                sx={{ mb: 4 }}
            >
                Sorry, something went wrong on our end. Our team has been notified and we're working to fix it.
            </Typography>
            {/* <Button
                variant="contained"
                color="error"
                onClick={handleGoBack}
            >
                Go Back
            </Button> */}
        </Box>
    );
}
