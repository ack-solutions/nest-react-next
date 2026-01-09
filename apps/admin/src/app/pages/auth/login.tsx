import { Box, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import LoginForm from '../../sections/auth/login-form';
import MfaMethodSelect from '../../sections/auth/mfa-method-select';
import MfaOtpForm from '../../sections/auth/mfa-otp-form';
import { PATH_AUTH } from '@admin/app/routes/paths';
import { useLoginFlow } from '../../hook';


function Login() {
    const {
        step,
        selectedMfaMethod,
        availableMfaMethods,
        defaultMfaMethod,
        loginCredentials,
        isLoading,
        handleLogin,
        handleMfaMethodSelect,
        handleMfaVerify,
        handleMfaResend,
        handleBackToMethod,
        handleBackToLogin,
        canResendCode,
    } = useLoginFlow();

    // Determine if we should show the "change method" option
    // Only show if there are multiple methods available
    const showChangeMethod = availableMfaMethods.length > 1;

    return (
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
                                Welcome back
                            </Typography>
                            <Typography color="text.secondary">
                                Sign in to your account to continue
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
                        <Typography color="text.secondary">
                            Don't have an account?
                        </Typography>
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
                    isLoading={isLoading}
                />
            )}

            {step === 'mfa-verify' && selectedMfaMethod && (
                <MfaOtpForm
                    method={selectedMfaMethod}
                    onSubmit={handleMfaVerify}
                    onResend={canResendCode() ? handleMfaResend : undefined}
                    onBack={handleBackToLogin}
                    onChangeMethod={showChangeMethod ? handleBackToMethod : undefined}
                    userEmail={loginCredentials?.email}
                    isLoading={isLoading}
                    showChangeMethod={showChangeMethod}
                />
            )}
        </Box>
    );
}

export default Login;
