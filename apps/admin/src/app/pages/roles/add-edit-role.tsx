import { yupResolver } from '@hookform/resolvers/yup';
import { usePermission, useRole } from '@libs/react-shared';
import { IRole, PermissionsEnum, RoleGuardEnum } from '@libs/types';
import { errorMessage } from '@libs/utils';
import {
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import { omit } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { object, string, mixed } from 'yup';

import { Page } from '../../components';
import PageLoading from '../../components/loading/page-loading';
import { FormContainer, RHFSelect, RHFTextField } from '../../form';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import PermissionSelector from '../../sections/permission/permission-selector';
import NotFound from '../error/not-found';
import { withRequirePermission } from '@ackplus/nest-auth-react';

type RoleFormValues = {
    name: string;
    guard: RoleGuardEnum;
    permissions?: string[];
    id?: string;
};

const defaultValues: RoleFormValues = {
    name: '',
    guard: RoleGuardEnum.ADMIN,
    permissions: [],
};

const validationSchema = yupResolver(
    object({
        name: string().trim().label('Name').required(),
        guard: mixed<RoleGuardEnum>()
            .oneOf(Object.values(RoleGuardEnum))
            .label('Guard')
            .required(),
    }),
);

function AddEditRole() {
    const { roleId } = useParams();
    const { showToasty } = useToasty();
    const navigate = useNavigate();
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        [],
    );

    const { useUpdateRole, useCreateRole, useGetRoleById } = useRole();
    const { useGetPermissionsByGuard } = usePermission();
    const { mutateAsync: updateRole } = useUpdateRole();
    const { mutateAsync: createRole } = useCreateRole();

    const guardOptions = useMemo(
        () =>
            Object.values(RoleGuardEnum).map(value => ({
                label: value,
                value,
            })),
        [],
    );

    const {
        data: roleValues,
        isLoading: isRoleLoading,
        error,
    } = useGetRoleById(roleId || '');

    const formContext = useForm<RoleFormValues>({
        defaultValues,
        resolver: validationSchema as any,
    });
    const {
        reset,
        watch,
        formState: { isSubmitting },
    } = formContext;
    const currentGuard = watch('guard');

    // Fetch permissions based on selected guard
    const { data: permissionsData = [], isLoading: isLoadingPermissions } =
        useGetPermissionsByGuard(currentGuard || RoleGuardEnum.ADMIN);

    const handleSubmitForm = useCallback(
        async (value: RoleFormValues) => {
            const request: any = {
                ...omit(value, ['id', 'createdAt', 'updatedAt', 'deletedAt']),
                permissions: selectedPermissions,
                guard: value.guard || RoleGuardEnum.ADMIN,
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
                showToasty(
                    errorMessage(error, 'Error while saving Role'),
                    'error',
                );
            }
        },
        [createRole, navigate, showToasty, updateRole, selectedPermissions],
    );

    useEffect(() => {
        if (roleValues) {
            reset({
                id: roleValues.id,
                name: roleValues.name || '',
                guard:
                    (roleValues.guard as RoleGuardEnum) || RoleGuardEnum.ADMIN,
                permissions: roleValues.permissions || [],
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
            ]}>
            <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <FormContainer
                        formProps={{
                            id: 'add-edit-form-role',
                        }}
                        formContext={formContext as any}
                        validationSchema={validationSchema}
                        onSuccess={handleSubmitForm}>
                        <Stack spacing={1.5} width={1}>
                            <Stack direction="row" spacing={1.5} width={1}>
                                <RHFTextField label="Name" name="name" fullWidth />

                                <RHFSelect
                                    label="Guard"
                                    name="guard"
                                    options={guardOptions}
                                    valueKey="value"
                                    labelKey="label"
                                    fullWidth
                                />

                            </Stack>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    mt: 1
                                }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ mb: 0 }}>
                                    Permissions ({selectedPermissions.length}{' '}
                                    selected)
                                </Typography>
                                {isLoadingPermissions && (
                                    <CircularProgress size={16} />
                                )}
                            </Box>

                            <PermissionSelector
                                allPermissions={permissionsData}
                                selectedPermissions={selectedPermissions}
                                onChange={updated => {
                                    setSelectedPermissions(updated);
                                }}
                            />
                            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                                <Button
                                    onClick={() =>
                                        navigate(
                                            PATH_DASHBOARD.users.roles.root,
                                        )
                                    }
                                    variant="outlined"
                                    color="inherit">
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}>
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
