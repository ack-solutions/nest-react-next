import { IForgotPasswordInput } from '@libs/types';
import { errorMessage } from '@libs/utils';
import { Box } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@libs/react-shared';
import { useToasty } from '../../hook';
import { PATH_AUTH } from '../../routes/paths';
import ForgotPasswordForm from '../../sections/auth/forgot-password-form';


function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        async (value: IForgotPasswordInput, reset: () => void) => {
            try {
                await forgotPassword({
                    email: value.email,
                });
                showToasty('Password reset instructions have been sent to your email');
                navigate(`${PATH_AUTH.resetPassword}?email=${encodeURIComponent(value.email)}`);
                reset();
            } catch (error) {
                showToasty(errorMessage(error), 'error');
            }
        },
        [forgotPassword, navigate, showToasty],
    );

    return <ForgotPasswordForm onSubmit={handleSubmit} />;
}

export default ForgotPassword;
