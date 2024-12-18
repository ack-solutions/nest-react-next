import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormContainer, RHFPassword, RHFPhoneNumber, RHFSelect, RHFTextField, RHFUploadAvatar, useBoolean, useRoleQuery } from '@libs/react-core';
import { IUser, UserStatusEnum } from '@libs/types';
import { Button, Card, CardContent, MenuItem, Stack, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { startCase } from 'lodash';
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { object, ref, string } from 'yup';


export interface AddEditUserFormProps {
    values?: IUser;
    onSubmit: (value?: IUser) => void;
}

const defaultValues: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: UserStatusEnum.INACTIVE,
    roles: []
};

const validationSchema = yupResolver(object().shape({
    firstName: string().trim().required().label('First Name'),
    lastName: string().trim().required().label('Last Name'),
    email: string().label('Email').required().matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid email address'),
    phoneNumber: string().required().label('Phone Number'),
    password: string().label('Password').when('id', {
        is: (id: any) => !id,
        then: (schema) =>
            schema.nullable().required(),
        otherwise: (schema) =>
            schema.nullable(),
    }),
    confirmPassword: string().label('Confirm Password').when(['id', 'password'], {
        is: (id: any, password: any) => !id || !!password,
        then: (schema) => schema.oneOf([ref('password'), ''], 'Passwords must match').required(),
    }),
}));

const AddEditUserForm = ({ onSubmit, values }: AddEditUserFormProps) => {
    const navigate = useNavigate()
    const { id: userId } = useParams();
    const { useGetManyRole } = useRoleQuery();
    const { data: roleData } = useGetManyRole()

    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    })
    const { reset } = formContext;


    useEffect(() => {
        reset({
            ...values,
        })
    }, [reset, values]);

    return (
        <FormContainer
            FormProps={{
                id: "add-edit-form-user"
            }}
            formContext={formContext}
            validationSchema={validationSchema}
            onSuccess={onSubmit}
        >
            <Grid
                container
                spacing={2}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 3
                    }}
                >
                    <Card>
                        <CardContent>
                            <RHFUploadAvatar
                                small
                                name='avatar'
                                label="avatar"
                                previewUrl={values.avatarUrl}
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
                        sm: 9
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
                                        sm: 6
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
                                        sm: 6
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        required
                                        name='lastName'
                                        label='Last Name'
                                    />
                                </Grid>
                                {!userId && (
                                    <>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}
                                        >
                                            <RHFPassword
                                                fullWidth
                                                name="password"
                                                label="Password"
                                            />
                                        </Grid>
                                        <Grid
                                            size={{
                                                xs: 12,
                                                sm: 6
                                            }}
                                        >
                                            <RHFPassword
                                                fullWidth
                                                name="confirmPassword"
                                                label="Confirm Password"
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
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
                                        sm: 6
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
                                        sm: 6
                                    }}
                                >
                                    <RHFTextField
                                        fullWidth
                                        name='status'
                                        label='Status'
                                        select
                                    >
                                        {Object.values(UserStatusEnum)?.map((status, index) => (
                                            <MenuItem
                                                key={index}
                                                value={status}
                                            >
                                                {startCase(status)}
                                            </MenuItem>
                                        ))}
                                    </RHFTextField>
                                </Grid>
                                <Grid
                                    size={{
                                        xs: 12,
                                        sm: 6
                                    }}
                                >
                                    <RHFSelect
                                        fullWidth
                                        required
                                        name='roles'
                                        label='Roles'
                                        valueKey='id'
                                        labelKey='name'
                                        options={roleData?.items}
                                        slotProps={{
                                            select: {
                                                multiple: true
                                            }
                                        }}
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
                                    variant='outlined'
                                    onClick={() => navigate(PATH_DASHBOARD.users.root)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant='contained'
                                    type='submit'
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </FormContainer>
    )
}

export default AddEditUserForm
