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


export interface ResetPasswordFormProps {
    token: string;
}

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
                showToasty('Something went wrong, please try again later.', 'error');
                return;
            }
            try {
                await resetPassword({
                    token: token,
                    newPassword: value.password,
                });
                showToasty('Your password has been updated successfully.');
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
                    <Typography>
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
        </Box>
    );
}

export default ResetPasswordForm;
