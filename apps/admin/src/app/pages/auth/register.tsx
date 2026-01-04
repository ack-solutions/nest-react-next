import { errorMessage } from '@libs/utils';
import { Box, Link, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { PATH_AUTH } from '../../routes/paths';
import RegisterForm from '../../sections/auth/register-form';
import { useAuth } from '@libs/react-shared';


function Register() {
    const { signup } = useAuth();

    const handleRegister = useCallback(
        async (values: any, setError: any) => {
            try {
                await signup({
                    email: values.email,
                    password: values.password,
                    ...values,
                });
                // Success - the auth context handles the authenticated state
            } catch (error) {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [signup],
    );

    return (
        <Box>
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
