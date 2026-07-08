import { INestAuthPermission, INestAuthRole } from '@ackplus/nest-auth-client';
import { yupResolver } from '@hookform/resolvers/yup';

import { usePermission, useRole } from '@libs/react-shared';
import { RoleGuardEnum } from '@libs/types';
import { errorMessage } from '@libs/utils';
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material';
import { omit, startCase } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';

import PermissionSelector from '@admin/app/sections/permission/permission-selector';
import { getRolePermissionNames } from '../../pages/roles/role-list';
import { useToasty } from '@admin/app/hook';
import { DefaultDialog } from '@admin/app/components';
import { FormContainer, RHFTextField } from '@admin/app/form';


const ADMIN_GUARD = RoleGuardEnum.ADMIN;

type RoleFormValues = {
    id?: string;
    name: string;
};

const defaultValues: RoleFormValues = {
    name: '',
};

const validationSchema = object({
    name: string().trim().label('Name').required(),
});

export interface AddEditRoleDialogProps {
    open: boolean;
    role?: INestAuthRole & { rolePermissions?: { permission?: INestAuthPermission }[] } | null;
    onClose: (saved?: boolean) => void;
}

export default function AddEditRoleDialog({
    open,
    role,
    onClose,
}: AddEditRoleDialogProps) {
    const { showToasty } = useToasty();
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const { useUpdateRole, useCreateRole } = useRole();
    const { mutateAsync: updateRole } = useUpdateRole();
    const { mutateAsync: createRole } = useCreateRole();

    const { useGetPermissionsByGuard } = usePermission();
    const { data: permissionsData = [], isLoading: isLoadingPermissions } =
        useGetPermissionsByGuard(ADMIN_GUARD, { enabled: open });

    const formContext = useForm<RoleFormValues>({
        defaultValues,
        resolver: yupResolver(validationSchema) as any,
    });
    const {
        reset,
        formState: { isSubmitting },
    } = formContext;

    useEffect(() => {
        if (!open) {
            return;
        }
        if (role) {
            const fromRole = getRolePermissionNames(role);
            reset({
                id: role.id,
                name: role.name || '',
            });
            setSelectedPermissions(fromRole);
        } else {
            reset(defaultValues);
            setSelectedPermissions([]);
        }
    }, [
        open,
        role,
        reset,
    ]);

    const handleSubmitForm = useCallback(
        async (value: RoleFormValues) => {
            if (isLoadingPermissions) {
                return;
            }
            const allowedNames = new Set(
                permissionsData.map((p) => String(p.name)),
            );
            const permissionsPayload = selectedPermissions.filter((p) => allowedNames.has(p));

            const request: any = {
                ...omit(value, ['id']),
                permissions: permissionsPayload,
                guard: ADMIN_GUARD,
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
                onClose(true);
            } catch (error) {
                showToasty(errorMessage(error, 'Error while saving Role'), 'error');
            }
        },
        [
            createRole,
            isLoadingPermissions,
            onClose,
            permissionsData,
            selectedPermissions,
            showToasty,
            updateRole,
        ],
    );

    const isEdit = Boolean(role?.id);
    const title = isEdit ? `Edit Role${role?.name ? ` — ${startCase(role.name)}` : ''}` : 'Add Role';

    return (
        <DefaultDialog
            open={open}
            maxWidth="md"
            fullWidth
            title={title}
            onClose={() => onClose()}
            actions={(
                <>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => onClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        form="add-edit-form-role"
                        loading={isSubmitting}
                        disabled={isLoadingPermissions}
                    >
                        {isEdit ? 'Update Role' : 'Create Role'}
                    </Button>
                </>
            )}
        >
            <FormContainer
                formProps={{ id: 'add-edit-form-role' }}
                formContext={formContext as any}
                validationSchema={validationSchema}
                onSuccess={handleSubmitForm}
            >
                <Stack spacing={1.5} sx={{
                    width: 1
                }}>
                    <RHFTextField
                        label="Name"
                        name="name"
                        fullWidth
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ mb: 0 }}>
                            Permissions (
                            {selectedPermissions.length}
                            {' '}
                            selected)
                        </Typography>
                        {isLoadingPermissions && (
                            <CircularProgress size={16} />
                        )}
                    </Box>

                    <PermissionSelector
                        allPermissions={permissionsData}
                        selectedPermissions={selectedPermissions}
                        onChange={setSelectedPermissions}
                    />
                </Stack>
            </FormContainer>
        </DefaultDialog>
    );
}
