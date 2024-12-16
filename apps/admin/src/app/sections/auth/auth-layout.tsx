import { Container, styled, Box } from "@mui/material";
import { ReactNode } from "react";


interface AuthLayoutProps {
    children?: ReactNode;
    rootTitle: string;

}

const RootStyle = styled(Box)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
        height: '100%'
    },
}));


const ContentStyle = styled(Box)(() => ({
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
}));


const AuthLayout = ({
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
                    maxWidth: {
                        xs: '100%',
                        md: 'calc(100% / 2)'
                    }

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
