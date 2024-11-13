import { useResponsive } from "@libs/react-core";
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
    return (
        <RootStyle title={rootTitle}>
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
