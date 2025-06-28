import { Box, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';


export interface AuthLayoutProps {
    children?: ReactNode;
    title?: string
}
const RootStyle = styled('div')({
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(153deg, rgba(10,55,169,1) 0%, rgba(4,22,67,1) 100%)',
});

const ContentStyle = styled(Box)(() => ({
    display: 'flex',
    height: '100%',
    backgroundImage: 'url(assets/auth/auth-bg.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left -200px top -100px',
    backgroundSize: 'auto',
}));

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));


export default function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <RootStyle>
            <ContentStyle>
                <BoxStyle
                    width="50%"
                    position="relative"
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
                    >
                        {title}
                    </Typography>
                </BoxStyle>
                <BoxStyle width="50%">
                    <Box
                        sx={{
                            maxWidth: 420,
                            width: '100%',
                            py: 4,
                            px: 3,
                            borderRadius: 3,
                            background: 'rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        {children}
                    </Box>
                </BoxStyle>
            </ContentStyle>
        </RootStyle>
    );
}
