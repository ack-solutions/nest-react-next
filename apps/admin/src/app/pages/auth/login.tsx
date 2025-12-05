import { NestAuthService } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useAuth } from '../../contexts/auth-context';
import LoginForm from '../../sections/auth/login-form';
import { PATH_AUTH } from '@admin/app/routes/paths';


const nestAuthService = NestAuthService.getInstance<NestAuthService>();

function Login() {
    const { login } = useAuth();

    const handleLogin = useCallback(
        async (values, setError) => {
            await nestAuthService
                .login({
                    providerName: 'email',
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
            <Box>
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
            </Box>
        </Box>
    );
}

export default Login;
