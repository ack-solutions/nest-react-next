import React, { useCallback, useState } from 'react'
import AuthLayout from '../../sections/auth/auth-layout'
import { Box, Stack, Typography } from '@mui/material'
import RegisterForm from '../../sections/auth/RegisterForm'
import LoginOtpVerification from '../../sections/auth/login-otp-verification'
import { AuthService } from '@mlm/react-core'
import { errorMessage } from '@mlm/utils'

const authService = AuthService.getInstance<AuthService>()
const Register = () => {
    const [verifyData, setVerifyData] = useState<any>(null)

    const handleSendOtp = useCallback(
        (value?: any, action?: any) => {
            value = value ? value : verifyData
            authService.sendRegisterOtp(value).then(({ data }) => {
                console.log(654564)
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

    const handleRegisterUser = useCallback(
        (values: any, action: any) => {
            const request = {
                otp: Number(values?.otp),
                ...verifyData,
            }
            console.log(request);
            
            authService.register(request).then(({ data }) => {
                action.resetForm();
                setVerifyData(null)
            }).catch((error) => {
                action.setErrors({ afterSubmit: errorMessage(error) });
            }).finally(() => {
                action?.setSubmitting(false)
            })
        },
        [verifyData],
    )

    return (
        <AuthLayout rootTitle={"Register | Next React"} src={''} >
            <Box
                sx={{
                    maxWidth: 480,
                    width: '100%',
                    p: 2,
                }}
            >
                <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h1" gutterBottom>
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