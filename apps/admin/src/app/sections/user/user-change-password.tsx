import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFPassword, useToasty, useUserQuery } from '@libs/react-core';
import { Button, Card, CardContent, CardHeader, Container, Stack } from '@mui/material'
import { useCallback } from 'react'
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
    const { showToasty } = useToasty()
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
                onSuccess: () => {
                    showToasty('Password Successfully updated');
                    reset();
                },
                onError: (error) => {
                    showToasty(error, 'error');
                    reset();
                }
            }
            changePassword(values, options);
        }, [changePassword, reset, showToasty]
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
                            <RHFPassword
                                fullWidth
                                name='oldPassword'
                                label="Old password"
                                required
                            />
                            <RHFPassword
                                fullWidth
                                name="password"
                                label="Password"
                                required
                            />
                            <RHFPassword
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                required
                            />
                            <Stack
                                direction='row'
                                spacing={2}
                                justifyContent='flex-end'
                                mt={2}
                            >
                                <Button
                                    variant='contained'
                                    type='submit'
                                >
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
