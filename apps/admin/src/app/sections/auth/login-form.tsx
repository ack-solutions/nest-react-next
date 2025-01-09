import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFCheckbox, RHFPassword, RHFTextField } from '@libs/react-core';
import { ILoginSendOtpInput } from '@libs/types';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    Stack,
    Alert,
    Link,
} from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { boolean, object, string } from 'yup';

import { PATH_AUTH } from '../../routes/paths';


export type LoginFormProps = {
    onSubmit?: (
        value: ILoginSendOtpInput,
        setError?: any
    ) => void;
};

const defaultValues = {
    email: '',
    password: '',
    remember: true,
};

const validationSchema = object().shape({
    email: string()
        .email('Email must be a valid email address')
        .required('Email is required'),
    password: string().required('Password is required'),
    remember: boolean().oneOf([true], 'Please confirm to stay signed in.').label('Remember'),

});

export default function LoginForm({ onSubmit }: LoginFormProps) {
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const { formState: { errors, isSubmitting }, setError } = formContext;

    const handleSubmit = useCallback(
        (value: any) => {
            if (onSubmit) {
                onSubmit(value, setError)
            }
        },
        [onSubmit, setError],
    );

    return (
        <FormContainer
            FormProps={{
                id: 'login-from',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >

            <Stack spacing={3}>
                {(errors as any).afterSubmit && (
                    <Alert severity="error">{(errors as any).afterSubmit.message}</Alert>
                )}
                <RHFTextField
                    fullWidth
                    type="email"
                    name="email"
                    label="Email address"
                    autoComplete="email"
                />

                <RHFPassword
                    fullWidth
                    name="password"
                    label="Password"
                    autoComplete="password"
                />
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    my: 2,
                    marginLeft: '4px',
                }}
            >

                <RHFCheckbox
                    name="remember"
                    label='Remember me'
                    required
                />
                <Link
                    component={RouterLink}
                    to={PATH_AUTH.forgotPassword}
                    sx={{
                        ':hover': {
                            textDecoration: 'none',
                        },
                    }}
                >
                    Forgot password?
                </Link>
            </Stack>

            <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Login
            </LoadingButton>
        </FormContainer>
    );
}
