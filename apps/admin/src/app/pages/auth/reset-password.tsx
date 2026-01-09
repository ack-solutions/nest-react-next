import { errorMessage } from '@libs/utils';
import { Box } from '@mui/material';
import { useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToasty } from '../../hook';
import { PATH_AUTH } from '../../routes/paths';
import OtpVerification from '../../sections/auth/otp-verification';
import ResetPasswordForm from '../../sections/auth/reset-password-form';
import { useAuth } from '@libs/react-shared';


function ResetPassword() {
    const { verifyForgotPasswordOtp, forgotPassword } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const resetToken = searchParams.get('resetToken');
    const email = searchParams.get('email');
    const { showToasty } = useToasty();

    const handleOTPVerify = useCallback(
        async (value: { otp: string }, setError: any) => {
            try {
                const response = await verifyForgotPasswordOtp({
                    otp: value.otp,
                    ...(email && { email }),
                });
                const token = response?.resetToken || response?.token;
                if (token) {
                    navigate(`${PATH_AUTH.resetPassword}?resetToken=${token}`);
                } else {
                    showToasty('Unable to verify code. Please try again.', 'error');
                }
            } catch (error) {
                showToasty(errorMessage(error), 'error');
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [email, navigate, showToasty, verifyForgotPasswordOtp],
    );

    const handleResendOtp = useCallback(
        async (setError?: any) => {
            if (!email) {
                setError?.('afterSubmit', {
                    type: 'manual',
                    message: 'Email address is required to resend the code',
                });
                return;
            }
            try {
                await forgotPassword({ email });
                showToasty('A new verification code has been sent to your email');
            } catch (error) {
                setError?.('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [email, forgotPassword, showToasty],
    );

    const handleBackToLogin = useCallback(
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
                    onResent={handleResendOtp}
                    onGoBack={handleBackToLogin}
                    values={email ? { email } : undefined}
                />
            )}
        </Box>
    );
}

export default ResetPassword;
