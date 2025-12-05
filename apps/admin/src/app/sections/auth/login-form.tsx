import { yupResolver } from '@hookform/resolvers/yup';
import { ILoginSendOtpInput } from '@libs/types';
import { Stack, Alert, Button, Link } from '@mui/material';
import { useCallback } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { object, string } from 'yup';

import { FormContainer, RHFPassword, RHFTextField } from '../../form';
import { PATH_AUTH } from '@admin/app/routes/paths';
import { Link as RouterLink } from 'react-router-dom';


export type LoginFormProps = {
    onSubmit?: (
        value: ILoginSendOtpInput,
        setError: UseFormSetError<ILoginSendOtpInput>
    ) => void;
    // data?: ILoginSendOtpInput;
};

const defaultValues = {
    email: '',
    password: '',
};

const validationSchema = object().shape({
    email: string().label('Email').email().required(),
    password: string().label('Password').required(),
});

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const {
        formState: { errors, isSubmitting },
        setError,
    } = formContext;

    const handleSubmit = useCallback(
        async (value) => {
            if (onSubmit) { await onSubmit(value, setError); }
        },
        [onSubmit, setError],
    );


    return (
        <FormContainer
            formProps={{
                id: 'login-form',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >
            <Stack spacing={3}>
                {(errors as any).afterSubmit ? (
                    <Alert severity="error">
                        {(errors as any).afterSubmit.message as any}
                    </Alert>
                ) : null}
                <RHFTextField
                    fullWidth
                    type="email"
                    name="email"
                    label="Email address"
                />

                <RHFPassword
                    fullWidth
                    name="password"
                    label="Password"
                />
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="end"
                sx={{
                    my: 2,
                    marginLeft: '4px',
                }}
            >
                <Link
                    component={RouterLink}
                    to={PATH_AUTH.forgotPassword}
                    sx={{
                        textDecoration: 'none',
                    }}
                >
                    Forgot password?
                </Link>
            </Stack>

            <Button
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Login
            </Button>
        </FormContainer>
    );
}
