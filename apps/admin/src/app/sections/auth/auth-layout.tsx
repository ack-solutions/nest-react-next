import { Box, styled, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { Logo } from '../../components/logo';


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
                        sx={{
                            position: 'absolute',
                            top: 100,
                            left: 100,
                        }}
                    >
                        <Logo
                            disabledLink
                            sx={{
                                width: 120,
                                height: 120,
                            }}
                        />
                    </Box>
                    <Typography
                        variant="h1"
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
