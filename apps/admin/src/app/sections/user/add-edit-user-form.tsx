import { FormContainer, Icon, RHFSelect, RHFTextField, RHFUploadAvatar, useBoolean, useRoleQuery } from '@libs/react-core';
import { IUser, UserStatusEnum } from '@libs/types';
import { Button, Card, CardContent, IconButton, InputAdornment, MenuItem, Stack, useTheme } from '@mui/material';
import { startCase } from 'lodash';
import { useEffect } from 'react'
import { number, object, ref, string } from 'yup';
import Grid from '@mui/material/Grid2';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export interface AddEditUserFormProps {
    values?: IUser;
    onSubmit: (value?: IUser) => void;
}

const defaultValues: IUser = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: null,
    status: UserStatusEnum.INACTIVE,
    roles: []
};

const validationSchema = yupResolver(object().shape({
    firstName: string().trim().required().label('First Name'),
    lastName: string().trim().required().label('Last Name'),
    email: string().trim().required().label('Email'),
    phoneNumber: number().required().label('Phone Number'),
    password: string().label('Password').when('id', {
        is: (id: any) => !id,
        then: (schema) =>
            schema.nullable().required().matches(/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        otherwise: (schema) =>
            schema.nullable().matches(/^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
    }),
    confirmPassword: string().label('Confirm Password').when(['id', 'password'], {
        is: (id: any, password: any) => !id || !!password,
        then: (schema) => schema.oneOf([ref('password'), ''], 'Passwords must match').required(),
    }),
}));

const AddEditUserForm = ({ onSubmit, values }: AddEditUserFormProps) => {
    const showPassword = useBoolean()
    const confirmShowPassword = useBoolean()
    const theme = useTheme();
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
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
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
                                {!userId && (
                                    <>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <RHFTextField
                                                fullWidth
                                                type={showPassword.value ? 'text' : 'password'}
                                                name="password"
                                                label="Password"
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
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <RHFTextField
                                                fullWidth
                                                type={confirmShowPassword.value ? 'text' : 'password'}
                                                name="confirmPassword"
                                                label="Confirm Password"
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
                                        </Grid>
                                    </>
                                )}
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
                                        type='number'
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                <Button variant='outlined' onClick={() => navigate(PATH_DASHBOARD.users.root)}>
                                    Cancel
                                </Button>
                                <Button variant='contained' type='submit'>
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