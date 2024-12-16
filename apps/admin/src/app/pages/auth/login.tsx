import { AuthService, errorMessage, useAuth } from '@libs/react-core'
import { ILoginSendOtpInput } from '@libs/types'
import { Box, Stack, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'

import AuthLayout from '../../sections/auth/auth-layout'
import LoginForm from '../../sections/auth/login-form'
import LoginOtpVerification from '../../sections/auth/login-otp-verification'


const authService = AuthService.getInstance<AuthService>()
const Login = () => {
    const [verifyData, setVerifyData] = useState<any>(null)
    const { login } = useAuth()

    const handleSendOtp = useCallback(
        (value?: ILoginSendOtpInput, action?: any) => {
            value = value ? value : verifyData
            authService.sendLoginOtp(value).then(() => {
                setVerifyData(value)
            }).catch((error) => {
                action?.setErrors({ afterSubmit: errorMessage(error) });
                setVerifyData(null)
            }).finally(() => {
                action?.setSubmitting(false)
            })
        },
        [verifyData],
    )

    const handleLogin = useCallback(
        async (values: any, action: any) => {
            const request = {
                otp: Number(values?.otp),
                ...verifyData,
            }
            authService.login(request).then((data) => {
                login(data?.accessToken, data?.user)
                action.resetForm();
                setVerifyData(null)
            }).catch((error) => {
                action.setErrors({ afterSubmit: errorMessage(error) });
            }).finally(() => {
                action?.setSubmitting(false)
            })
        },
        [login, verifyData],
    )

    return (
        <AuthLayout rootTitle={"Login | React Next"} >
            {!verifyData ? (
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
                                Login
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                Welcome back, log into your account
                            </Typography>
                        </Box>
                    </Stack>
                    <LoginForm onSubmit={handleSendOtp} />
                </Box>
            ) : (
                <LoginOtpVerification
                    onSubmit={handleLogin}
                    onResend={handleSendOtp}
                    onGoBack={() => setVerifyData(null)}
                />
            )}
        </AuthLayout>
    )
}

export default Login
