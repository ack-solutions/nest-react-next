import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import { Icon } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { FormContainer, RHFOtpInput } from '../../form';


const VeryFySchema = object().shape({
    otp: string().label('OTP').required(),
});

interface LoginOtpVerificationProps {
    onSubmit: (value: any, setError?: any) => void;
    onResent?: (setError?: any) => void;
    onGoBack?: () => void;
    values?: any;
}

function LoginOtpVerification({
    onGoBack,
    onSubmit,
    onResent,
    values,
}: LoginOtpVerificationProps) {
    const formContext = useForm({
        resolver: yupResolver(VeryFySchema),
    });
    const {
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = formContext;

    const handleSubmit = useCallback(
        async (value) => {
            if (onSubmit) { await onSubmit(value, setError); }
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
            <Typography variant="h4">
                Enter OTP Code
            </Typography>
            <Typography>
                Please enter the OTP code sent to your email.
            </Typography>
            <Typography color="textSecondary">
                {values?.email}
            </Typography>

            <Box
                sx={{
                    mt: 2,
                }}
            >
                <FormContainer
                    formProps={{
                        id: 'login-form',
                    }}
                    formContext={formContext}
                    validationSchema={VeryFySchema}
                    onSuccess={handleSubmit}
                >
                    <Stack
                        spacing={2}
                        justifyContent="center"
                    >
                        {(errors as any)?.afterSubmit ? (
                            <Box
                                pb={2}
                                pt={0}
                            >
                                <Alert severity="error">
                                    {(errors as any)?.afterSubmit.message}
                                </Alert>
                            </Box>
                        ) : null}

                        <Box
                            display="grid"
                            justifyContent="center"
                        >
                            <RHFOtpInput name="otp" />
                        </Box>

                        <Button
                            sx={{ mt: 4 }}
                            fullWidth
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Verify OTP
                        </Button>
                        <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                            mt={2}
                        >
                            <Typography >Didn't receive the email? </Typography>
                            <Button
                                onClick={() => onResent(setError)}
                                sx={{
                                    padding: 0,
                                }}
                            >
                                Click to Resend
                            </Button>
                        </Stack>
                        <Button
                            onClick={onGoBack}
                            sx={{
                                mx: 'auto',
                            }}
                            startIcon={<Icon icon={IconEnum.ArrowLeft} />}
                        >
                            Back to Login
                        </Button>
                    </Stack>
                </FormContainer>
            </Box>
        </Box>
    );
}

export default LoginOtpVerification;
