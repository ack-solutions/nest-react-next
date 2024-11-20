
import { DefaultDialog } from '@admin/app/components';
import { RoleService } from '@libs/react-core';
import { IRole } from '@libs/types';
import { Button, MenuItem, Stack } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useEffect, useRef, useState } from 'react'
import { object, string } from 'yup';


interface AddEditPermissionDialogProps {
    onClose: (value?: any) => void;
    values?: any;
    onSubmit: (value?: any, action?: FormikHelpers<any>) => void;
}

const roleService = RoleService.getInstance<RoleService>();

const defaultValues = {
    name: '',
    roles: []
    // isActive: true,
};

const validationSchema = object().shape({
    name: string().trim().required().label('Name'),
});

const AddEditPermissionDialog = ({ onClose, values, onSubmit }: AddEditPermissionDialogProps) => {
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
        <DefaultDialog
            maxWidth='xs'
            title={values?.id ? 'Edit Permission' : 'Add Permission'}
            onClose={() => onClose()}
            actions={
                <>
                    <Button variant="outlined" onClick={() => { onClose() }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => formRef?.current?.handleSubmit()}>
                        Save
                    </Button>
                </>
            }
        >
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
                            <Field
                                fullWidth
                                required
                                name='name'
                                label='Name'
                                component={TextField}
                            />
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
                        </Stack>

                    </Form>
                )}
            </Formik>
        </DefaultDialog>
    )
}

export default AddEditPermissionDialog