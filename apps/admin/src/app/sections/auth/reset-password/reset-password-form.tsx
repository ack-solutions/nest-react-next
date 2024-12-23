import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFPassword } from '@libs/react-core';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, ref, string } from 'yup';


export interface ResetPasswordFormProps {
    onSubmit: (values: any, form?: any) => void;
}


const passwordSchema = object().shape({
    password: string().label('New Password').matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ).required(),
    confirmPassword: string().label('Confirm New Password')
        .oneOf([ref('password'), ''], 'Passwords must match').required(),
});

const ResetPasswordForm = ({
    onSubmit,
}: ResetPasswordFormProps) => {

    const formContext = useForm({
        resolver: yupResolver(passwordSchema),
    })
    const { formState: { isSubmitting }, setError, reset } = formContext;

    const handleSubmit = useCallback(
        (value) => {
            onSubmit && onSubmit(value, {
                setError,
                reset
            });
        },
        [onSubmit, reset, setError]
    );
    return (
        <FormContainer
            FormProps={{
                id: "reset-from"
            }}
            formContext={formContext}
            validationSchema={passwordSchema}
            onSuccess={handleSubmit}
        >
            <Stack spacing={3}>
                <RHFPassword
                    fullWidth
                    label="New Password"
                    name='password'
                />

                <RHFPassword
                    fullWidth
                    label="Confirm New Password"
                    name='confirmPassword'
                />
                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Reset Password
                </LoadingButton>
            </Stack>
        </FormContainer>
    );
}
export default ResetPasswordForm
