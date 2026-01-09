import { useRole } from '@libs/react-shared';
import { IRole, PermissionsEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Card, Button } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    Page,
    TableActionMenu,
} from '../../components';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';
import DataGrid from '@admin/app/components/data-grid/data-grid';
import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import { HEADER } from '@admin/app/layout/config';


function RoleList() {
    const datatableRef = useRef<DataTableApi<IRole>>(null);
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();

    const canCreate = useHasPermission(PermissionsEnum.CREATE_ROLES);
    const canEdit = useHasPermission(PermissionsEnum.UPDATE_ROLES);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_ROLES);

    const {
        useGetRoles,
        useDeleteRole,
    } = useRole();

    const { data, isLoading, refetch } = useGetRoles({});
    const { mutateAsync: deleteRole } = useDeleteRole();

    const handleDelete = useCallback((row: IRole) => () => {
        confirmDialog({
            title: 'Delete Role',
            message: 'Are you sure you want to delete this role?',
        }).then(async () => {
            try {
                await deleteRole(row.id);
                showToasty('Role deleted successfully');
                refetch();
            } catch (error) {
                showToasty(error || 'Failed to delete role', 'error');
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [
        confirmDialog,
        deleteRole,
        showToasty,
        refetch,
    ]);

    const handleRowClick = useCallback((_event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
        if (canEdit) {
            navigate(PATH_DASHBOARD.users.roles.edit(row.original.id));
        }
    }, [canEdit, navigate]);

    const columns: DataTableColumn<IRole>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            enableGlobalFilter: true,
            enableSorting: true,
            cell: ({ row }) => startCase(row.original?.name),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            enableSorting: true,
            cell: ({ row }) => toDisplayDate(row.original?.createdAt),
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
                    {...(canEdit && { onEdit: () => navigate(PATH_DASHBOARD.users.roles.edit(row.original.id)) })}
                    {...(!row.original?.isSystem && canDelete && { onDelete: handleDelete(row.original) })}
                />
            ),
        },
    ], [canEdit, canDelete, handleDelete, navigate]);

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
                        <Button
                            component={Link}
                            to={PATH_DASHBOARD.users.roles.add}
                            variant="contained"
                        >
                            New Role
                        </Button>
                    )}
                />
            </Card>
        </Page>
    );
}

export default withRequirePermission(RoleList, {
    permission: PermissionsEnum.ACCESS_ROLES,
});
