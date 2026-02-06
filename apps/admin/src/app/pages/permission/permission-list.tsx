import { usePermission } from '@libs/react-shared';
import { IPermission, PermissionsEnum, RoleGuardEnum } from '@libs/types';
import {
    Button,
    Card,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Page, Icon, TableActionMenu } from '../../components';
import { IconEnum } from '../../components/icons/icons';
import { PATH_DASHBOARD } from '../../routes/paths';
import DataGrid from '@admin/app/components/data-grid/data-grid';
import {
    DataTableApi,
    DataTableColumn,
} from '@ackplus/react-tanstack-data-table';
import { useToasty } from '@admin/app/hook';
import { useConfirm } from '@admin/app/contexts';
import { HEADER } from '@admin/app/layout/config';
import {
    withRequirePermission,
    useHasPermission,
} from '@ackplus/nest-auth-react';
import PermissionForm from '@admin/app/sections/permission/permission-form';

function PermissionList() {
    const datatableRef = useRef<DataTableApi<IPermission>>(null);
    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();

    const [editData, setEditData] = useState<IPermission | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedGuard, setSelectedGuard] = useState<string>('');

    const canCreate = useHasPermission(PermissionsEnum.CREATE_ROLES);
    const canEdit = useHasPermission(PermissionsEnum.UPDATE_ROLES);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_ROLES);

    const { useGetPermissions, useDeletePermission } = usePermission();
    const { mutateAsync: deletePermission } = useDeletePermission();

    const {
        data: permissionsResponse,
        isLoading,
        refetch,
    } = useGetPermissions({
        guard: selectedGuard || undefined,
    });

    const permissions = useMemo(
        () => permissionsResponse?.items || [],
        [permissionsResponse],
    );

    const handleOpenDialog = useCallback((data?: IPermission) => {
        setEditData(data || null);
        setDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogOpen(false);
        setEditData(null);
    }, []);

    const handleSuccess = useCallback(() => {
        showToasty(
            editData
                ? 'Permission updated successfully'
                : 'Permission created successfully',
        );
        handleCloseDialog();
        refetch();
    }, [editData, handleCloseDialog, showToasty, refetch]);

    const handleDelete = useCallback(
        (row: IPermission) => () => {
            confirmDialog({
                title: 'Delete Permission',
                message: `Are you sure you want to delete the permission "${row.name}"?`,
            })
                .then(async () => {
                    try {
                        await deletePermission(row.id);
                        showToasty('Permission deleted successfully');
                        refetch();
                    } catch (error: any) {
                        showToasty(
                            error?.message || 'Failed to delete permission',
                            'error',
                        );
                    }
                })
                .catch(() => {
                    // User cancelled
                });
        },
        [confirmDialog, deletePermission, showToasty, refetch],
    );

    const columns: DataTableColumn<IPermission>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                enableGlobalFilter: true,
                enableSorting: true,
            },
            {
                accessorKey: 'category',
                header: 'Category',
                enableSorting: true,
                cell: ({ row }) => (
                    <Chip
                        label={row.original?.category || 'Other'}
                        size="small"
                        variant="outlined"
                    />
                ),
            },
            {
                accessorKey: 'guard',
                header: 'Guard',
                enableSorting: true,
                cell: ({ row }) => (
                    <Chip
                        label={row.original?.guard || 'N/A'}
                        size="small"
                        color={
                            row.original?.guard === RoleGuardEnum.ADMIN
                                ? 'primary'
                                : 'default'
                        }
                    />
                ),
            },
            {
                accessorKey: 'description',
                header: 'Description',
                enableSorting: false,
                cell: ({ row }) => {
                    const desc = row.original?.description || '';
                    return desc.length > 50
                        ? `${desc.substring(0, 50)}...`
                        : desc || '-';
                },
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
                        {...(canEdit && {
                            onEdit: () => handleOpenDialog(row.original),
                        })}
                        {...(canDelete && {
                            onDelete: handleDelete(row.original),
                        })}
                    />
                ),
            },
        ],
        [canEdit, canDelete, handleDelete, handleOpenDialog],
    );

    return (
        <Page
            title="Permissions"
            breadcrumbs={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Permissions' },
            ]}>
            <Card>
                <DataGrid
                    ref={datatableRef}
                    columns={columns}
                    idKey="id"
                    data={permissions}
                    totalRow={permissions.length}
                    loading={isLoading}
                    dataMode="client"
                    stateKey="permission-list"
                    maxHeight={`calc(100svh - ${HEADER.H_DESKTOP
                        }px - ${280}px)`}
                    enablePagination
                    enableGlobalFilter
                    extraFilter={
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                            }}>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Guard</InputLabel>
                                <Select
                                    value={selectedGuard}
                                    label="Guard"
                                    onChange={e =>
                                        setSelectedGuard(e.target.value)
                                    }>
                                    <MenuItem value="">All</MenuItem>
                                    {Object.values(RoleGuardEnum).map(guard => (
                                        <MenuItem key={guard} value={guard}>
                                            {guard}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {canCreate && (
                                <Button
                                    variant="contained"
                                    startIcon={<Icon icon={IconEnum.Plus} />}
                                    onClick={() => handleOpenDialog()}>
                                    Add Permission
                                </Button>
                            )}
                        </Box>
                    }
                />
            </Card>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth>
                <DialogTitle>
                    {editData ? 'Edit Permission' : 'Add Permission'}
                </DialogTitle>
                <DialogContent>
                    <PermissionForm
                        data={editData}
                        onSuccess={handleSuccess}
                        onCancel={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>
        </Page>
    );
}

export default withRequirePermission(PermissionList, {
    permission: PermissionsEnum.ACCESS_ROLES,
});
