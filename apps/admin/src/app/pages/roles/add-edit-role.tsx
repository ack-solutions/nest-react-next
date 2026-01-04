import { yupResolver } from '@hookform/resolvers/yup';
import { useRole } from '@libs/react-shared';
import { IRole, PermissionsEnum, RoleGuardEnum } from '@libs/types';
import { errorMessage } from '@libs/utils';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { omit } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string } from 'yup';

import { Page } from '../../components';
import PageLoading from '../../components/loading/page-loading';
import { FormContainer, RHFTextField } from '../../form';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import PermissionSelector from '../../sections/permission/permission-selector';
import NotFound from '../error/not-found';
import { withRequirePermission } from '@ackplus/nest-auth-react';


const defaultValues: any = {
    name: '',
    permissions: [],
};

const validationSchema = yupResolver(
    object({
        name: string().trim().label('Name').required(),
    }),
);

function AddEditRole() {
    const { roleId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const { useUpdateRole, useCreateRole, useGetRoleById } = useRole();
    const { mutateAsync: updateRole } = useUpdateRole();
    const { mutateAsync: createRole } = useCreateRole();

    const permissionData = useMemo(() => Object.values(PermissionsEnum), []);

    const { data: roleValues, isLoading: isRoleLoading, error } = useGetRoleById(roleId || '');

    const formContext = useForm({
        defaultValues,
        resolver: validationSchema,
    });
    const { reset, formState: { isSubmitting } } = formContext;

    const handleSubmitForm = useCallback(
        async (value: IRole) => {
            const request: any = {
                ...omit(value, [
                    'id',
                    'createdAt',
                    'updatedAt',
                    'deletedAt',
                ]),
                permissions: selectedPermissions,
                guard: RoleGuardEnum.ADMIN,
            };
            try {
                if (value.id) {
                    await updateRole({
                        ...request,
                        id: value.id,
                    });
                } else {
                    await createRole(request);
                }
                showToasty('Role successfully saved');
                navigate(PATH_DASHBOARD.users.roles.root);
            } catch (error) {
                showToasty(errorMessage(error, 'Error while saving Role'), 'error');
            }
        },
        [
            createRole,
            navigate,
            showToasty,
            updateRole,
            selectedPermissions,
        ],
    );

    useEffect(() => {
        if (roleValues) {
            reset({
                ...roleValues,
            });
            setSelectedPermissions(roleValues?.permissions || []);
        }
    }, [reset, roleValues]);

    if (error && !isRoleLoading) {
        return (
            <NotFound
                entityType="Role"
                redirectPath={PATH_DASHBOARD.users.roles.root}
            />
        );
    }

    if (isRoleLoading) {
        return (
            <Page title={`${roleId ? 'Edit Role' : 'Add Role'}`}>
                <PageLoading />
            </Page>
        );
    }

    return (
        <Page
            title={`${roleId ? 'Edit Role' : 'Add Role'}`}
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Roles',
                    href: PATH_DASHBOARD.users.roles.root,
                },
                { name: `${roleId ? 'Edit Role' : 'Add Role'}` },
            ]}
        >

            <Card>
                <CardContent>
                    <FormContainer
                        formProps={{
                            id: 'add-edit-form-role',
                        }}
                        formContext={formContext}
                        validationSchema={validationSchema}
                        onSuccess={handleSubmitForm}
                    >
                        <Stack
                            spacing={2}
                            width={1}
                        >
                            <RHFTextField
                                label="Name"
                                name="name"
                                fullWidth
                            />

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Permissions (
                                {selectedPermissions.length}
                                {' '}
                                selected)
                            </Typography>

                            <PermissionSelector
                                allPermissions={permissionData}
                                selectedPermissions={selectedPermissions}
                                onChange={(updated) => {
                                    setSelectedPermissions(updated);
                                }}
                            />
                            <Stack
                                direction="row"
                                spacing={2}
                            >
                                <Button
                                    onClick={() => navigate(PATH_DASHBOARD.users.roles.root)}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    {roleId ? 'Update Role' : 'Create Role'}
                                </Button>
                            </Stack>
                        </Stack>
                    </FormContainer>
                </CardContent>
            </Card>
        </Page>
    );
}

export default withRequirePermission(AddEditRole, {
    permission: [PermissionsEnum.CREATE_ROLES, PermissionsEnum.UPDATE_ROLES],
});
