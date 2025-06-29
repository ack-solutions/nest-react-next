import { NestAuthService } from '@libs/react-shared';
import { errorMessage } from '@libs/utils';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useAuth } from '../../contexts';
import { PATH_AUTH } from '../../routes/paths';
import RegisterForm from '../../sections/auth/register-form';


const nestAuthService = NestAuthService.getInstance<NestAuthService>();

function Register() {
    const { login } = useAuth();

    const handleRegister = useCallback(
        async (values: any, setError: any) => {
            const request = {
                ...values,
            };
            await nestAuthService.register(request).then((data) => {
                login(data?.accessToken, data?.user);
                // setVerifyData(null);
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
            <Typography
                variant="h4"
                gutterBottom
                sx={{ mb: 4 }}
            >
                Create new account.
            </Typography>

            <RegisterForm onSubmit={handleRegister} />

            <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
                mt={2}
            >
                <Typography sx={{ color: 'text.secondary' }}>Already A Member?</Typography>
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
        </Box>
    );
}

export default Register;
