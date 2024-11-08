import { DefaultDialog, Icon, TextField } from '@admin/app/components'
import { AuthService, useBoolean, UserService, useToasty } from '@mlm/react-core'
import { IUser } from '@mlm/types'
import { Button, IconButton, InputAdornment, Stack, useTheme } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { pick } from 'lodash'
import React, { useCallback } from 'react'
import { object, ref, string } from 'yup'

export interface ChangePasswordDialogProps {
    onClose?: () => void
    values?: IUser
}

const userService = UserService.getInstance<UserService>();

const defaultValues = {

    password: '',
    confirmPassword: '',
};
const validationSchema = object().shape({
    password: string().label('New Password').required().matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: string().label('Confirm Password').oneOf([ref('password'), ''], 'Passwords must match').required(),
});

const ChangePasswordDialog = ({ onClose, values }: ChangePasswordDialogProps) => {
    const showPassword = useBoolean()
    const confirmShowPassword = useBoolean()
    const { showToasty } = useToasty()
    const theme = useTheme()

    const handleSubmit = useCallback(
        (values: any, action: FormikHelpers<any>) => {
            const request = {
                ...(pick(values, 'password'))
            }
            userService.update(values?.id, request).then(() => {
                action.setSubmitting(false)
                action.resetForm()
                showToasty('Password Successfully updated')
                onClose && onClose()
            }).catch((error: any) => {
                action.setSubmitting(false)
                action.resetForm()
                showToasty(error.message, 'error')
            });
        }, []
    )
    return (
        <DefaultDialog
            onClose={onClose}
            maxWidth='sm'
            title='ChangePassword'
        >
            <Formik
                initialValues={Object.assign({}, defaultValues, values)}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit }) => (
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Field
                                fullWidth
                                type={showPassword.value ? 'text' : 'password'}
                                name="password"
                                label="Password"
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

                            <Field
                                fullWidth
                                type={confirmShowPassword.value ? 'text' : 'password'}
                                name="confirmPassword"
                                label="Confirm Password"
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
                                    ),
                                }}
                            />
                            <Button type='submit' variant='contained'>
                                Change Password
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </DefaultDialog>
    )
}

export default ChangePasswordDialog