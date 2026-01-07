import { yupResolver } from '@hookform/resolvers/yup';
import { errorMessage } from '@libs/utils';
import { Alert, Box, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useForm, UseFormSetError } from 'react-hook-form';
import { object, string } from 'yup';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { FormContainer, RHFOtpInput } from '../../form';

import { MfaMethod } from './mfa-method-select';


export interface MfaOtpFormValues {
    otp: string;
    trustDevice?: boolean;
}

export interface MfaOtpFormProps {
    method: MfaMethod;
    onSubmit: (
        values: MfaOtpFormValues,
        setError: UseFormSetError<MfaOtpFormValues>
    ) => Promise<void>;
    onResend?: (setError: UseFormSetError<MfaOtpFormValues>) => Promise<void>;
    onBack?: () => void;
    onChangeMethod?: () => void;
    userEmail?: string;
    userPhone?: string;
    isLoading?: boolean;
    showChangeMethod?: boolean;
    showTrustDevice?: boolean;
}

const validationSchema = object().shape({
    otp: string()
        .label('OTP')
        .required('Please enter the verification code')
        .length(6, 'Code must be 6 digits'),
}) as any;

const methodConfig: Record<MfaMethod, { label: string; description: string; icon: IconEnum }> = {
    email: {
        label: 'Email',
        description: 'We sent a verification code to your email',
        icon: IconEnum.Mail,
    },
    phone: {
        label: 'Phone',
        description: 'We sent a verification code to your phone',
        icon: IconEnum.Phone,
    },
    totp: {
        label: 'Authenticator App',
        description: 'Enter the code from your authenticator app',
        icon: IconEnum.Shield,
    },
};

export default function MfaOtpForm({
    method,
    onSubmit,
    onResend,
    onBack,
    onChangeMethod,
    userEmail,
    userPhone,
    isLoading = false,
    showChangeMethod = false,
    showTrustDevice = true,
}: MfaOtpFormProps) {
    const [trustDevice, setTrustDevice] = useState(false);

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

    // TOTP codes come from authenticator apps, no resend available
    const canResend = method !== 'totp';

    const handleSubmit = useCallback(
        async (values: MfaOtpFormValues) => {
            try {
                // Include trustDevice in the values passed to onSubmit
                await onSubmit({ ...values, trustDevice }, setError);
            } catch (error) {
                setError('root', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [onSubmit, setError, trustDevice],
    );

    const handleResend = useCallback(
        async () => {
            try {
                if (onResend && canResend) {
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
        [onResend, setError, reset, canResend],
    );

    const getMethodDisplay = () => {
        if (method === 'email' && userEmail) {
            return userEmail;
        }
        if (method === 'phone' && userPhone) {
            return userPhone;
        }
        return null;
    };

    const config = methodConfig[method];
    const displayValue = getMethodDisplay();

    return (
        <Box>
            <Stack
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'primary.lighter',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            color='primary'
                            icon={config.icon}
                            width={32}
                            height={32}
                        />
                    </Box>
                </Box>

                <Typography
                    variant="h4"
                    textAlign="center"
                >
                    Enter verification code
                </Typography>

                <Typography textAlign="center" color="text.secondary">
                    {config.description}
                </Typography>

                {displayValue && (
                    <Typography
                        variant="subtitle2"
                        textAlign="center"
                    >
                        {displayValue}
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

                    {/* Remember this device checkbox */}
                    {showTrustDevice && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={trustDevice}
                                    onChange={(e) => setTrustDevice(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Typography variant="body2" color="text.secondary">
                                    Remember this device
                                </Typography>
                            }
                            sx={{ justifyContent: 'center', mx: 'auto' }}
                        />
                    )}

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        loading={isSubmitting || isLoading}
                    >
                        Verify
                    </Button>

                    {/* Only show resend option for email/phone, not for TOTP */}
                    {canResend && onResend && (
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

                    {/* Show helpful message for TOTP */}
                    {method === 'totp' && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                        >
                            Open your authenticator app (like Google Authenticator or Authy) to get the code.
                        </Typography>
                    )}

                    {/* Navigation options */}
                    <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={2}
                    >
                        {showChangeMethod && onChangeMethod && (
                            <Button
                                onClick={onChangeMethod}
                                variant="text"
                                size="small"
                            >
                                Try another method
                            </Button>
                        )}

                        {onBack && (
                            <Button
                                onClick={onBack}
                                startIcon={<Icon icon={IconEnum.ArrowLeft} />}
                                variant="text"
                                size="small"
                            >
                                Back
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </FormContainer>
        </Box>
    );
}
