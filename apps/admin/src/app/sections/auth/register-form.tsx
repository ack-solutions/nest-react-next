import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFCheckbox, RHFPassword, RHFTextField } from '@libs/react-core';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Link, Stack } from '@mui/material';
import { useCallback } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { boolean, object, string } from 'yup';

import { PATH_AUTH } from '../../routes/paths';


export interface RegisterFromProps {
    onSubmit?: (value: any, setError: UseFormSetError<any>) => void;
}

const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    remember: false,
};

const validationSchema = object().shape({
    email: string()
        .email('Email must be a valid email address')
        .required('Email is required'),
    password: string().required('Password is required'),
    firstName: string().required('First Name is required'),
    lastName: string().required('Last Name is required'),
    remember: boolean().label('Remember').required(),
});

const RegisterFrom = ({ onSubmit }: RegisterFromProps) => {
    const formContext = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });
    const { formState: { errors, isSubmitting }, setError } = formContext;

    const handleSubmit = useCallback(
        (value: any) => {
            if (onSubmit) {
                onSubmit(value, setError);
            }
        },
        [onSubmit, setError],
    );


    return (
        <FormContainer
            FormProps={{
                id: 'register-from',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmit}
        >
            <Stack spacing={2}>
                {(errors as any).afterSubmit && (
                    <Alert severity="error">{(errors as any).afterSubmit.message as any}</Alert>
                )}
                <RHFTextField
                    fullWidth
                    name="firstName"
                    label="First Name"
                    required
                />

                <RHFTextField
                    fullWidth
                    name="lastName"
                    label="Lase Name"
                    required
                />
                <RHFTextField
                    fullWidth
                    type="email"
                    name="email"
                    label="Email address"
                    autoComplete="email"
                    required
                />
                <RHFPassword
                    fullWidth
                    name="password"
                    label="Password"
                    required
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
                />

                <Link
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    sx={{
                        ':hover': {
                            textDecoration: 'none',
                        },
                    }}
                >
                    Have an Account  Login Here?
                </Link>
            </Stack>

            <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
            >
                Register
            </LoadingButton>
        </FormContainer>
    );
};

export default RegisterFrom;
