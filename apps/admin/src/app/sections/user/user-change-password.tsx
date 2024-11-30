import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, Icon, RHFTextField, useBoolean, useToasty, useUserQuery } from '@libs/react-core';
import { Button, Card, CardContent, CardHeader, Container, IconButton, InputAdornment, Stack, useTheme } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { object, ref, string } from 'yup';


const validationSchema = yupResolver(object().shape({
    oldPassword: string().label('Old Password').required(),
    password: string().label('New Password').required(),
    confirmPassword: string().label('Confirm Password').oneOf([ref('password'), null], 'Passwords must match').required(),
}));

const defaultValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
};

const UserChangePassword = () => {
    const showPassword = useBoolean()
    const showOldPassword = useBoolean()
    const confirmShowPassword = useBoolean()
    const { showToasty } = useToasty()
    const theme = useTheme()
    const { useChangePassword } = useUserQuery()
    const { mutate: changePassword } = useChangePassword()
    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    })
    const { reset } = formContext;

    const handleSubmitForm = useCallback(
        (values) => {
            const options = {
                onSuccess: (data) => {
                    showToasty('Password Successfully updated');
                    reset();
                },
                onError: (error) => {
                    showToasty(error, 'error');
                    reset();
                }
            }
            changePassword(values, options);
        }, []
    )

    return (
        <Container>
            <Card>
                <CardHeader title='Change Password' />
                <CardContent>
                    <FormContainer
                        FormProps={{
                            id: "update-user-profile"
                        }}
                        formContext={formContext}
                        validationSchema={validationSchema}
                        onSuccess={handleSubmitForm}
                    >
                        <Stack spacing={2}>
                            <RHFTextField
                                fullWidth
                                type={showOldPassword.value ? 'text' : 'password'}
                                name="oldPassword"
                                label="Old password"
                                required
                                slotProps={{
                                    input: {
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
                                    }
                                }}
                            />
                            <RHFTextField
                                fullWidth
                                type={showPassword.value ? 'text' : 'password'}
                                name="password"
                                label="Password"
                                required
                                slotProps={{
                                    input: {
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
                                    }
                                }}
                            />
                            <RHFTextField
                                fullWidth
                                type={confirmShowPassword.value ? 'text' : 'password'}
                                name="confirmPassword"
                                label="Confirm Password"
                                required
                                slotProps={{
                                    input: {
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
                                    }
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
                    </FormContainer>
                </CardContent>
            </Card>
        </Container>
    )
}

export default UserChangePassword