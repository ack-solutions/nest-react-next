import { INestAuthPermission, INestAuthRole } from '@ackplus/nest-auth-client';
import { useHasPermission } from '@ackplus/nest-auth-react';
import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import { useRole } from '@libs/react-shared';
import { PermissionsEnum, RoleGuardEnum } from '@libs/types';
import { Datetime } from '@libs/utils';
import { Box, Button, Card, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';

import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditRoleDialog from '@admin/app/sections/role/add-edit-role-dialog';
import { useConfirm } from '@admin/app/contexts';
import { useToasty } from '@admin/app/hook';
import { TableActionMenu } from '@admin/app/components/data-grid';
import DataGrid from '@admin/app/components/data-grid/data-grid';
import { HEADER } from '@admin/app/layout/config';
import { Page } from '@admin/app/components';
import { withRequirePermissionFallback } from '@admin/app/hoc/with-require-permission-fallback';


export function getRolePermissionNames(
    role: INestAuthRole & { rolePermissions?: { permission?: INestAuthPermission }[] },
): string[] {
    if (!role?.rolePermissions?.length) {
        return [];
    }
    const names = role.rolePermissions
        ?.map((rp) => rp.permission?.name)
        .filter(Boolean);
    return [...new Set(names)];
}

type RoleWithPermissions = INestAuthRole & {
    rolePermissions?: { permission?: INestAuthPermission }[];
    isSystem?: boolean;
};

function RoleList() {
    const datatableRef = useRef<DataTableApi<INestAuthRole>>(null);
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(null);

    const canCreate = useHasPermission(PermissionsEnum.CREATE_ROLES);
    const canEdit = useHasPermission(PermissionsEnum.UPDATE_ROLES);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_ROLES);

    const { useGetRoleByGuard, useDeleteRole } = useRole();

    const { data, isLoading, refetch } = useGetRoleByGuard(RoleGuardEnum.ADMIN);
    const { mutateAsync: deleteRole } = useDeleteRole();

    const handleDelete = useCallback(
        (row: INestAuthRole) => () => {
            confirmDialog({
                title: 'Delete Role',
                message: 'Are you sure you want to delete this role?',
            })
                .then(async () => {
                    try {
                        await deleteRole(row.id);
                        showToasty('Role deleted successfully');
                        refetch();
                    } catch (error) {
                        showToasty(error || 'Failed to delete role', 'error');
                    }
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        },
        [
            confirmDialog,
            deleteRole,
            refetch,
            showToasty,
        ],
    );

    const handleOpenAdd = useCallback(() => {
        setEditingRole(null);
        setDialogOpen(true);
    }, []);

    const handleOpenEdit = useCallback((row: RoleWithPermissions) => {
        setEditingRole(row);
        setDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(
        (saved?: boolean) => {
            setDialogOpen(false);
            setEditingRole(null);
            if (saved) {
                refetch();
            }
        },
        [refetch],
    );

    const handleRowClick = useCallback(
        (_event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
            if (!canEdit) {
                return;
            }
            handleOpenEdit(row.original);
        },
        [canEdit, handleOpenEdit],
    );

    const columns: DataTableColumn<INestAuthRole>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                enableGlobalFilter: true,
                enableSorting: true,
                cell: ({ row }) => startCase(row.original?.name),
            },
            {
                id: 'permissions',
                header: 'Permissions',
                enableSorting: false,
                cell: ({ row }) => {
                    const list = getRolePermissionNames(row.original as any);
                    if (list.length === 0) {
                        return (
                            <Typography variant="body2" component="span" color="text.secondary">
                                —
                            </Typography>
                        );
                    }
                    return (
                        <Box component="span">
                            <Typography variant="body2" component="span" noWrap>
                                {list.length}
                                {' '}
                                permission
                                {list.length === 1 ? '' : 's'}
                            </Typography>
                        </Box>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                enableSorting: true,
                cell: ({ row }) => Datetime.toDisplayDate(row.original?.createdAt),
            },
            {
                id: 'action',
                header: 'Action',
                enablePinning: false,
                enableHiding: false,
                enableResizing: false,
                maxSize: 80,
                cell: ({ row }) => {
                    const isSystem = (row.original as RoleWithPermissions)?.isSystem;
                    return (
                        <TableActionMenu
                            permissionsKeys={{
                                edit: PermissionsEnum.UPDATE_ROLES,
                                delete: PermissionsEnum.DELETE_ROLES,
                            }}
                            row={row.original}
                            {...(canEdit && {
                                onEdit: () => handleOpenEdit(row.original as RoleWithPermissions),
                            })}
                            {...(!isSystem && canDelete && {
                                onDelete: handleDelete(row.original),
                            })}
                        />
                    );
                },
            },
        ],
        [
            canDelete,
            canEdit,
            handleDelete,
            handleOpenEdit,
        ],
    );

    return (
        <Page
            title="Roles"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Roles',
                    href: PATH_DASHBOARD.users.roles.root,
                },
                { name: 'List' },
            ]}
        >
            <Card>
                <DataGrid
                    ref={datatableRef}
                    columns={columns}
                    idKey="id"
                    data={data || []}
                    totalRow={data?.length || 0}
                    loading={isLoading}
                    dataMode="client"
                    stateKey="rolelist"
                    maxHeight={`calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
                    enablePagination
                    onRowClick={canEdit ? handleRowClick : undefined}
                    extraFilter={canCreate && (
                        <Button variant="contained" onClick={handleOpenAdd}>
                            New Role
                        </Button>
                    )}
                />
            </Card>

            <AddEditRoleDialog
                open={dialogOpen}
                role={editingRole}
                onClose={handleDialogClose}
            />
        </Page>
    );
}

export default withRequirePermissionFallback(RoleList, {
    permission: PermissionsEnum.ACCESS_ROLES,
});
