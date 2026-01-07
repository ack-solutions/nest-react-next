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


const validationSchema = object().shape({
    otp: string()
        .label('Code')
        .required('Please enter the verification code')
        .length(6, 'Code must be 6 digits'),
});

interface OtpVerificationProps {
    onSubmit: (value: { otp: string }, setError?: any) => void;
    onResent?: (setError?: any) => void;
    onGoBack?: () => void;
    values?: { email?: string };
}

function OtpVerification({
    onGoBack,
    onSubmit,
    onResent,
    values,
}: OtpVerificationProps) {
    const formContext = useForm({
        resolver: yupResolver(validationSchema),
    });
    const {
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = formContext;

    const handleSubmit = useCallback(
        async (value: { otp: string }) => {
            if (onSubmit) {
                await onSubmit(value, setError);
            }
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
                            icon={IconEnum.Mail}
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
                    Check your email
                </Typography>
                <Typography textAlign="center" color="text.secondary">
                    We sent a verification code to your email. Enter the code below to continue.
                </Typography>
                {values?.email && (
                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ mt: 1, fontWeight: 600 }}
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
                validationSchema={validationSchema}
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
                        <RHFOtpInput name="otp" numInputs={6} />
                    </Box>

                    <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                    >
                        <Typography color="text.secondary">
                            Didn't receive the code?
                        </Typography>
                        <Button
                            onClick={() => onResent?.(setError)}
                            disabled={isSubmitting}
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
                            Resend
                        </Button>
                    </Stack>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Verify Code
                    </Button>

                    {onGoBack && (
                        <Stack
                            direction="row"
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
                    )}
                </Stack>
            </FormContainer>
        </Stack>
    );
}

export default OtpVerification;
