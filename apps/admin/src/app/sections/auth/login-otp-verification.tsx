
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React from 'react'
import { Link } from 'react-router-dom'
import { object, string } from 'yup';
import { PATH_AUTH } from '../../routes/paths';
import { OtpInputField } from '@admin/app/components';


const VeryFySchema = object().shape({
  otp: string().label('OTP').required(),
});

interface LoginOtpVerificationProps {
  onSubmit: (value: any, action: FormikHelpers<any>) => void ;
  onResend?: (val?: any) => void,
  onGoBack?: () => void,
}


const LoginOtpVerification = ({
  onGoBack,
  onSubmit,
  onResend,
}: LoginOtpVerificationProps) => {
  return (
    <Box>
      <Typography variant="h1">
        Enter OTP Code
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        Enter 4 - digits code we send you on
      </Typography>

      <Box
        alignItems='center'
        display="flex"
        justifyContent='space-between'
      >
        <Typography
          sx={{ color: 'text.secondary' }}
        >
          {/* {email} */}
        </Typography>
      </Box>

      <Box sx={{ mt: 5, mb: 3 }}>
        <Formik
          initialValues={Object.assign({}, { otp: '' })}
          validationSchema={VeryFySchema}
          onSubmit={onSubmit}
        >
          {({ errors, isSubmitting, handleSubmit, values }) => (
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Box pb={2} pt={0}>
                {(errors as any)?.afterSubmit && (
                  <Alert severity="error">{(errors as any)?.afterSubmit}</Alert>
                )}
              </Box>

              <Box display='grid' justifyContent='center'>
                <Field
                  name="otp"
                  component={OtpInputField}
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
                  onClick={onResend}
                  sx={{ mx: 'auto' }}
                >
                  Resend Code
                </Button>
              </Stack>

            </Form>
          )}
        </Formik>
      </Box >

    </Box>
  )
}

export default LoginOtpVerification