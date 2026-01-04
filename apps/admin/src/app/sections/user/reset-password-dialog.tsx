import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '@libs/react-shared';
import { IUser } from '@libs/types';
import { Button, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { DefaultDialog } from '../../components';
import { FormContainer, RHFPassword } from '../../form';
import { useToasty } from '../../hook';


interface ResetPasswordDialogProps {
    open: boolean;
    onClose: () => void;
    user?: IUser;
}

interface FormValues {
    password: string;
    confirmPassword: string;
}

const validationSchema = object().shape({
    password: string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: string()
        .required('Confirm password is required')
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.password === value;
        }),
});

export default function ResetPasswordDialog({
    open,
    onClose,
    user,
}: ResetPasswordDialogProps) {
    const { showToasty } = useToasty();
    const { useSetPassword } = useUser();
    const { mutateAsync: setPassword, isPending } = useSetPassword();

    const formContext = useForm<FormValues>({
        resolver: yupResolver(validationSchema) as any,
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { formState: { isSubmitting } } = formContext;

    const handleSubmitForm = useCallback(
        async (values: FormValues) => {
            try {
                if (!user?.id) {
                    showToasty('User not found', 'error');
                    return;
                }

                await setPassword({
                    userId: user.id,
                    password: values.password,
                });

                showToasty('Password reset successfully');
                onClose();
            } catch (error) {
                showToasty(error || 'Failed to reset password', 'error');
            }
        },
        [
            setPassword,
            user?.id,
            showToasty,
            onClose,
        ],
    );

    return (
        <DefaultDialog
            open={open}
            onClose={onClose}
            title="Reset Password"
            maxWidth="sm"
            fullWidth
            actions={
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={isSubmitting || isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || isPending}
                        form="reset-password-form"
                    >
                        Reset Password
                    </Button>
                </Stack>
            }
        >
            <FormContainer<FormValues>
                formProps={{
                    id: 'reset-password-form',
                }}
                formContext={formContext}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={3}>
                    <Typography variant="body2" color="text.secondary">
                        Setting a new password for <strong>{user?.name}</strong>
                    </Typography>

                    <RHFPassword
                        name="password"
                        label="New Password"
                        fullWidth
                        required
                    />

                    <RHFPassword
                        name="confirmPassword"
                        label="Confirm New Password"
                        fullWidth
                        required
                    />
                </Stack>
            </FormContainer>
        </DefaultDialog>
    );
}
