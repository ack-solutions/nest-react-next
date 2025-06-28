import { Box, styled, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';


const RootStyle = styled('div')({
    height: '100vh',
    overflow: 'hidden',
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset', // Transparent background
        WebkitTextFillColor: 'white', // White text
        transition: 'background-color 5000s ease-in-out 0s', // Smooth transition
    },
    '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset',
        WebkitTextFillColor: 'white',
    },
});

const ContentStyle = styled(Box)(() => ({
    display: 'flex',
    height: '100%',
    backgroundImage: 'url(assets/auth/auth-bg.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left -200px top -100px',
    backgroundSize: 'auto',
    overflow: 'auto',
}));

const BoxStyle = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        margin: 'auto',
    },
}));

export default function AuthLayout() {
    return (
        <RootStyle>
            <RootStyle>
                <ContentStyle>
                    <BoxStyle
                        width="50%"
                        position="relative"
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'flex',
                            },
                        }}
                    >
                        <Box
                            component="img"
                            src="assets/auth/auth-logo.png"
                            sx={{
                                width: 300,
                                objectFit: 'contain',
                                position: 'absolute',
                                top: 100,
                                left: 100,
                            }}
                        />
                        <Typography
                            variant="h1"
                            color="common.white"
                            maxWidth={300}
                        />
                    </BoxStyle>
                    <BoxStyle
                        width={{
                            xs: '100%',
                            md: '50%',
                        }}
                    >
                        <Box
                            component="img"
                            src="assets/auth/auth-logo.png"
                            sx={{
                                width: 250,
                                objectFit: 'contain',
                                mb: 2,
                                display: {
                                    xs: 'block',
                                    md: 'none',
                                },
                            }}
                        />
                        <Box
                            sx={{
                                maxWidth: 450,
                                width: '100%',
                                py: {
                                    xs: 2,
                                    sm: 4,
                                },
                                px: {
                                    xs: 2,
                                    sm: 4,
                                },
                                borderRadius: 3,
                                background: 'rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Outlet />
                        </Box>
                    </BoxStyle>
                </ContentStyle>
            </RootStyle>

        </RootStyle>
    );
}
