import { AuthService } from '@libs/react-shared';
import { IForgotPasswordInput, OtpSendActionEnum } from '@libs/types';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';

import { useToasty } from '../../hook';
import ForgotPasswordForm from '../../sections/auth/forgot-password-form';
import ResetPasswordForm from '../../sections/auth/reset-password-form';


const authService = AuthService.getInstance<AuthService>();

function ForgotPassword() {
    const [verifyData, setVerifyData] = useState(false);
    const { showToasty } = useToasty();
    const [formValue, setFormValue] = useState<any>({});

    const handleSubmit = useCallback(
        async (value: IForgotPasswordInput, reset) => {
            setFormValue(value);
            await authService.sendOtp({
                ...value,
                action: OtpSendActionEnum.FORGOT_PASSWORD,
            }).then(() => {
                showToasty('OTP has been sent to your email, please verify');
                setVerifyData(true);
                reset();
            }).catch((error) => {
                showToasty(error, 'error');
            });
        },
        [showToasty],
    );

    return (
        <Box>
            {!verifyData ? (
                <ForgotPasswordForm onSubmit={handleSubmit} />
            ) : (
                <ResetPasswordForm
                    values={formValue}
                />
            )}
        </Box>
    );
}

export default ForgotPassword;
