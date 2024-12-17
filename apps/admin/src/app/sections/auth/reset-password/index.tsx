import Page from '@admin/app/components/page';
import { AuthService, errorMessage } from '@libs/react-core';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';

import ResetPasswordForm from './reset-password-form';
import SuccessDialog from './success-dialog';


export interface ResetPasswordProps {
    onCloseModal?: () => void;
    email?: string;
    otp?: string;
}

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const ContentStyle = styled('div')(() => ({
    maxWidth: 530,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
}));

const authService = AuthService.getInstance<AuthService>();

const ResetPassword = ({
    email,
    otp,
}: ResetPasswordProps) => {
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    const handleResetPassword = useCallback(
        async (values: any, form: any) => {
            try {
                const request = {
                    ...values,
                    email,
                    otp
                }
                await authService.resetPassword(request).then(() => {
                    form.reset();
                    setIsSuccessDialogOpen(true);
                })
            } catch (error) {
                form.setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
                form.reset();
            }
        },
        [email, otp],
    )

    const handleSuccessDialogClose = () => {
        setIsSuccessDialogOpen(false);
    };

    return (
        <RootStyle title="Reset Password | Minimal UI">
            <Container maxWidth="sm">
                <ContentStyle>
                    <Box >
                        <Typography variant="h2" >
                            Reset Password
                        </Typography>
                        <Typography
                            sx={{
                                color: 'text.secondary',
                                mb: 5
                            }}
                        >
                            Enter your password to access the app next time.
                        </Typography>
                        <ResetPasswordForm onSubmit={handleResetPassword} />
                    </Box>
                </ContentStyle>
            </Container>
            {isSuccessDialogOpen ? (
                <SuccessDialog onClose={handleSuccessDialogClose} />
            ) : null}
        </RootStyle>
    );
}

export default ResetPassword;
