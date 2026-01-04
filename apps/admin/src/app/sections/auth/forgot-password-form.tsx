import { yupResolver } from '@hookform/resolvers/yup';
import { patterns } from '@libs/utils';
import { Stack, Box, Typography, Alert, Link, Button } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object, string } from 'yup';

import { FormContainer, RHFTextField } from '../../form';
import { PATH_AUTH } from '../../routes/paths';


interface ForgotPasswordFormProps {
    onSubmit: (value, reset) => void
}

const validationSchema = object().shape({
    email: string()
        .label('Email')
        .required()
        .matches(patterns.email, 'Please enter a valid email'),
});

function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
    const formContext = useForm({
        resolver: yupResolver(validationSchema),
    });
    const { formState: { errors, isSubmitting }, reset } = formContext;

    const handleSubmitForm = useCallback(
        async (value) => {
            if (onSubmit) {
                await onSubmit(value, reset);
            }
        },
        [onSubmit, reset],
    );

    return (
        <Stack spacing={3}>
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Forgot Password
                </Typography>
                <Typography>
                    Enter your email for password recovery.
                </Typography>
            </Box>

            <FormContainer
                formProps={{
                    id: 'forgot-password-form',
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={2}>
                    {(errors as any)?.afterSubmit ? (
                        <Alert severity="error">
                            {(errors as any)?.afterSubmit.message}
                        </Alert>
                    ) : null}

                    <RHFTextField
                        fullWidth
                        type="email"
                        name="email"
                        label="Email address"
                        required
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Submit
                    </Button>
                </Stack>
            </FormContainer>

            <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
                mt={2}
            >
                <Typography sx={{ color: 'text.secondary' }}>Back to</Typography>
                <Link
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    sx={{
                        textDecoration: 'underline',
                        color: 'primary.main',
                    }}
                >
                    Login
                </Link>
            </Stack>
        </Stack>
    );
}

export default ForgotPasswordForm;
