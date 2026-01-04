import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Link, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { FormContainer, RHFOtpInput } from '../../form';
import { PATH_AUTH } from '@admin/app/routes/paths';
import { Link as RouterLink } from 'react-router-dom';


const VeryFySchema = object().shape({
    otp: string().label('OTP').required(),
});

interface OtpVerificationProps {
    onSubmit: (value: any, setError?: any) => void;
    onResent?: (setError?: any) => void;
    onGoBack?: () => void;
    values?: any;
}

function OtpVerification({
    onGoBack,
    onSubmit,
    onResent,
    values,
}: OtpVerificationProps) {
    const formContext = useForm({
        resolver: yupResolver(VeryFySchema),
    });
    const {
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = formContext;

    const handleSubmit = useCallback(
        async (value) => {
            if (onSubmit) { await onSubmit(value, setError); }
            reset();
        },
        [
            onSubmit,
            reset,
            setError,
        ],
    );

    return (
        <Stack spacing={3}>
            <Box>
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Enter OTP Code
                </Typography>
                <Typography>
                    Please enter the OTP code sent to your email.
                </Typography>
                {values?.email && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {values.email}
                    </Typography>
                )}
            </Box>

            <FormContainer
                formProps={{
                    id: 'otp-verification-form',
                }}
                formContext={formContext}
                validationSchema={VeryFySchema}
                onSuccess={handleSubmit}
            >
                <Stack spacing={2}>
                    {(errors as any)?.afterSubmit ? (
                        <Alert severity="error">
                            {(errors as any)?.afterSubmit.message}
                        </Alert>
                    ) : null}

                    <Box
                        display="flex"
                        justifyContent="center"
                        sx={{ pt: 2 }}
                    >
                        <RHFOtpInput name="otp" />
                    </Box>

                    <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="end"
                    >
                        <Typography color="text.secondary">
                            Didn't receive the email?{' '}
                        </Typography>
                        <Button
                            onClick={() => onResent?.(setError)}
                            sx={{
                                padding: 0,
                                minWidth: 'auto',
                                textTransform: 'none',
                                color: 'primary.main',
                                '&:hover': {
                                    textDecoration: 'underline',
                                    background: 'transparent',
                                },
                            }}
                        >
                            Click to Resend
                        </Button>
                    </Stack>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Verify OTP
                    </Button>

                    {onGoBack && (
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
                    )}
                </Stack>
            </FormContainer>
        </Stack>
    );
}

export default OtpVerification;
