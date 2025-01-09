import { DefaultDialog } from '@admin/app/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormContainer, Icon, RHFTextField, useBoolean, useToasty, useUserQuery } from '@libs/react-core'
import { IUser } from '@libs/types'
import { Button, IconButton, InputAdornment, Stack, useTheme } from '@mui/material'
import { pick } from 'lodash'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { object, ref, string } from 'yup'


export interface ChangePasswordDialogProps {
    onClose?: () => void
    values?: IUser
}

const defaultValues = {
    password: '',
    confirmPassword: '',
};
const validationSchema = yupResolver(object().shape({
    password: string().label('New Password').required().matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    confirmPassword: string().label('Confirm Password').oneOf([ref('password'), ''], 'Passwords must match').required(),
}));

const ChangePasswordDialog = ({ onClose, values: initialValue }: ChangePasswordDialogProps) => {
    const showPassword = useBoolean()
    const confirmShowPassword = useBoolean()
    const { showToasty } = useToasty()
    const theme = useTheme()
    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    })
    const { reset } = formContext;
    const { useUpdateUser } = useUserQuery()
    const { mutate: updateUser } = useUpdateUser()

    const handleSubmit = useCallback(
        (values: any) => {
            const request = {
                ...(pick(values, 'password')),
                id: initialValue?.id,
            }
            const options = {
                onSuccess: () => {
                    showToasty('Password Successfully updated')
                    reset()
                    onClose && onClose()
                },
                onError: (error) => {
                    showToasty(error, 'error');
                    reset()
                    onClose && onClose()
                }
            }
            updateUser(request, options);
        }, [initialValue?.id, onClose, reset, showToasty, updateUser]
    )

    return (
        <DefaultDialog
            onClose={onClose}
            maxWidth='sm'
            title='Reset Password'
        >
            <FormContainer
                FormProps={{
                    id: "reset-password"
                }}
                formContext={formContext}
                validationSchema={validationSchema}
                onSuccess={handleSubmit}
            >
                <Stack spacing={2}>
                    <RHFTextField
                        fullWidth
                        type={showPassword.value ? 'text' : 'password'}
                        name="password"
                        label="Password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => showPassword.onToggle()}
                                            edge="end"
                                        >
                                            <Icon
                                                icon={showPassword.value ? 'eye' : 'eye-slash'}
                                                color={theme.palette.grey[500]}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    <RHFTextField
                        fullWidth
                        type={confirmShowPassword.value ? 'text' : 'password'}
                        name="confirmPassword"
                        label="Confirm Password"
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => confirmShowPassword.onToggle()}
                                            edge="end"
                                        >
                                            <Icon
                                                icon={confirmShowPassword.value ? 'eye' : 'eye-slash'}
                                                color={theme.palette.grey[500]}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                    >
                        Change Password
                    </Button>
                </Stack>
            </FormContainer>
        </DefaultDialog>
    )
}

export default ChangePasswordDialog
