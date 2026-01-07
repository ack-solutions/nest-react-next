import { yupResolver } from '@hookform/resolvers/yup';
import { errorMessage, patterns } from '@libs/utils';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';

import { useAuth } from '@libs/react-shared';
import { FormContainer, RHFPassword } from '../../form';
import { useToasty } from '../../hook';
import { PATH_AUTH } from '../../routes/paths';
import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';


export interface ResetPasswordFormProps {
    token: string;
}

const validationSchema = object().shape({
    password: string()
        .label('New Password')
        .required('Please enter a new password')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            patterns.password,
            'Password must include uppercase, lowercase, number, and special character'
        ),
    confirmPassword: string()
        .label('Confirm Password')
        .oneOf([ref('password'), null], 'Passwords do not match')
        .required('Please confirm your password'),
});

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const { resetPassword } = useAuth();
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const formContext = useForm({
        resolver: yupResolver(validationSchema),
    });

    const { formState: { isSubmitting } } = formContext;

    const handleSubmitForm = useCallback(
        async (value: { password: string; confirmPassword: string }) => {
            if (!token) {
                showToasty('Invalid reset link. Please request a new one.', 'error');
                return;
            }
            try {
                await resetPassword({
                    token: token,
                    newPassword: value.password,
                });
                showToasty('Your password has been reset successfully');
                navigate(PATH_AUTH.login);
            } catch (error) {
                showToasty(errorMessage(error), 'error');
            }
        },
        [token, navigate, showToasty, resetPassword],
    );

    return (
        <Box>
            <Stack
                spacing={1}
                sx={{ mb: 4 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            icon={IconEnum.Shield}
                            width={32}
                            height={32}
                        />
                    </Box>
                </Box>

                <Typography
                    variant="h4"
                    textAlign="center"
                    gutterBottom
                >
                    Create new password
                </Typography>
                <Typography textAlign="center" color="text.secondary">
                    Your new password must be different from your previous password.
                </Typography>
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
                        label="New Password"
                        placeholder="Enter new password"
                    />
                    <RHFPassword
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="Confirm new password"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Reset Password
                    </Button>
                </Stack>
            </FormContainer>
        </Box>
    );
}

export default ResetPasswordForm;
