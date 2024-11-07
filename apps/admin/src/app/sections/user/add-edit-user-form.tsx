import { AutocompleteField, RoleService, TextField } from '@mlm/react-core';
import { IUser } from '@mlm/types';
import { Checkbox, MenuItem, Stack } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { startCase } from 'lodash';
import React, { useEffect, useRef, useState } from 'react'
import { object, string } from 'yup';

const roleService = RoleService.getInstance<RoleService>();

export interface AddEditUserFormProps {
    values?: IUser;
    onSubmit: (value?: IUser, action?: FormikHelpers<any>) => void;
}
const defaultValues = {
    name: '',
    // isActive: true,
};

const validationSchema = object().shape({
    name: string().trim().required().label('Name'),
});

const AddEditUserForm = ({ onSubmit, values }: AddEditUserFormProps) => {
    const formRef = useRef<any>();
    const [roles, setRoles] = useState([]);

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
                    <Stack spacing={2}>
                        <Stack spacing={2} direction='row'>
                            <Field
                                fullWidth
                                required
                                name='firstName'
                                label='First Name'
                                component={TextField}
                            />
                            <Field
                                fullWidth
                                required
                                name='lastName'
                                label='Last Name'
                                component={TextField}
                            />
                        </Stack>
                        <Stack spacing={2} direction='row'>
                            <Field
                                fullWidth
                                required
                                name='email'
                                label='Email'
                                component={TextField}
                            />
                            <Field
                                fullWidth
                                required
                                name='phoneNumber'
                                label='Phone Number'
                                component={TextField}
                            />
                        </Stack>
                        <Stack spacing={2} direction='row'>
                            <Field
                                name="roles"
                                label="Roles"
                                multiple
                                component={AutocompleteField}
                                options={roles}
                                renderKey="name"
                                renderValue="id"
                                renderOption={(props: any, option: any, state: any) => (
                                    <MenuItem {...props}>
                                        <Checkbox checked={state?.selected} />
                                        {startCase(option?.name)}
                                    </MenuItem>
                                )}
                                isOptionEqualToValue={(option: any, value: any) =>
                                    value.id === option.id
                                }
                            />
                            <Field
                                fullWidth
                                required
                                name='phoneNumber'
                                label='Phone Number'
                                component={TextField}
                            />
                        </Stack>

                    </Stack>
                </Form>
            )}
        </Formik>
    )
}

export default AddEditUserForm