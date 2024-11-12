import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { FormikHelpers } from 'formik';
import ResetPasswordForm from './reset-password-form';
import SuccessDialog from './success-dialog';
import { AuthService } from '@mlm/react-core';
import Page from '@admin/app/components/page';
import { errorMessage } from '@mlm/utils';
export interface ResetPasswordProps {
	onCloseModal?: () => void;
	email?: string;
	otp?: string;
}

const RootStyle = styled(Page)(({ theme }) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex',
	},
}));

const ContentStyle = styled('div')(({ theme }) => ({
	maxWidth: 530,
	margin: 'auto',
	display: 'flex',
	minHeight: '100vh',
	flexDirection: 'column',
	justifyContent: 'center',
}));

const authService = AuthService.getInstance<AuthService>();

const ResetPassword = ({
	onCloseModal,
	email,
	otp,
}: ResetPasswordProps) => {
	const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

	const handleResetPassword = useCallback(
    async (values:any, actions: FormikHelpers<any>) => {
      try {
        const request = {
          ...values,
          email,
          otp
        }
        await authService.resetPassword(request).then((data) => {
          actions.resetForm();
					setIsSuccessDialogOpen(true);
        })
      } catch (error) {
        actions.setErrors({ afterSubmit: errorMessage(error) });
      }

      actions.setSubmitting(false);
    },
    [email, otp],
  )

	const handleSuccessDialogClose = () => {
		setIsSuccessDialogOpen(false);
	};

	return (
		<RootStyle title="Reset Password | Minimal UI">
			<Container maxWidth="sm">
					<ContentStyle>
						<Box >
							<Typography variant="h2" >
								Reset Password
							</Typography>
							<Typography sx={{ color: 'text.secondary', mb: 5 }}>
								Enter your password to access the app next time.
							</Typography>
							<ResetPasswordForm onSubmit={handleResetPassword} />
						</Box>

					</ContentStyle>
			</Container>
			{isSuccessDialogOpen ? (
				<SuccessDialog onClose={handleSuccessDialogClose} />
			):null}
		</RootStyle>
	);
}

export default ResetPassword;