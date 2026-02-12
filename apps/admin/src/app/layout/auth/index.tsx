import { Logo } from '@admin/app/components/logo';
import { Box, styled, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';


const RootStyle = styled('div')(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    background: theme.palette.background.default,
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset',
        WebkitTextFillColor: theme.palette.text.primary,
        transition: 'background-color 5000s ease-in-out 0s',
    },
    '& input:-webkit-autofill:hover, & input:-webkit-autofill:focus': {
        WebkitBoxShadow: '0 0 0 1000px transparent inset',
        WebkitTextFillColor: theme.palette.text.primary,
    },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.darker} 100%)`,
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: 0,
    },
}));

const RightPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    background: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
        flex: 'none',
        width: '100%',
        minHeight: '100vh',
    },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: theme.palette.common.white,
}));

const LogoIcon = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: `linear-gradient(45deg, ${theme.palette.common.white} 0%, rgba(255, 255, 255, 0.9) 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    fontSize: '2rem',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
}));

const FormContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: 420,
    padding: theme.spacing(4),
    borderRadius: theme.spacing(2),
    background: theme.palette.background.paper,
    boxShadow: theme.palette.mode === 'dark'
        ? '0 20px 40px rgba(0, 0, 0, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.divider}`,
}));

const DecorativeElement = styled(Box)(({ theme }) => ({
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
    '&:nth-of-type(1)': {
        width: 200,
        height: 200,
        top: '10%',
        right: '10%',
        animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
        width: 150,
        height: 150,
        bottom: '20%',
        left: '15%',
        animationDelay: '2s',
    },
    '&:nth-of-type(3)': {
        width: 100,
        height: 100,
        top: '60%',
        right: '20%',
        animationDelay: '4s',
    },
    animation: 'float 6s ease-in-out infinite',
    '@keyframes float': {
        '0%, 100%': {
            transform: 'translateY(0px)',
        },
        '50%': {
            transform: 'translateY(-20px)',
        },
    },
}));

export default function AuthLayout() {
    return (
        <RootStyle>
            <LeftPanel>
                <DecorativeElement />
                <DecorativeElement />
                <DecorativeElement />

                <LogoContainer>
                    <LogoIcon>
                        A
                    </LogoIcon>
                    <Typography
                        variant="h3"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            color: 'common.white',
                        }}
                    >
                        Admin Portal
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            opacity: 0.95,
                            maxWidth: 400,
                            lineHeight: 1.6,
                            color: 'common.white',
                        }}
                    >
                        Manage your business with our powerful admin dashboard
                    </Typography>
                </LogoContainer>
            </LeftPanel>

            <RightPanel>
                <FormContainer>
                    <Box sx={{
                        textAlign: 'center',
                        mb: 3,
                    }}>
                        <Logo disabledLink small />
                    </Box>
                    <Outlet />
                </FormContainer>
            </RightPanel>
        </RootStyle>
    );
}
