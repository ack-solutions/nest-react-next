import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import { PATH_AUTH } from '../../../routes/paths';
import { FormikHelpers } from 'formik';
import { AuthService } from '@libs/react-core';
import AuthLayout from '@admin/app/sections/auth/auth-layout';
import ForgetPasswordForm from './forget-password-form';
import IndexVerify from '@admin/app/sections/auth/verify-otp/Index-verify';
import { errorMessage } from '@libs/utils';
import Page from '@admin/app/components/page';

const ContentStyle = styled('div')(() => ({
  maxWidth: 530,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
}));


const authService = AuthService.getInstance<AuthService>()

export default function ForgetPassword() {
  const [resetForm, setResetForm] = useState(false);
  const [email, setEmail] = useState<any>(null);

  const handleSendOtp = useCallback(
    async (values: any, actions: FormikHelpers<any>) => {
      try {
        setEmail(values.email)
        await authService.sendOtp(values).then(() => {
          setResetForm(true);
          actions.resetForm();
        })
      } catch (error) {
        actions.setErrors({ afterSubmit: errorMessage(error) });
      }
      actions.setSubmitting(false);
    },
    [],
  )

  return (
    <Page title='Forgot Password'>
      <Container maxWidth="sm">
        <ContentStyle>
          {!resetForm ? (
            <Box sx={{
              maxWidth: 480,
              width: '100%',
              p: 2,
            }}>
              <Typography variant="h2">
                Forget Password
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 2 }}>
                Enter you email to forget your password, we will send you the OTP
              </Typography>

              <ForgetPasswordForm
                onSubmit={handleSendOtp}
              />

              <Button
                fullWidth
                size="large"
                component={RouterLink}
                to={PATH_AUTH.login}
                sx={{ mt: 1 }}
              >
                Back
              </Button>
            </Box>
          ) : (
            <IndexVerify email={email} />
          )}
        </ContentStyle>
      </Container>

    </Page>

  );
}
