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
            <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create your account
                </Typography>
                <Typography color="text.secondary">
                    Get started with your free account today
                </Typography>
            </Stack>

            <RegisterForm onSubmit={handleRegister} />

            <Stack
                direction="row"
                spacing={0.5}
                justifyContent="center"
                mt={2}
            >
                <Typography color="text.secondary">
                    Already have an account?
                </Typography>
                <Link
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    sx={{
                        textDecoration: 'underline',
                        color: 'primary.main',
                    }}
                >
                    Sign in
                </Link>
            </Stack>
        </Box>
    );
}

export default Register;
