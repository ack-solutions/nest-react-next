import { Icon } from '@admin/app/components';
import { errorMessage, useAuth, useBoolean, UserService, useToasty } from '@libs/react-core';
import { Box, Button, Card, CardContent, CardHeader, Container, IconButton, InputAdornment, Stack, useTheme } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { TextField } from 'formik-mui';
import { useCallback } from 'react'
import { object, ref, string } from 'yup';

const userService = UserService.getInstance<UserService>();


const validationSchema = object().shape({
    oldPassword: string().label('Old Password').required(),
    password: string().label('New Password').required().matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: string().label('Confirm Password').oneOf([ref('password'), null], 'Passwords must match').required(),
});

const defaultValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
};

const UserChangePassword = () => {
    const { user } = useAuth();
    const showPassword = useBoolean()
    const showOldPassword = useBoolean()
    const confirmShowPassword = useBoolean()
    const { showToasty } = useToasty()
    const theme = useTheme()

    const handleSubmitForm = useCallback(
        (values, action: FormikHelpers<any>) => {
            userService.changePassword(values).then(() => {
                action.setSubmitting(false)
                action.resetForm()
                showToasty('Password Successfully updated')
            }).catch((error) => {
                action.setErrors({ afterSubmit: errorMessage(error) });
                action.setSubmitting(false)
                showToasty(error.message, 'error')
            });
        }, []
    )

    return (
        <Container maxWidth='sm'>
            <Card>
                <CardHeader title='Change Password' />
                <CardContent>
                    <Formik
                        initialValues={Object.assign({}, defaultValues)}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitForm}
                        enableReinitialize
                    >
                        {({ handleSubmit, values, errors }) => (
                            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Stack spacing={2}>
                                    <Field
                                        fullWidth
                                        type={showOldPassword.value ? 'text' : 'password'}
                                        name="oldPassword"
                                        label="Old password"
                                        component={TextField}
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => showOldPassword.onToggle()} edge="end">
                                                        <Icon
                                                            icon={showOldPassword.value ? 'eye' : 'eye-slash'}
                                                            color={theme.palette.grey[500]}
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Field
                                        fullWidth
                                        type={showPassword.value ? 'text' : 'password'}
                                        name="password"
                                        label="Password"
                                        component={TextField}
                                        required
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

                                    <Field
                                        fullWidth
                                        type={confirmShowPassword.value ? 'text' : 'password'}
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        component={TextField}
                                        required
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
                                            ),
                                        }}
                                    />
                                    <Stack
                                        direction='row'
                                        spacing={2}
                                        justifyContent='flex-end'
                                        mt={2}
                                    >
                                        <Button variant='contained' type='submit'>
                                            Change
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Container>
    )
}

export default UserChangePassword