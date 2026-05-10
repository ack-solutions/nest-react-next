import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import {
    Page,
    TableActionMenu,
} from '@admin/app/components';
import { useConfirm } from '@admin/app/contexts';
import { useToasty } from '@admin/app/hook';
import { usePermission } from '@libs/react-shared';
import { PermissionsEnum, IPermission, RoleGuardEnum } from '@libs/types';
import { Datetime } from '@libs/utils';
import { Box, Button, Card, Chip, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';

import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditPermissionDialog from '../../sections/permission/add-edit-permission-dialog';
import DataGrid from '@admin/app/components/data-grid/data-grid';
import { HEADER } from '@admin/app/layout/config';
import { withRequirePermissionFallback } from '@admin/app/hoc/with-require-permission-fallback';


type GuardFilter = 'all' | RoleGuardEnum;

function PermissionList() {
    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();
    const datatableRef = useRef<DataTableApi<IPermission>>(null);

    const [guardFilter, setGuardFilter] = useState<GuardFilter>('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<IPermission | null>(null);

    const {
        useGetPermissions,
        useDeletePermission,
    } = usePermission();

    const { data, isLoading, refetch } = useGetPermissions({ limit: 1000 });
    const { mutateAsync: deletePermission } = useDeletePermission();

    const permissions: IPermission[] = useMemo(
        () => data?.items || [],
        [data?.items],
    );

    const filteredPermissions = useMemo(() => {
        if (guardFilter === 'all') {
            return permissions;
        }
        return permissions.filter((p) => p.guard === guardFilter);
    }, [permissions, guardFilter]);


    const handleOpenAdd = useCallback(() => {
        setEditingPermission(null);
        setDialogOpen(true);
    }, []);

    const handleOpenEdit = useCallback((row: IPermission) => {
        setEditingPermission(row);
        setDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(
        (saved?: boolean) => {
            setDialogOpen(false);
            setEditingPermission(null);
            if (saved) {
                refetch();
            }
        },
        [refetch],
    );

    const handleDelete = useCallback(
        (row: IPermission) => () => {
            confirmDialog({
                title: 'Delete Permission',
                message: `Are you sure you want to delete "${startCase(row.name)}"? This may break roles using it.`,
            })
                .then(async () => {
                    try {
                        await deletePermission(row.id);
                        showToasty('Permission deleted');
                        refetch();
                    } catch (error) {
                        showToasty(error || 'Failed to delete permission', 'error');
                    }
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        },
        [
            confirmDialog,
            deletePermission,
            refetch,
            showToasty,
        ],
    );

    const columns: DataTableColumn<IPermission>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                enableSorting: true,
                enableGlobalFilter: true,
                cell: ({ row }) => (
                    <Box>
                        <Typography variant="body2">{startCase(row.original?.name)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.original?.name}
                        </Typography>
                    </Box>
                ),
            },
            // {
            //     accessorKey: 'guard',
            //     header: 'Guard',
            //     enableSorting: true,
            //     cell: ({ row }) => (row.original?.guard ? (
            //         <Chip
            //             label={startCase(row.original.guard)}
            //             size="small"
            //             color={
            //                 row.original.guard === RoleGuardEnum.ADMIN ? 'info' : 'success'
            //             }
            //             variant="outlined"
            //         />
            //     ) : (
            //         '—'
            //     )),
            // },
            {
                accessorKey: 'category',
                header: 'Category',
                enableSorting: true,
                enableGlobalFilter: true,
                cell: ({ row }) => (row.original?.category ? startCase(row.original.category) : '—'),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                enableGlobalFilter: true,
                cell: ({ row }) => row.original?.description || '—',
            },
            {
                accessorKey: 'createdAt',
                header: 'Created Date',
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
                cell: ({ row }) => (
                    <TableActionMenu
                        row={row.original}
                        onEdit={() => handleOpenEdit(row.original)}
                        onDelete={handleDelete(row.original)}
                    />
                ),
            },
        ],
        [handleDelete, handleOpenEdit],
    );

    return (
        <Page
            title="Permissions"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Permissions',
                    href: PATH_DASHBOARD.users.permissions,
                },
                { name: 'List' },
            ]}
        >
            <Card>
                <DataGrid
                    ref={datatableRef}
                    columns={columns}
                    idKey="id"
                    data={filteredPermissions}
                    totalRow={filteredPermissions.length}
                    loading={isLoading}
                    dataMode="client"
                    stateKey="permissionlist"
                    maxHeight={`calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
                    enablePagination
                    extraFilter={(
                        <Button variant="contained" onClick={handleOpenAdd}>
                            New Permission
                        </Button>
                    )}
                />
            </Card>

            <AddEditPermissionDialog
                open={dialogOpen}
                permission={editingPermission}
                onClose={handleDialogClose}
            />
        </Page>
    );
}

export default withRequirePermissionFallback(PermissionList, {
    permission: PermissionsEnum.ACCESS_ROLES,
});
