import { Button, Card, CardContent, MenuItem, Stack } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { number, object, string } from 'yup';
import Grid from '@mui/material/Grid2';
import { FormContainer, RHFTextField, RHFUploadAvatar, useAuth, UserService, useToasty, useUserQuery } from '@libs/react-core';
import { IUser, UserStatusEnum } from '@libs/types';
import { pick, startCase } from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const defaultValues: IUser = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: null,
  avatar: '',
  status: UserStatusEnum.INACTIVE,
};

const validationSchema = yupResolver(object().shape({
  firstName: string().trim().required().label('First Name'),
  lastName: string().trim().required().label('Last Name'),
  email: string().trim().required().label('Email'),
  phoneNumber: number().required().label('Phone Number'),
}));

const General = () => {
  const { reFetchCurrentUser, currentUser } = useAuth();
  const { showToasty } = useToasty();
  const { useUpdateProfile } = useUserQuery()
  const { mutate: updateProfile } = useUpdateProfile()
  const formContext = useForm({
    defaultValues,
    resolver: validationSchema,
  })
  const { reset } = formContext;

  const handleSubmitForm = useCallback(
    (values) => {
      const request = pick(values, 'status', 'firstName', 'lastName', 'email', 'phoneNumber', 'aboutMe', 'address')
      const options = {
        onSuccess: (data) => {
          showToasty('User profile successfully updated');
          reFetchCurrentUser()
        },
        onError: (error) => {
          console.log(error)
          showToasty(error, 'error');
        }
      }
      updateProfile(request, options);
    },
    [showToasty],
  )
  useEffect(() => {
    reset({ ...currentUser })
  }, [reset, currentUser]);

  return (
    <FormContainer
      FormProps={{
        id: "update-user-profile"
      }}
      formContext={formContext}
      validationSchema={validationSchema}
      onSuccess={handleSubmitForm}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}>
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
                  mt: 2
                }}
              >
                {Object.values(UserStatusEnum).map((status, index) => (
                  <MenuItem value={status} key={index}>
                    {startCase(status)}
                  </MenuItem>
                ))}
              </RHFTextField>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 9 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField
                    fullWidth
                    required
                    name='firstName'
                    label='First Name'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField
                    fullWidth
                    required
                    name='lastName'
                    label='Last Name'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField
                    fullWidth
                    required
                    name='email'
                    label='Email'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <RHFTextField
                    fullWidth
                    required
                    name='phoneNumber'
                    label='Phone Number'
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <RHFTextField
                    fullWidth
                    name='aboutMe'
                    label='About'
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Button variant='contained' type='submit'>
                  Update
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </FormContainer>
  )
}

export default General