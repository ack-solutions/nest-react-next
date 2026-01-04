import { errorMessage } from '@libs/utils';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useAuth } from '@libs/react-shared';
import LoginForm from '../../sections/auth/login-form';
import MfaMethodSelect, { MfaMethod } from '../../sections/auth/mfa-method-select';
import MfaOtpForm from '../../sections/auth/mfa-otp-form';
import { PATH_AUTH } from '@admin/app/routes/paths';


type LoginStep = 'login' | 'mfa-method' | 'mfa-otp';

// Map API MFA method names to MfaMethod type
const mapMfaMethod = (method: string): MfaMethod => {
    switch (method?.toLowerCase()) {
        case 'email':
            return 'email';
        case 'sms':
        case 'phone':
            return 'phone';
        case 'totp':
            return 'totp';
        default:
            return 'email';
    }
};

// Map MfaMethod back to API format
const mapToApiMfaMethod = (method: MfaMethod): 'email' | 'phone' => {
    switch (method) {
        case 'email':
            return 'email';
        case 'phone':
            return 'phone';
        case 'totp':
            // TOTP doesn't need to send code, but use email as fallback for API
            return 'email';
        default:
            return 'email';
    }
};

function Login() {
    const { login, client } = useAuth();
    const [step, setStep] = useState<LoginStep>('login');
    const [selectedMfaMethod, setSelectedMfaMethod] = useState<MfaMethod | null>(null);
    const [availableMfaMethods, setAvailableMfaMethods] = useState<MfaMethod[]>([]);
    const [defaultMfaMethod, setDefaultMfaMethod] = useState<MfaMethod | null>(null);
    const [loginCredentials, setLoginCredentials] = useState<{ email: string; password: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = useCallback(
        async (values: { email: string; password: string }, setError: any) => {
            setIsLoading(true);
            try {
                const response = await login({
                    providerName: 'email',
                    credentials: values,
                });

                // Check if MFA is required
                if (response?.isRequiresMfa) {
                    setLoginCredentials(values);

                    // Get available MFA methods from response
                    const methods = (response.mfaMethods || []).map((m: string) => mapMfaMethod(m));
                    setAvailableMfaMethods(methods);

                    // Set default method if available
                    if (response.defaultMfaMethod) {
                        setDefaultMfaMethod(mapMfaMethod(response.defaultMfaMethod as string));
                    }

                    // If only one method available, skip selection
                    if (methods.length === 1) {
                        setSelectedMfaMethod(methods[0]);
                        setStep('mfa-otp');
                    } else {
                        setStep('mfa-method');
                    }
                }
                // If no MFA and we got tokens, login is complete (handled by auth context)
            } catch (error: any) {
                // Check if error response indicates MFA is required
                const errorData = error?.response?.data || error?.data;
                if (errorData?.isRequiresMfa) {
                    setLoginCredentials(values);

                    const methods = (errorData.mfaMethods || []).map((m: string) => mapMfaMethod(m));
                    setAvailableMfaMethods(methods);

                    if (errorData.defaultMfaMethod) {
                        setDefaultMfaMethod(mapMfaMethod(errorData.defaultMfaMethod));
                    }

                    if (methods.length === 1) {
                        setSelectedMfaMethod(methods[0]);
                        setStep('mfa-otp');
                    } else if (methods.length > 1) {
                        setStep('mfa-method');
                    } else {
                        // No methods specified, go to method selection
                        setStep('mfa-method');
                    }
                } else {
                    setError('afterSubmit', {
                        type: 'manual',
                        message: errorMessage(error),
                    });
                }
            } finally {
                setIsLoading(false);
            }
        },
        [login],
    );

    const handleMfaMethodSelect = useCallback(
        async (method: MfaMethod) => {
            setSelectedMfaMethod(method);
            setIsLoading(true);
            try {
                // For TOTP, skip sending code - user has their authenticator app
                if (method !== 'totp') {
                    // Send 2FA code via selected method
                    await client.send2fa(mapToApiMfaMethod(method));
                }
                setStep('mfa-otp');
            } catch (error) {
                // Even if send fails, proceed to OTP form
                // The backend might have already sent the code
                setStep('mfa-otp');
            } finally {
                setIsLoading(false);
            }
        },
        [client],
    );

    const handleMfaOtpSubmit = useCallback(
        async (values: { otp: string }, setError: any) => {
            setIsLoading(true);
            try {
                // Verify 2FA OTP
                await client.verify2fa({
                    otp: values.otp,
                    method: selectedMfaMethod as any,
                });
                // Success - the auth context will handle the authenticated state
            } catch (error) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            } finally {
                setIsLoading(false);
            }
        },
        [client, selectedMfaMethod],
    );

    const handleMfaResend = useCallback(
        async (setError: any) => {
            setIsLoading(true);
            try {
                if (selectedMfaMethod && selectedMfaMethod !== 'totp') {
                    await client.send2fa(mapToApiMfaMethod(selectedMfaMethod));
                }
            } catch (error) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            } finally {
                setIsLoading(false);
            }
        },
        [client, selectedMfaMethod],
    );

    const handleBackToMethod = useCallback(() => {
        setStep('mfa-method');
    }, []);

    const handleBackToLogin = useCallback(() => {
        setStep('login');
        setSelectedMfaMethod(null);
        setLoginCredentials(null);
        setAvailableMfaMethods([]);
        setDefaultMfaMethod(null);
    }, []);

    return (
        <Box>
            <Box>
                {step === 'login' && (
                    <>
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{ mb: 4 }}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                >
                                    Login into your account
                                </Typography>
                                <Typography>
                                    Welcome back, log into your account
                                </Typography>
                            </Box>
                        </Stack>
                        <LoginForm onSubmit={handleLogin} />
                        <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                            mt={2}
                        >
                            <Typography color="text.secondary">Don't have an account?</Typography>
                            <Link
                                component={RouterLink}
                                to={PATH_AUTH.register}
                                sx={{
                                    textDecoration: 'underline',
                                    color: 'primary.main',
                                }}
                            >
                                Sign up
                            </Link>
                        </Stack>
                    </>
                )}

                {step === 'mfa-method' && (
                    <MfaMethodSelect
                        onSelect={handleMfaMethodSelect}
                        userEmail={loginCredentials?.email}
                        availableMethods={availableMfaMethods}
                        defaultMethod={defaultMfaMethod}
                        onBack={handleBackToLogin}
                    />
                )}

                {step === 'mfa-otp' && selectedMfaMethod && (
                    <MfaOtpForm
                        method={selectedMfaMethod}
                        onSubmit={handleMfaOtpSubmit}
                        onResend={handleMfaResend}
                        onBack={availableMfaMethods.length > 1 ? handleBackToMethod : handleBackToLogin}
                        userEmail={loginCredentials?.email}
                        isLoading={isLoading}
                    />
                )}
            </Box>
        </Box>
    );
}

export default Login;
