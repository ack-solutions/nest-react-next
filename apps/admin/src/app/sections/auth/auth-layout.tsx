import { useResponsive } from "@mlm/react-core";
import { Container, styled, Box } from "@mui/material";
import { ReactNode } from "react";

interface AuthLayoutProps {
    src: string;
    headerComponent?: ReactNode;
    children?: ReactNode;
    rootTitle: string;

}
const RootStyle = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
        height: '100%'
    },
}));

const SectionStyle = styled(Box)(({ theme }) => ({
    width: '50%',
    height: '100vh',
    padding: theme.spacing(3, 3, 6, 3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundImage: 'url(/assets/static/illustrations/bg-login.png)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: theme.palette.primary.main,
}));

const ContentStyle = styled(Box)(() => ({
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
}));


const AuthLayout = ({
    src,
    headerComponent = null,
    children,
    rootTitle,
}: AuthLayoutProps) => {
    const isDesktop = useResponsive('up', 'md')
    return (
        <RootStyle title={rootTitle}>
            {!isDesktop && (
                <SectionStyle>
                    <Box sx={{ mt: 4, mb: { xs: 6, xl: 10 }, maxWidth: '290px' }}>
                        <Box
                            component="img"
                            src="/assets/images/logo.svg"
                            sx={{
                                height: '100%',
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box sx={{
                        height: 'calc(100vh - 250px)'
                    }}>
                        <Box
                            component="img"
                            src={src}
                            sx={{
                                //maxWidth: 530,
                                height: '100%',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                    </Box>
                </SectionStyle>
            )}

            <Container
                disableGutters
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    maxWidth: { xs: '100%', md: 'calc(100% / 2)' }

                }}
            >
                <ContentStyle
                    sx={{
                        width: '100%',
                        overflow: 'auto',
                        px: 2
                    }}
                >
                    {children}
                </ContentStyle>
            </Container>

        </RootStyle>

    );
};

export default AuthLayout;
