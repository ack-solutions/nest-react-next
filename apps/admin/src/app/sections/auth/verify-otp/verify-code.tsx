
import { OtpInputField } from '@admin/app/components';
import Page from '@admin/app/components/page';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, Icon, RHFOtpInput } from '@libs/react-core';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Link, Container, Typography, Stack, Alert } from '@mui/material';
import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useForm } from 'react-hook-form';
import { string, object } from 'yup';


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


const veryFySchema = object().shape({
    otp: string().label('OTP').required(),
});


export default function VerifyCode({
    email,
    onSubmit,
    onResendOtp,
    onBackRegister
}: VerifyOtpProps) {
    const formContext = useForm({
        resolver: yupResolver(veryFySchema),
    })
    const { formState: { errors, }, setError, reset } = formContext;

    const handleSubmit = useCallback(
        (value: any) => {
            onSubmit && onSubmit(value, setError);
        },
        [onSubmit, setError]
    );
    return (

        <RootStyle title="Verify | Minimal UI">
            <Button
                size="small"
                onClick={() => onBackRegister()}
                startIcon={<Icon
                    icon='back-arrow'
                    width={20}
                    height={20}
                />}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    m: 2
                }}
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

                    <Box
                        sx={{
                            mt: 5,
                            mb: 3
                        }}
                    >
                        {/* <Formik
                            initialValues={Object.assign({}, { otp: '' })}
                            validationSchema={VeryFySchema}
                            onSubmit={onSubmit}
                        >
                            {({ isSubmitting, handleSubmit, errors }) => (
                                <Form
                                    autoComplete="off"
                                    noValidate
                                    onSubmit={handleSubmit}
                                > */}
                        <FormContainer
                            FormProps={{
                                id: "forgot-otp-form"
                            }}
                            formContext={formContext}
                            validationSchema={veryFySchema}
                            onSuccess={onSubmit}
                        >
                            <Stack spacing={3}>
                                {errors?.afterSubmit && (
                                    <Alert severity="error">{(errors as any)?.afterSubmit}</Alert>
                                )}
                                <Box>
                                    <RHFOtpInput
                                        name="otp"
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
                        </FormContainer>
                    </Box>

                </Box>
            </Container>

        </RootStyle>
    );
}
