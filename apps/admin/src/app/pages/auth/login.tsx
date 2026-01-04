import { NestAuthService } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useAuth } from '../../contexts/auth-context';
import LoginForm from '../../sections/auth/login-form';
import MfaMethodSelect, { MfaMethod } from '../../sections/auth/mfa-method-select';
import MfaOtpForm from '../../sections/auth/mfa-otp-form';
import { PATH_AUTH } from '@admin/app/routes/paths';


const nestAuthService = NestAuthService.getInstance<NestAuthService>();

type LoginStep = 'login' | 'mfa-method' | 'mfa-otp';

function Login() {
    const { login } = useAuth();
    const [step, setStep] = useState<LoginStep>('login');
    const [selectedMfaMethod, setSelectedMfaMethod] = useState<MfaMethod | null>(null);
    const [loginCredentials, setLoginCredentials] = useState<{ email: string; password: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = useCallback(
        (values, setError) => {
            setIsLoading(true);
            nestAuthService
                .login({
                    providerName: 'email',
                    credentials: values,
                })
                .then(({ data }) => {
                    // Check if MFA is required
                    login(data.accessToken);
                    if (data?.isRequiresMfa || data?.requiresMfa || data?.otpSecurity) {
                        setLoginCredentials(values);
                        setStep('mfa-method');
                    } else {
                        setError('afterSubmit', {
                            type: 'manual',
                            message: 'Invalid response from server',
                        });
                    }
                })
                .catch((error: any) => {
                    // Check if error indicates MFA is required
                    if (error?.response?.data?.isRequiresMfa || error?.response?.data?.requiresMfa) {
                        setLoginCredentials(values);
                        setStep('mfa-method');
                    } else {
                        setError('afterSubmit', {
                            type: 'manual',
                            message: errorMessage(error),
                        });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [login],
    );

    const handleMfaMethodSelect = useCallback(
        async (method: MfaMethod) => {
            setSelectedMfaMethod(method);
            setIsLoading(true);
            try {
                // Send MFA method selection to backend
                // This might trigger sending OTP via selected method
                await nestAuthService.login({
                    providerName: 'email',
                    credentials: loginCredentials,
                    mfaMethod: method,
                });
                setStep('mfa-otp');
            } catch (error) {
                // If error, still proceed to OTP form
                // The backend might have already sent the OTP
                setStep('mfa-otp');
            } finally {
                setIsLoading(false);
            }
        },
        [loginCredentials],
    );

    const handleMfaOtpSubmit = useCallback(
        async (values, setError) => {
            setIsLoading(true);
            try {
                const response = await nestAuthService.login({
                    providerName: 'email',
                    credentials: loginCredentials,
                    mfaMethod: selectedMfaMethod,
                    otp: values.otp,
                });

                const { data } = response;
                if (data?.accessToken) {
                    await login(data.accessToken);
                } else {
                    setError('afterSubmit', {
                        type: 'manual',
                        message: 'Invalid OTP code',
                    });
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
        [login, loginCredentials, selectedMfaMethod],
    );

    const handleMfaResend = useCallback(
        async (setError) => {
            setIsLoading(true);
            try {
                // Resend OTP with selected method
                await nestAuthService.login({
                    providerName: 'email',
                    credentials: loginCredentials,
                    mfaMethod: selectedMfaMethod,
                    resend: true,
                });
            } catch (error) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            } finally {
                setIsLoading(false);
            }
        },
        [loginCredentials, selectedMfaMethod],
    );

    const handleBackToMethod = useCallback(() => {
        setStep('mfa-method');
    }, []);

    const handleBackToLogin = useCallback(() => {
        setStep('login');
        setSelectedMfaMethod(null);
        setLoginCredentials(null);
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
                    />
                )}

                {step === 'mfa-otp' && selectedMfaMethod && (
                    <MfaOtpForm
                        method={selectedMfaMethod}
                        onSubmit={handleMfaOtpSubmit}
                        onResend={handleMfaResend}
                        onBack={handleBackToMethod}
                        userEmail={loginCredentials?.email}
                        isLoading={isLoading}
                    />
                )}
            </Box>
        </Box>
    );
}

export default Login;
