import { yupResolver } from '@hookform/resolvers/yup';
import { patterns } from '@libs/utils';
import { Stack, Box, Typography, Alert, Link, Button } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { object, string } from 'yup';

import { FormContainer, RHFTextField } from '../../form';
import { PATH_AUTH } from '../../routes/paths';
import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';


interface ForgotPasswordFormProps {
    onSubmit: (value: { email: string }, reset: () => void) => void;
}

const validationSchema = object().shape({
    email: string()
        .label('Email')
        .required('Please enter your email address')
        .matches(patterns.email, 'Please enter a valid email address'),
});

function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
    const formContext = useForm({
        resolver: yupResolver(validationSchema),
    });
    const { formState: { errors, isSubmitting }, reset } = formContext;

    const handleSubmitForm = useCallback(
        async (value: { email: string }) => {
            if (onSubmit) {
                await onSubmit(value, reset);
            }
        },
        [onSubmit, reset],
    );

    return (
        <Stack spacing={3}>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
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
                            icon={IconEnum.LockKeyhole}
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
                    Forgot your password?
                </Typography>
                <Typography textAlign="center" color="text.secondary">
                    Enter your email address and we'll send you a verification code to reset your password.
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
                        placeholder="Enter your email"
                        autoComplete="email"
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Send Reset Code
                    </Button>
                </Stack>
            </FormContainer>

            <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
            >
                <Button
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    startIcon={<Icon icon={IconEnum.ArrowLeft} />}
                    variant="text"
                >
                    Back to Sign In
                </Button>
            </Stack>
        </Stack>
    );
}

export default ForgotPasswordForm;
