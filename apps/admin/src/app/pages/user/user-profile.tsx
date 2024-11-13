import { Box, Button, Container, Stack } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useCallback, useRef } from 'react'
import { object, string } from 'yup';
import Grid from '@mui/material/Grid2';
import { TextField, UploadAvatarField } from '@admin/app/components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@libs/react-core';
import { UploadAvatar } from '@admin/app/components/upload';

const defaultValues: any = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: '',
};

const validationSchema = object().shape({
    firstName: string().trim().required().label('First Name'),
    lastName: string().trim().required().label('Last Name'),
    email: string().trim().required().label('Email'),
    phoneNumber: string().required().label('Phone Number'),
});

const UserProfile = () => {
    const formRef = useRef<any>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmitForm = useCallback(
        () => {

        },
        [],
    )

    return (
        <Container maxWidth='sm'>
            <Box>
                <Formik
                    initialValues={Object.assign({}, defaultValues, user)}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                    innerRef={formRef}
                    enableReinitialize
                >
                    {({ handleSubmit, values }) => (
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Field
                                        small
                                        name='avatar'
                                        label="avatar"
                                        type="file"
                                        accept="image/*"
                                        previewUrl={values.avatarUrl}
                                        component={UploadAvatarField}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Field
                                        fullWidth
                                        required
                                        name='firstName'
                                        label='First Name'
                                        component={TextField}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Field
                                        fullWidth
                                        required
                                        name='lastName'
                                        label='Last Name'
                                        component={TextField}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Field
                                        fullWidth
                                        required
                                        name='email'
                                        label='Email'
                                        component={TextField}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Field
                                        fullWidth
                                        required
                                        name='phoneNumber'
                                        label='Phone Number'
                                        component={TextField}
                                    />
                                </Grid>

                            </Grid>
                            <Stack
                                direction='row'
                                spacing={2}
                                justifyContent='flex-end'
                                mt={2}
                            >
                                {/* <Button variant='outlined' onClick={() => navigate(PATH_DASHBOARD.users.root)}>
                                    Cancel
                                </Button> */}
                                <Button variant='contained' type='submit'>
                                    Update
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    )
}

export default UserProfile