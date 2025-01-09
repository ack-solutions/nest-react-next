import { yupResolver } from '@hookform/resolvers/yup';
import { AuthService, FormContainer, RHFOtpInput } from '@libs/react-core';
import { errorMessage } from '@libs/react-core';
import { Alert, Box, Button, Container, Stack, Typography, styled } from '@mui/material';
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';

import ResetPassword from '../reset-password';


const ContentStyle = styled('div')(() => ({
    maxWidth: 530,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
}));

export interface IndexVerifyProps {
    email?: string;
}

const VeryFySchema = object().shape({
    otp: string().label('OTP').required(),
});

const authService = AuthService.getInstance<AuthService>();

const IndexVerify = ({
    email,
}: IndexVerifyProps) => {
    const navigate = useNavigate();
    const [isValidOtp, setIsValidOtp] = useState(null)
    const [resendOtpSuccess, setResendOtpSuccess] = useState<string | null>(null);
    const formContext = useForm({
        resolver: yupResolver(VeryFySchema),
    })
    const { formState: { errors, }, setError, reset } = formContext;

    const handleSubmitOtp = useCallback(
        async (values: any) => {
            try {
                const request = {
                    ...values,
                    email
                }
                await authService.verifyOtp(request).then(() => {
                    reset()
                    setIsValidOtp(values?.otp)
                })
            } catch (error) {
                setError('otp', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            }
        },
        [email, reset, setError],
    )

    const handleResendOtp = useCallback(
        async () => {
            try {
                await authService.sendOtp({ email }).then(() => {
                    setResendOtpSuccess('OTP resend successfully!'); // Set success message when OTP is resent
                    setTimeout(() => setResendOtpSuccess(null), 3000);
                })
            } catch (error) {
                console.log(error)
            }
        },
        [email],
    )

    const handleCloseModal = useCallback(
        () => {
            setIsValidOtp(null)
        },
        [],
    )

    return (
        <>
            {!isValidOtp ? (
                <Container maxWidth="sm">
                    <ContentStyle>
                        <Typography variant="h2">
                            Enter OTP Code
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Enter 6 - digits code we send you on
                        </Typography>

                        <Box
                            alignItems='center'
                            display="flex"
                            justifyContent='space-between'
                        >
                            <Typography
                                sx={{ color: 'text.secondary' }}
                            >
                                {email}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                mt: 5,
                                mb: 3
                            }}
                        >
                            <FormContainer
                                FormProps={{
                                    id: "forgot-otp-form"
                                }}
                                formContext={formContext}
                                validationSchema={VeryFySchema}
                                onSuccess={handleSubmitOtp}
                            >

                                {(errors as any).otp && (
                                    <Alert
                                        severity="error"
                                        sx={{ mb: 2 }}
                                    >
                                        {(errors as any)?.otp?.message}
                                    </Alert>
                                )}
                                {!!resendOtpSuccess && (
                                    <Alert
                                        severity="success"
                                        sx={{ mb: 2 }}
                                    >
                                        {resendOtpSuccess}
                                    </Alert>
                                )}

                                <Box
                                    display='grid'
                                    justifyContent='center'
                                >
                                    <RHFOtpInput
                                        name="otp"
                                    />
                                </Box>
                                <Button
                                    sx={{ mt: 3 }}
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
                                        onClick={() => navigate(-1)}
                                        sx={{ mt: 1 }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => handleResendOtp()}
                                    >
                                        Resend Code
                                    </Button>
                                </Stack>
                            </FormContainer>
                        </Box>
                    </ContentStyle>
                </Container>
            ) : null}

            {isValidOtp ? (
                <ResetPassword
                    onCloseModal={handleCloseModal}
                    email={email}
                    otp={isValidOtp}
                />
            ) : null}
        </>
    )
}

export default IndexVerify
