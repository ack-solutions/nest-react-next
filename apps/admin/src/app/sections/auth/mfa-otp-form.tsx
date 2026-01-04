import { yupResolver } from '@hookform/resolvers/yup';
import { errorMessage } from '@libs/utils';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { object, string } from 'yup';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { FormContainer, RHFOtpInput } from '../../form';

import { MfaMethod } from './mfa-method-select';


export interface MfaOtpFormValues {
    otp: string;
}

export interface MfaOtpFormProps {
    method: MfaMethod;
    onSubmit: (
        values: MfaOtpFormValues,
        setError: UseFormSetError<MfaOtpFormValues>
    ) => Promise<void>;
    onResend?: (setError: UseFormSetError<MfaOtpFormValues>) => Promise<void>;
    onBack?: () => void;
    userEmail?: string;
    userPhone?: string;
    isLoading?: boolean;
}

const validationSchema = object().shape({
    otp: string()
        .label('OTP')
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits'),
}) as any;

const methodLabels: Record<MfaMethod, string> = {
    email: 'email',
    phone: 'phone',
    totp: 'authenticator app',
};

export default function MfaOtpForm({
    method,
    onSubmit,
    onResend,
    onBack,
    userEmail,
    userPhone,
    isLoading = false,
}: MfaOtpFormProps) {
    const formContext = useForm<MfaOtpFormValues>({
        defaultValues: {
            otp: '',
        },
        resolver: yupResolver(validationSchema) as any,
    });

    const {
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = formContext;

    const handleSubmit = useCallback(
        async (values: MfaOtpFormValues) => {
            try {
                await onSubmit(values, setError);
            } catch (error) {
                setError('root', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [onSubmit, setError],
    );

    const handleResend = useCallback(
        async () => {
            try {
                if (onResend) {
                    await onResend(setError);
                    reset();
                }
            } catch (error) {
                setError('root', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [onResend, setError, reset],
    );

    const getMethodDisplay = () => {
        if (method === 'email' && userEmail) {
            return userEmail;
        }
        if (method === 'phone' && userPhone) {
            return userPhone;
        }
        return methodLabels[method];
    };

    return (
        <Box>
            <Stack
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Enter verification code
                </Typography>
                <Typography>
                    Please enter the 6-digit code sent to your {methodLabels[method]}
                </Typography>
                {(userEmail || userPhone) && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {getMethodDisplay()}
                    </Typography>
                )}
            </Stack>

            <FormContainer
                formProps={{
                    id: 'mfa-otp-form',
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmit}
            >
                <Stack spacing={3}>
                    {errors.root ? (
                        <Alert severity="error">
                            {errors.root.message}
                        </Alert>
                    ) : null}

                    <Box
                        display="flex"
                        justifyContent="center"
                        sx={{ pt: 2 }}
                    >
                        <RHFOtpInput
                            name="otp"
                            numInputs={6}
                        />
                    </Box>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                    >
                        Verify
                    </Button>

                    {onResend && (
                        <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                        >
                            <Typography color="text.secondary">
                                Didn't receive the code?
                            </Typography>
                            <Button
                                onClick={handleResend}
                                disabled={isSubmitting || isLoading}
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
                    )}

                    {onBack && (
                        <Button
                            onClick={onBack}
                            startIcon={<Icon icon={IconEnum.ArrowLeft} />}
                            sx={{
                                mx: 'auto',
                            }}
                        >
                            Back
                        </Button>
                    )}
                </Stack>
            </FormContainer>
        </Box>
    );
}
