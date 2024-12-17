import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFTextField } from '@libs/react-core';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


export interface ForgetPasswordFormProps {
    onSubmit: (values: any, form?: any) => void;
}

const defaultValues = {
    email: '',
}

const validationSchema = object().shape({
    email: string().label('Email').email().required(),
});

const ForgetPasswordForm = ({
    onSubmit,
}: ForgetPasswordFormProps) => {
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    })
    const { formState: { errors, isSubmitting }, setError, reset } = formContext;

    const handleSubmit = useCallback(
        (value: any) => {
            onSubmit && onSubmit(value, {
                reset,
                setError
            });
        },
        [onSubmit, reset, setError]
    );

    return (
        <FormContainer
            FormProps={{
                id: "forgot-password-from"
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >
            <Stack spacing={3}>
                <Box
                    pb={2}
                    pt={0}
                >
                    {(errors as any)?.afterSubmit && (
                        <Alert severity="error">{(errors as any)?.afterSubmit.message}</Alert>
                    )}
                </Box>

                <RHFTextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                />

                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                >
                    Send OTP
                </LoadingButton>
            </Stack>
        </FormContainer>
    );
};

export default ForgetPasswordForm;
