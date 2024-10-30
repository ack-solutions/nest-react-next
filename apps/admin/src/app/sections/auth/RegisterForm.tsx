import { Icon, TextField, useBoolean } from '@mlm/react-core';
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, IconButton, InputAdornment, Link, Stack, useTheme } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import React, { useCallback } from 'react'
import { Link as RouterLink } from 'react-router-dom';
import { boolean, object, string } from 'yup';
import { PATH_AUTH } from '../../routes/paths';
export interface RegisterFromProps {
    onSubmit?: (
        value: any,
        action: FormikHelpers<any>
    ) => void;
}

const defaultValues = {
    firstName: "",
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
    const showPassword = useBoolean()
    const theme = useTheme();

    const handleSubmit = useCallback(
        (value: any, action: any) => {
            onSubmit && onSubmit(value, action);
        },
        [onSubmit]
    );

    return (
        <Formik
            initialValues={Object.assign({}, defaultValues)}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, isSubmitting, handleSubmit }) => (
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        {(errors as any).afterSubmit && (
                            <Alert severity="error">{(errors as any).afterSubmit as any}</Alert>
                        )}

                        <Field
                            fullWidth
                            name="firstName"
                            label="First Name"
                            component={TextField}
                        />

                        <Field
                            fullWidth
                            name="lastName"
                            label="Lase Name"
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            type="email"
                            name="email"
                            label="Email address"
                            autoComplete="email"
                            component={TextField}
                        />
                        <Field
                            fullWidth
                            type={showPassword.value ? 'text' : 'password'}
                            name="password"
                            label="Password"
                            autoComplete="password"
                            component={TextField}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => showPassword.onToggle()} edge="end">
                                            <Icon
                                                icon={showPassword.value ? 'eye' : 'eye-slash'}
                                                color={theme.palette.grey[500]}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>

                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ my: 2, marginLeft: '4px' }}
                    >

                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name="remember"
                            Label={{ label: 'Remember me' }}
                        />

                        <Link
                            component={RouterLink}
                            to={PATH_AUTH.login}
                            sx={{
                                ':hover': {
                                    textDecoration: 'none'
                                }
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
                </Form>
            )}
        </Formik>
    )
}

export default RegisterFrom