import { PermissionSelectField, TextField } from '@admin/app/components'
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import { PermissionService, RoleService, useToasty } from '@libs/react-core'
import { IPermission, IRole } from '@libs/types'
import { Button, Card, CardContent, Container, Stack } from '@mui/material'
import { Field, Form, Formik, FormikProps } from 'formik'
import { map, omit } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { object, string } from 'yup'

const permissionService = PermissionService.getInstance<PermissionService>();
const roleService = RoleService.getInstance<RoleService>();

const defaultValue = {
    name: '',
    permissions: []
}
const validationSchema = object().shape({
    name: string().label('Name').required(),
});

const AddEditRole = () => {
    const formRef = useRef<FormikProps<any>>(null);
    const [permissions, setPermissions] = useState<IPermission[]>()
    const [roleValues, setRoleValues] = useState<any>(null)
    const { id: roleId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const handleSubmitForm = useCallback(
        (value: IRole, action: any) => {
            const request = {
                ...omit(value, ['id', 'createdAt', 'updatedAt', 'deletedAt',]),
                permissions: map(value.permissions, (value) => {
                    return { id: value }
                })
            }

            if (value?.id) {
                roleService.update(value?.id, request).then(() => {
                    showToasty('Role updated Successfully')
                    action.setSubmitting(false)
                    navigate(PATH_DASHBOARD.users.roles)
                }).catch((error) => {
                    showToasty(error, 'error')
                    action.setSubmitting(false)
                })
            } else {
                roleService.create(request).then(() => {
                    action.setSubmitting(false)
                    showToasty('Role updated Successfully')
                    navigate(PATH_DASHBOARD.users.roles)
                }).catch((error) => {
                    showToasty(error, 'error')
                    action.setSubmitting(false)
                })
            }
        },
        [],
    )

    useEffect(() => {
        permissionService.getMany({ limit: 210, page: 1 }).then(({ items }) => {
            setPermissions(items)
        }).catch(() => {
            // 
        })
    }, [])

    useEffect(() => {
        if (roleId) {
            roleService.getOne(roleId, {
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
    }, [roleId])

    return (
        <Page title={`${roleId ? 'Edit Role' : 'Add Role'}`}>
            <Container>
                <CustomBreadcrumbs
                    heading={`${roleId ? 'Edit Role' : 'Add Role'}`}
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Roles', href: PATH_DASHBOARD.users.roles },
                        { name: `${roleId ? 'Edit Role' : 'Add Role'}` },
                    ]}
                />
                <Card>
                    <CardContent>
                        <Formik
                            initialValues={Object.assign({}, defaultValue, roleValues)}
                            validationSchema={validationSchema}
                            enableReinitialize
                            onSubmit={handleSubmitForm}
                            innerRef={formRef}
                        >
                            {({ handleSubmit }) => (
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
                                        <Stack direction='row' spacing={2}>
                                            <Button onClick={() => navigate(PATH_DASHBOARD.users.roles)}>Cancel</Button>
                                            <Button variant='contained' type='submit'>Save</Button>
                                        </Stack>

                                    </Stack>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    )
}

export default AddEditRole