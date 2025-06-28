import { Box, Container, Stack, Typography } from '@mui/material';


function ComingSoon() {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth={false}>
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <Typography
                        variant="h1"
                        sx={{
                            mb: 2,
                            textAlign: 'center',
                        }}
                    >
                        Coming Soon
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
}

export default ComingSoon;
