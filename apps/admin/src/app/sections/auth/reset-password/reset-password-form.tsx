import { TextField } from '@admin/app/components';
import { Icon, useBoolean } from '@libs/react-core';
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack, useTheme } from '@mui/material';
import { Field, Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';

export interface ResetPasswordFormProps {
  onSubmit: (values: any, action: FormikHelpers<any>) => void;
  values?: any;
}

const defaultValues = {
  password: '',
  confirmPassword: '',
}

const RegisterSchema = object().shape({
  password: string().label('New Password').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
  ).required(),
  confirmPassword: string().label('Confirm New Password')
    .oneOf([ref('password'), ''], 'Passwords must match').required(),
});

const ResetPasswordForm = ({
  onSubmit,
  values: initialValues,
}: ResetPasswordFormProps) => {
  const showPassword = useBoolean()
  const confirmShowPassword = useBoolean()
  const theme = useTheme()

  return (
    <Formik
      initialValues={Object.assign({}, defaultValues, initialValues)}
      onSubmit={onSubmit}
      validationSchema={RegisterSchema}
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Stack spacing={3}>
          <Field
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            name='password'
            component={TextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => showPassword.onToggle()} edge="end">
                    <Icon
                      icon={showPassword.value ? 'eye' : 'eye-slash'}
                      color={theme.palette.grey[500]}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Field
            fullWidth
            type={confirmShowPassword ? 'text' : 'password'}
            label="Confirm New Password"
            name='confirmPassword'
            component={TextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => confirmShowPassword.onToggle()} edge="end">
                    <Icon
                      icon={confirmShowPassword.value ? 'eye' : 'eye-slash'}
                      color={theme.palette.grey[500]}
                    />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            onClick={() => handleSubmit()}
          >
            Reset Password
          </LoadingButton>
        </Stack>
      )}
    </Formik>
  );
}
export default ResetPasswordForm