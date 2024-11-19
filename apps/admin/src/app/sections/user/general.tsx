import React from 'react'
import { Box, Button, Card, CardContent, Container, MenuItem, Stack } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { useCallback, useRef } from 'react'
import { object, string } from 'yup';
import Grid from '@mui/material/Grid2';
import { TextField, UploadAvatarField } from '@admin/app/components';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserService, useToasty } from '@libs/react-core';
import PhoneNumberInput from '@admin/app/components/form/phone-number-input';
import PhoneNumberField from '@admin/app/components/form/formik/phone-number-field';
import { UserStatusEnum } from '@libs/types';
import { startCase } from 'lodash';

const userService = UserService.getInstance<UserService>();

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

const General = () => {
  const formRef = useRef<any>();
  const navigate = useNavigate();
  const { setUser, user } = useAuth();
  const { showToasty } = useToasty();

  const handleSubmitForm = useCallback(
    (values: any, action: FormikHelpers<any>) => {
      userService.updateProfile(values).then((data) => {
        setUser({
          ...user,
          ...data,
        })
        showToasty('User profile successfully updated')
        action.setSubmitting(false)
      }).catch((error) => {
        showToasty(error, 'error')
      })
    },
    [showToasty],
  )
  return (
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
            <Grid size={{ xs: 12, sm: 3 }}>
              <Card>
                <CardContent>
                  <Field
                    small
                    name='avatar'
                    label="avatar"
                    type="file"
                    accept="image/*"
                    previewUrl={values.avatarUrl}
                    component={UploadAvatarField}
                  />
                  <Box>
                    <Field
                      fullWidth
                      required
                      name='status'
                      label='Status'
                      component={TextField}
                      select
                    >
                      {Object.values(UserStatusEnum).map((status, index) => (
                        <MenuItem value={status} key={index}>
                          {startCase(status)}
                        </MenuItem>
                      ))}
                    </Field>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 9 }}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
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
                        component={PhoneNumberField}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Field
                        fullWidth
                        name='aboutMe'
                        label='About'
                        component={TextField}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Field
                        fullWidth
                        name='address'
                        label='Address'
                        component={TextField}
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
                    <Button variant='contained' type='submit'>
                      Update
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export default General