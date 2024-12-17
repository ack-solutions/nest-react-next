import { AuthService, errorMessage } from '@libs/react-core'
import { Box, Stack, Typography } from '@mui/material'
import { useCallback, useState } from 'react'

import AuthLayout from '../../sections/auth/auth-layout'
import LoginOtpVerification from '../../sections/auth/login-otp-verification'
import RegisterForm from '../../sections/auth/register-form'


const authService = AuthService.getInstance<AuthService>()

const Register = () => {
    const [verifyData, setVerifyData] = useState<any>(null)

    const handleSendOtp = useCallback(
        (value?: any, setError?: any) => {
            value = value ? value : verifyData
            authService.sendRegisterOtp(value).then(({ data }) => {
                setVerifyData(value)
            }).catch((error) => {
                setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
                setVerifyData(null)
            })
        },
        [verifyData],
    )

    const handleRegisterUser = useCallback(
        (values: any, form: any) => {
            const request = {
                otp: Number(values?.otp),
                ...verifyData,
            }

            authService.register(request).then((data) => {
                form.reset();
                setVerifyData(null)
            }).catch((error) => {
                form.setError('afterSubmit', {
                    type: 'manual',
                    message: errorMessage(error),
                });
            })
        },
        [verifyData],
    )

    return (
        <AuthLayout rootTitle={"Register | Next React"} >
            <Box
                sx={{
                    maxWidth: 480,
                    width: '100%',
                    p: 2,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ mb: 5 }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h1"
                            gutterBottom
                        >
                            Register
                        </Typography>
                    </Box>
                </Stack>
                {!verifyData ? (
                    <RegisterForm onSubmit={handleSendOtp} />
                ) : (
                    <LoginOtpVerification
                        onSubmit={handleRegisterUser}
                        onResend={handleSendOtp}
                        onGoBack={() => setVerifyData(null)}
                    />
                )}
            </Box>

        </AuthLayout>
    )
}

export default Register
