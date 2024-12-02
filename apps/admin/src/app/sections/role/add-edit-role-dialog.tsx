
import { DefaultDialog, PermissionSelectField, TextField } from '@admin/app/components'
import { PermissionService, RoleService } from '@libs/react-core'
import { IPermission, IRole } from '@libs/types'
import { Button, Stack } from '@mui/material'
import { Field, Form, Formik, FormikProps } from 'formik'
import { map } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { object, string } from 'yup'

const permissionService = PermissionService.getInstance<PermissionService>();
const roleService = RoleService.getInstance<RoleService>();

export interface AddEditRoleDialogProps {
  onClose?: () => void
  roleValue?: IRole;
  onSubmit: (value: IRole, action: any) => void
}

const defaultValue = {
    name: '',
    permissions: []
}
const validationSchema = object().shape({
    name: string().label('Name').required(),
});
const AddEditRoleDialog = ({ onClose, roleValue, onSubmit }: AddEditRoleDialogProps) => {
    const formRef = useRef<FormikProps<any>>(null);
    const [permissions, setPermissions] = useState<IPermission[]>()
    const [roleValues, setRoleValues] = useState<any>(null)

    useEffect(() => {
        permissionService.getMany({ limit: 210, page: 1 }).then(({ items }) => {
            setPermissions(items)

        }).catch(() => {
            // setUserRoles(null)
        })
    }, [])

    useEffect(() => {
        if (roleValue?.id) {
            roleService.getOne(roleValue?.id, {
                relations: ['permissions'],
                select: {
                    permissions: { id: true }
                }
            }
            ).then((resp) => {
                const permissions = map(resp.permissions, 'id')
                setRoleValues({
                    ...resp,
                    permissions
                })
            }).catch((error) => {
                console.log(error);

            })
        }
    }, [roleValue?.id])

    return (
        <DefaultDialog
            onClose={onClose}
            maxWidth='sm'
            title={`${roleValue ? 'Edit' : 'Add'} Role`}
            actions={
                <Stack direction='row' spacing={2}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button variant='contained' onClick={() => formRef.current?.handleSubmit()}>Save</Button>
                </Stack>
            }
        >
            <Formik
                initialValues={Object.assign({}, defaultValue, roleValues)}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
                innerRef={formRef}
            >
                {({ errors, isSubmitting, handleSubmit, values }) => (
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <Field
                                fullWidth
                                name="name"
                                label="Name"
                                component={TextField}
                                required
                            />
                            <Field
                                options={permissions}
                                name="permissions"
                                label="Permissions"
                                component={PermissionSelectField}
                                column={2}
                                renderValue='id'
                                renderLabel='name'
                            />

                        </Stack>
                    </Form>
                )}
            </Formik>
        </DefaultDialog>
    )
}

export default AddEditRoleDialog