import { NestAuthService } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Box, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';

import { useAuth } from '../../contexts/auth-context';
import LoginForm from '../../sections/auth/login-form';


const nestAuthService = NestAuthService.getInstance<NestAuthService>();

function Login() {
    const { login } = useAuth();

    const handleLogin = useCallback(
        async (values, setError) => {
            await nestAuthService
                .login({
                    providerId: 'email',
                    credentials: values,
                })
                .then(({ data }) => {
                    login(data?.accessToken);
                }).catch((error) => {
                    setError('afterSubmit', {
                        type: 'manual',
                        message: errorMessage(error),
                    });
                });
        },
        [login],
    );

    return (
        <Box>
            {/* {!verifyData ? ( */}
            <Box>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ mb: 4 }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h4"
                            color="common.white"
                            gutterBottom
                        >
                            Login into your account
                        </Typography>
                        <Typography color="common.white">
                            Welcome back, log into your account
                        </Typography>
                    </Box>
                </Stack>
                <LoginForm onSubmit={handleLogin} />
                {/* <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="center"
                    mt={2}
                >
                    <Typography color="common.white">Don't have an account?</Typography>
                    <Link
                        component={RouterLink}
                        to={PATH_AUTH.register}
                        sx={{
                            textDecoration: 'underline',
                            color: 'common.white',
                        }}
                    >
                        Sign up
                    </Link>
                </Stack> */}
            </Box>
            {/*  ) : (
                <LoginOtpVerification
                    onSubmit={handleLogin}
                    onResent={handleResentOtp}
                    onGoBack={() => setVerifyData(null)}
                    values={verifyData}
                />
            )} */}
        </Box>
    );
}

export default Login;
