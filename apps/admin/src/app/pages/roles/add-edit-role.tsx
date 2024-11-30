import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs'
import Page from '@admin/app/components/page'
import { PATH_DASHBOARD } from '@admin/app/routes/paths'
import { yupResolver } from '@hookform/resolvers/yup'
import { errorMessage, FormContainer, PermissionSelectField, RHFTextField, usePermissionQuery, useRoleQuery, useToasty } from '@libs/react-core'
import { IRole } from '@libs/types'
import { Button, Card, CardContent, Container, Stack } from '@mui/material'
import { map, omit } from 'lodash'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { object, string } from 'yup'

const defaultValues = {
    name: '',
    permissions: []
}

const validationSchema = yupResolver(object({
    name: string().label('Name').required(),
}));

const AddEditRole = () => {
    const { id: roleId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();

    const { useUpdateRole, useCreateRole, useGetRoleById } = useRoleQuery();
    const { useGetManyPermission } = usePermissionQuery();
    const { mutateAsync: updateRole } = useUpdateRole();
    const { mutateAsync: createRole } = useCreateRole();
    const { data: permissionData, isLoading } = useGetManyPermission({ limit: 999, page: 1 });
    const { data: roleValues } = useGetRoleById(roleId, {
        relations: ['permissions'],
    });
    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    })
    const { reset } = formContext;

    const handleSubmitForm = useCallback(
        async (value: Partial<IRole>) => {
            const request = {
                ...omit(value, ['id', 'createdAt', 'updatedAt', 'deletedAt',]),
                permissions: map(value.permissions, (value) => {
                    return { id: value }
                })
            }
            try {
                let resp;
                if (value?.id) {
                    resp = await updateRole({
                        ...request,
                        id: value?.id
                    })
                } else {
                    resp = await createRole(request)
                }
                showToasty('Role successfully saved')
                navigate(PATH_DASHBOARD.users.roles)
                return resp;
            } catch (error) {
                showToasty(errorMessage(error, "Error while saving Page"), 'error');
                throw error;
            }
        },
        [],
    )

    useEffect(() => {
        reset({
            ...roleValues,
            permissions: map(roleValues?.permissions, 'id')
        })
    }, [reset, roleValues]);

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
                        <FormContainer
                            FormProps={{
                                id: "add-edit-form-role"
                            }}
                            formContext={formContext}
                            validationSchema={validationSchema}
                            onSuccess={handleSubmitForm}
                        >
                            <Stack spacing={2}>
                                <RHFTextField
                                    label="Name"
                                    name="name"
                                    fullWidth
                                />
                                <PermissionSelectField
                                    name="permissions"
                                    label="Select Permissions"
                                    options={permissionData?.items || []}
                                    column={4}
                                    renderValue="id"
                                    renderLabel="name"
                                    isLoading={isLoading}
                                />
                                <Stack direction='row' spacing={2}>
                                    <Button onClick={() => navigate(PATH_DASHBOARD.users.roles)}>Cancel</Button>
                                    <Button variant='contained' type='submit'>Save</Button>
                                </Stack>
                            </Stack>
                        </FormContainer>
                    </CardContent>
                </Card>
            </Container>
        </Page>
    )
}

export default AddEditRole