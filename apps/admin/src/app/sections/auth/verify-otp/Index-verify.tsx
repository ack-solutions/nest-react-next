import { Field, Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useState } from 'react'
import { Alert, Box, Button, Container, Stack, Typography, styled } from '@mui/material';
import { object, string } from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthService } from '@mlm/react-core';
import ResetPassword from '../reset-password';
import { OtpInputField } from '@admin/app/components';
import { errorMessage } from '@mlm/utils';


const ContentStyle = styled('div')(({ theme }) => ({
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

	const handleSubmitOtp = useCallback(
		async (values: any, actions: FormikHelpers<any>) => {
			try {
				const request = {
					...values,
					email
				}
				await authService.verifyOtp(request).then((data) => {
					actions.resetForm();
					setIsValidOtp(values?.otp)
				})
			} catch (error) {
				actions.setErrors({ afterSubmit: errorMessage(error) });
			}
			actions.setSubmitting(false);
		},
		[email],
	)

	const handleResendOtp = useCallback(
		async () => {
			try {
				await authService.sendOtp({ email }).then((data) => {
					console.log(data, 111)
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
						</Box>

						<Box sx={{ mt: 5, mb: 3 }}>
							<Formik
								initialValues={Object.assign({}, { otp: '' })}
								validationSchema={VeryFySchema}
								onSubmit={handleSubmitOtp}
							>
								{({ errors, isSubmitting, handleSubmit, values }) => (
									<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
										<Box pb={2} pt={0}>
											{(errors as any).afterSubmit && (
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
											sx={{ mt: 3 }}
											fullWidth
											type="submit"
											variant="contained"
										// onClick={() => handleSubmitOtp()}
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
												// type="submit"
												onClick={() => handleResendOtp()}
											>
												Resend Code
											</Button>
										</Stack>

									</Form>
								)}
							</Formik>
						</Box>
					</ContentStyle>
				</Container>
			) : null}

			{isValidOtp ? (
				<ResetPassword
					onCloseModal={handleCloseModal}
					email={email}
					otp={isValidOtp} />
			) : null}
		</>
	)
}

export default IndexVerify