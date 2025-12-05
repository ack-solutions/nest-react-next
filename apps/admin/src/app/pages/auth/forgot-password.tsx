import { NestAuthService } from '@libs/react-shared';
import { IForgotPasswordInput } from '@libs/types';
import { errorMessage } from '@libs/utils';
import { Box } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToasty } from '../../hook';
import { PATH_AUTH } from '../../routes/paths';
import ForgotPasswordForm from '../../sections/auth/forgot-password-form';


const authService = NestAuthService.getInstance<NestAuthService>();

function ForgotPassword() {
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        async (value: IForgotPasswordInput, reset) => {
            await authService.forgotPassword({
                email: value.email,
            }).then(() => {
                showToasty('Password reset email has been sent to your email, please check your email');
                navigate(`${PATH_AUTH.resetPassword}?email=${encodeURIComponent(value.email)}`);
                reset();
            }).catch((error) => {
                showToasty(errorMessage(error), 'error');
            });
        },
        [navigate, showToasty],
    );

    return (
        <ForgotPasswordForm onSubmit={handleSubmit} />
    );
}

export default ForgotPassword;
