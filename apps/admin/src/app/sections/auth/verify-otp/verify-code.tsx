
import { styled } from '@mui/material/styles';
import { Box, Button, Link, Container, Typography, Alert, Stack } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { IconButton } from '@mui/material';
import { string, object } from 'yup';
import { LoadingButton } from '@mui/lab';
import Page from '@admin/app/components/page';
import { OtpInputField } from '@admin/app/components';
import { Icon } from '@libs/react-core';


export interface VerifyOtpProps {
  onSubmit: (values: any, action: FormikHelpers<any>) => void;
  onResendOtp?: () => void;
  onBackRegister: () => void;
  email?: string;
}

const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    padding: theme.spacing(12, 0)
}));


const VeryFySchema = object().shape({
    otp: string().label('OTP').required(),
});


export default function VerifyCode({
    email,
    onSubmit,
    onResendOtp,
    onBackRegister
}: VerifyOtpProps) {

    return (

        <RootStyle title="Verify | Minimal UI">
            <Button
                size="small"
                onClick={() => onBackRegister()}
                startIcon={<Icon icon='back-arrow' width={20} height={20} />}
                sx={{ position: 'absolute', top: 0, left: 0, m: 2 }}
            >
        Back to login
            </Button>
            <Container>
                <Box >
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
                            {email}
                        </Typography>
                        <IconButton onClick={() => onBackRegister()}>
                            <Icon icon="edit" />
                        </IconButton>
                    </Box>

                    <Box sx={{ mt: 5, mb: 3 }}>
                        <Formik
                            initialValues={Object.assign({}, { otp: '' })}
                            validationSchema={VeryFySchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, isSubmitting, handleSubmit }) => (
                                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Stack spacing={3}>
                                        {/* {errors?.afterSubmit && (
                      <Alert severity="error">{(errors as any)?.afterSubmit}</Alert>
                    )} */}
                                        <Box>
                                            <Field
                                                name="otp"
                                                component={OtpInputField}
                                            />
                                        </Box>

                                        <LoadingButton
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            loading={isSubmitting}
                                            onClick={() => handleSubmit()}
                                        >
                      Submit
                                        </LoadingButton>
                                    </Stack>

                                    <Typography
                                        pt={2}
                                        variant="body2"
                                        align="center"
                                    >
                    Don't have a code? &nbsp;
                                        <Link
                                            sx={{ cursor: 'pointer' }}
                                            variant="subtitle2"
                                            underline="none"
                                            onClick={onResendOtp}
                                        >
                      Resend code
                                        </Link>
                                    </Typography>
                                </Form>
                            )}
                        </Formik>
                    </Box>

                </Box>
            </Container>

        </RootStyle>
    );
}
