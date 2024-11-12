import { Icon, TextField } from '@admin/app/components';
import { RoleService, useBoolean } from '@mlm/react-core';
import { IRole, IUser } from '@mlm/types';
import { Button, Checkbox, IconButton, InputAdornment, MenuItem, Stack, useTheme } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { startCase } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import { object, ref, string } from 'yup';
import Grid from '@mui/material/Grid2';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';

const roleService = RoleService.getInstance<RoleService>();

export interface AddEditUserFormProps {
    values?: IUser;
    onSubmit: (value?: IUser, action?: FormikHelpers<any>) => void;
}
const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roles: []
};

const validationSchema = object().shape({
    firstName: string().trim().required().label('First Name'),
    lastName: string().trim().required().label('Last Name'),
    email: string().trim().required().label('Email'),
    phoneNumber: string().required().label('Phone Number'),
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
});

const AddEditUserForm = ({ onSubmit, values }: AddEditUserFormProps) => {
    const formRef = useRef<any>();
    const [roles, setRoles] = useState([]);
    const showPassword = useBoolean()
    const confirmShowPassword = useBoolean()
    const theme = useTheme();
    const navigate = useNavigate()
    const { id: userId } = useParams();

    useEffect(() => {
        roleService.getMany().then((data) => {
            setRoles(data?.items || []);
        }).catch((error) => {
            //
        })
    }, [])

    return (
        <Formik
            initialValues={Object.assign({}, defaultValues, values)}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            innerRef={formRef}
            enableReinitialize
        >
            {({ handleSubmit }) => (
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                fullWidth
                                required
                                name='firstName'
                                label='First Name'
                                component={TextField}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                fullWidth
                                required
                                name='lastName'
                                label='Last Name'
                                component={TextField}
                            />
                        </Grid>
                        {!userId && (
                            <>
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
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
                                </Grid>
                            </>
                        )}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                fullWidth
                                required
                                name='email'
                                label='Email'
                                component={TextField}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                fullWidth
                                required
                                name='phoneNumber'
                                label='Phone Number'
                                component={TextField}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                fullWidth
                                required
                                name='roles'
                                label='Roles'
                                component={TextField}
                                SelectProps={{
                                    multiple: true
                                }}
                                select
                            >
                                {roles?.map((role: IRole) => (
                                    <MenuItem
                                        key={role?.id}
                                        value={role?.id}
                                    >
                                        {role?.name}
                                    </MenuItem>
                                ))}
                            </Field>
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
                </Form>
            )}
        </Formik>
    )
}

export default AddEditUserForm