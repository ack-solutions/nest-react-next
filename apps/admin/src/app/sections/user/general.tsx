import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFTextField, RHFUploadAvatar, useAuth, useToasty, useUserQuery } from '@libs/react-core';
import { IUser, UserStatusEnum } from '@libs/types';
import { Button, Card, CardContent, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { pick, startCase } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';


const defaultValues: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    status: UserStatusEnum.INACTIVE,
};

const validationSchema = yupResolver(object().shape({
    firstName: string().trim().required().label('First Name'),
    lastName: string().trim().required().label('Last Name'),
    email: string().trim().required().label('Email'),
    phoneNumber: string().required().label('Phone Number'),
}));

const General = () => {
    const { reFetchCurrentUser, currentUser } = useAuth();
    const { showToasty } = useToasty();
    const { useUpdateProfile } = useUserQuery();
    const { mutate: updateProfile } = useUpdateProfile();
    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    });
    const { reset } = formContext;

    const handleSubmitForm = useCallback(
        (values) => {
            const request = pick(values, 'status', 'firstName', 'lastName', 'email', 'phoneNumber', 'aboutMe', 'address', 'avatar');
            const options = {
                onSuccess: () => {
                    showToasty('User profile successfully updated');
                    reFetchCurrentUser();
                },
                onError: (error) => {
                    console.log(error);
                    showToasty(error, 'error');
                },
            };
            updateProfile(request, options);
        },
        [
            reFetchCurrentUser,
            showToasty,
            updateProfile,
        ],
    );

    useEffect(() => {
        reset({ ...currentUser });
    }, [reset, currentUser]);

    return (
        <FormContainer
            FormProps={{
                id: 'update-user-profile',
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={handleSubmitForm}
        >
            <Grid
                container
                spacing={2}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 3,
                    }}
                >
                    <Card>
                        <CardContent>
                            <RHFUploadAvatar
                                small
                                name='avatar'
                                label="avatar"
                                previewUrl={currentUser?.avatarUrl}
                            />
                            <RHFTextField
                                fullWidth
                                required
                                name='status'
                                label='Status'
                                select
                                sx={{
                                    mt: 2,
                                }}
                            >
                                {Object.values(UserStatusEnum).map((status, index) => (
                                    <MenuItem
                                        value={status}
                                        key={index}
                                    >
                                        {startCase(status)}
                                    </MenuItem>
                                ))}
                            </RHFTextField>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 9,
                    }}
                >
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                spacing={2}
                            >
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        required
                                        name='firstName'
                                        label='First Name'
                                    />
                                </Grid>
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        required
                                        name='lastName'
                                        label='Last Name'
                                    />
                                </Grid>
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        required
                                        name='email'
                                        label='Email'
                                    />
                                </Grid>
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6,
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        required
                                        name='phoneNumber'
                                        label='Phone Number'
                                    />
                                </Grid>
                                <Grid
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        name='aboutMe'
                                        label='About'
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid
                                    size={{
                                        xs: 12,
                                        md: 6,
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        name='address'
                                        label='Address'
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
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
                                    Update
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </FormContainer>
    );
};

export default General;
