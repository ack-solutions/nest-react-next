import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFOtpInput } from '@libs/react-core';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { object, string } from 'yup';

import { PATH_AUTH } from '../../routes/paths';


const VeryFySchema = object().shape({
    otp: string().label('OTP').required(),
});

interface LoginOtpVerificationProps {
    onSubmit: (value: any, form?: any) => void;
    onResend?: (val?: any, form?: any) => void,
    onGoBack?: () => void,
}


const LoginOtpVerification = ({
    onGoBack,
    onSubmit,
    onResend,
}: LoginOtpVerificationProps) => {
    const formContext = useForm({
        resolver: yupResolver(VeryFySchema),
    });
    const { formState: { errors }, setError, reset } = formContext;
    const handleSubmit = useCallback(
        (value) => {
            onSubmit && onSubmit(value, {
                setError,
                reset,
            });
            reset();
        },
        [
            onSubmit,
            reset,
            setError,
        ],
    );
    return (
        <Box>
            <Typography variant="h1">
                Enter OTP Code
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
                Enter 6 - digits code we send you on
            </Typography>

            <Box
                sx={{
                    mt: 5,
                    mb: 3,
                }}
            >
                <FormContainer
                    FormProps={{
                        id: 'login-otp-form',
                    }}
                    formContext={formContext}
                    validationSchema={VeryFySchema}
                    onSuccess={handleSubmit}
                >
                    <Box
                        pb={2}
                        pt={0}
                    >
                        {(errors as any)?.afterSubmit && (
                            <Alert severity="error">{(errors as any)?.afterSubmit.message}</Alert>
                        )}
                    </Box>

                    <Box
                        display='grid'
                        justifyContent='center'
                    >
                        <RHFOtpInput
                            name="otp"
                        />
                    </Box>

                    <Button
                        sx={{ mt: 6 }}
                        fullWidth
                        type="submit"
                        variant="contained"
                    >
                        Submit
                    </Button>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                    >
                        <Button
                            size="large"
                            component={Link}
                            to={PATH_AUTH.login}
                            sx={{ mt: 1 }}
                            onClick={onGoBack}
                        >
                            Back
                        </Button>
                        <Button
                            type="submit"
                            onClick={() => onResend()}
                            sx={{ mx: 'auto' }}
                        >
                            Resend Code
                        </Button>
                    </Stack>
                </FormContainer>

            </Box >
        </Box>
    );
};

export default LoginOtpVerification;
