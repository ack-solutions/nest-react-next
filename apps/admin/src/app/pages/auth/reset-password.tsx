import { NestAuthService } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Box } from '@mui/material';
import { useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { useToasty } from '../../hook';
import { PATH_AUTH } from '../../routes/paths';
import OtpVerification from '../../sections/auth/otp-verification';
import ResetPasswordForm from '../../sections/auth/reset-password-form';


const nestAuthService = NestAuthService.getInstance<NestAuthService>();

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const resetToken = searchParams.get('resetToken');
    const email = searchParams.get('email');
    const { showToasty } = useToasty();

    const handleOTPVerify = useCallback(
        async (value, setError) => {
            await nestAuthService.verifyForgotPasswordOtp({
                ...value,
                ...(email && { email }),
            }).then((response) => {
                const token = response?.data?.resetToken;
                if (token) {
                    navigate(`${PATH_AUTH.resetPassword}?resetToken=${token}`);
                } else {
                    showToasty('Token not received, please try again.', 'error');
                }
            }).catch((error) => {
                showToasty(errorMessage(error), 'error');
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            });
        },
        [email, navigate, showToasty],
    );

    const handleReSentOtp = useCallback(
        (setError?: any) => {
            if (!email) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: 'Email is required to resend OTP',
                });
                return;
            }
            nestAuthService.forgotPassword({
                email: email,
            }).then(() => {
                showToasty('Successfully Resend OTP');
            }).catch((error) => {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            });
        },
        [email, showToasty],
    );

    const handleBackLogin = useCallback(
        () => {
            navigate(PATH_AUTH.login);
        },
        [navigate],
    );

    return (
        <Box>
            {resetToken ? (
                <ResetPasswordForm token={resetToken} />
            ) : (
                <OtpVerification
                    onSubmit={handleOTPVerify}
                    onResent={handleReSentOtp}
                    onGoBack={handleBackLogin}
                    values={email ? { email } : undefined}
                />
            )}
        </Box>
    );
}

export default ResetPassword;
