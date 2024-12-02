import { Field, Formik, FormikHelpers } from 'formik';
import { Alert, Box, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { object, string } from 'yup';
import { TextField } from 'formik-mui';

export interface ForgetPasswordFormProps {
  onSubmit: (values: any, action: FormikHelpers<any>) => void;
  values?: any;
}
const defaultValues = {
    email: '',
}

const validationSchema = object().shape({
    email: string().label('Email').email().required(),
});

const ForgetPasswordForm = ({
    onSubmit,
    values: initialValues,
}: ForgetPasswordFormProps) => {

    return (
        <Formik
            initialValues={Object.assign({}, defaultValues, initialValues)}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Stack spacing={3}>
                    <Box pb={2} pt={0}>
                        {errors?.afterSubmit && (
                            <Alert severity="error">{(errors as any)?.afterSubmit}</Alert>
                        )}
                    </Box>

                    <Field
                        fullWidth
                        name="email"
                        label="Email Address"
                        component={TextField}
                        type="email"
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        onClick={() => handleSubmit()}
                    >
            Send OTP
                    </LoadingButton>
                </Stack>
            )}
        </Formik>
    );
};

export default ForgetPasswordForm;
