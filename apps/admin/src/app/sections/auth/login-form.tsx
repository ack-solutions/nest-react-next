import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Form, FormikHelpers, Formik, Field } from 'formik';
import {
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  Link,
} from '@mui/material';
import { boolean, object, string } from 'yup';
import { CheckboxWithLabel } from 'formik-mui';
import LoadingButton from '@mui/lab/LoadingButton';
import { PATH_AUTH } from '../../routes/paths';
import { ILoginSendOtpInput } from '@mlm/types';
import { useBoolean } from '@mlm/react-core';
import { Icon, TextField } from '@admin/app/components';


export type LoginFormProps = {
  onSubmit?: (
    value: ILoginSendOtpInput,
    action: FormikHelpers<ILoginSendOtpInput>
  ) => void;
  data?: ILoginSendOtpInput;
};

const defaultValues = {
  email: '',
  password: '',
  remember: false,
};

const validationSchema = object().shape({
  email: string()
    .email('Email must be a valid email address')
    .required('Email is required'),
  password: string().required('Password is required'),
  remember: boolean().label('Remember').required(),

});

export default function LoginForm({ onSubmit, data }: LoginFormProps) {
  const showPassword = useBoolean()
  const theme = useTheme();

  const handleSubmit = useCallback(
    (value:any, action:any) => {
      onSubmit && onSubmit(value, action);
    },
    [onSubmit]
  );

  return (
    <Formik
      initialValues={Object.assign({}, defaultValues, data)}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, isSubmitting, handleSubmit }) => (
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {(errors as any).afterSubmit && (
              <Alert severity="error">{(errors as any).afterSubmit as any}</Alert>
            )}
            <Field
              fullWidth
              type="email"
              name="email"
              label="Email address"
              autoComplete="email"
              component={TextField}
            />

            <Field
              fullWidth
              type={showPassword.value ? 'text' : 'password'}
              name="password"
              label="Password"
              autoComplete="password"
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
                ),
              }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2, marginLeft: '4px' }}
          >

            <Field
              component={CheckboxWithLabel}
              type="checkbox"
              name="remember"
              Label={{ label: 'Remember me' }}
            />

            <Link
              component={RouterLink}
              to={PATH_AUTH.forgotPassword}
              sx={{
                ':hover': {
                  textDecoration: 'none'
                }
              }}
            >
              Forgot password?
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>
        </Form>
      )}
    </Formik>
  );
}
