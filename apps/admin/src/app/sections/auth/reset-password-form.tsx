import { yupResolver } from '@hookform/resolvers/yup';
import { AuthService } from '@libs/react-shared';
import { OtpSendActionEnum } from '@libs/types';
import { errorMessage, patterns } from '@libs/utils';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';

import LoginOtpVerification from './login-otp-verification';
import { FormContainer, RHFPassword } from '../../form';
import { useToasty } from '../../hook';
import { PATH_AUTH } from '../../routes/paths';


export interface ResetPasswordFormProps {
    values?: any
}

const authService = AuthService.getInstance<AuthService>();

const validationSchema = object().shape({
    password: string()
        .label('New Password')
        .required()
        .min(8, 'New Password must be at least 8 characters')
        .matches(patterns.password, 'New Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
    confirmPassword: string()
        .label('Confirm Password')
        .oneOf([ref('password'), null], 'Passwords must match the confirmation password.')
        .required(),
});

function ResetPasswordForm({ values }: ResetPasswordFormProps) {
    const [verifyData, setVerifyData] = useState(false);
    const [formValue, setFormValue] = useState<any>(values);
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const formContext = useForm({
        defaultValues: formValue,
        resolver: yupResolver(validationSchema),
    });

    const { formState: { isSubmitting } } = formContext;

    const handleBackLogin = useCallback(
        () => {
            navigate(PATH_AUTH.login);
        },
        [navigate],
    );

    const handleSubmitForm = useCallback(
        async (value) => {
            await authService.resetPassword({
                ...value,
                ...formValue,
            }).then(() => {
                showToasty('Your password has been updated successfully.');
                navigate(PATH_AUTH.login);
            }).catch((error) => {
                showToasty(error, 'error');
            });
        },
        [
            formValue,
            navigate,
            showToasty,
        ],
    );


    const handleOTPVerify = useCallback(
        async (value, setError) => {
            await authService.verifyOtp({
                ...value,
                ...formValue,
            }).then(() => {
                setVerifyData(true);
                setFormValue((state) => {
                    return {
                        ...state,
                        ...value,
                    };
                });
            }).catch((error) => {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            });
        },
        [formValue],
    );

    const handleReSentOtp = useCallback(
        (setError?: any) => {
            authService.sendOtp({
                ...formValue,
                action: OtpSendActionEnum.FORGOT_PASSWORD,
            }).then(() => {
                showToasty('Successfully Resend OTP');
            }).catch((error) => {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            });
        },
        [formValue, showToasty],
    );

    return (
        <Box>
            {verifyData ? (
                <>
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{ mb: 4 }}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                gutterBottom
                            >
                                Set new password
                            </Typography>
                            <Typography variant="subtitle1">
                                Your new password must be different to previously used passwords.
                            </Typography>
                        </Box>
                    </Stack>
                    <FormContainer
                        formProps={{
                            id: 'reset-password',
                        }}
                        formContext={formContext}
                        validationSchema={validationSchema}
                        onSuccess={handleSubmitForm}
                    >
                        <Stack spacing={2}>
                            <RHFPassword
                                fullWidth
                                name="password"
                                label="Password"
                                required
                            />
                            <RHFPassword
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                required
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Reset Password
                            </Button>
                        </Stack>
                    </FormContainer>
                </>
            ) : (
                <LoginOtpVerification
                    onSubmit={handleOTPVerify}
                    onResent={handleReSentOtp}
                    onGoBack={handleBackLogin}
                />
            )}
        </Box>
    );
}

export default ResetPasswordForm;
