import { useRole } from '@libs/react-shared';
import { IRole, PermissionsEnum, RoleGuardEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Card, Button } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    DataTable,
    DataTableColumn,
    DataTableHandle,
    Page,
    TableActionMenu,
} from '../../components';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';


function RoleList() {
    const datatableRef = useRef<DataTableHandle>(null);
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();

    const canCreate = useHasPermission(PermissionsEnum.CREATE_ROLES);
    const canEdit = useHasPermission(PermissionsEnum.UPDATE_ROLES);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_ROLES);

    console.log(canCreate, canEdit, canDelete);
    const {
        useGetRoles,
        useDeleteRole,
    } = useRole();

    const { data, isLoading } = useGetRoles({});
    const { mutateAsync: deleteRole } = useDeleteRole();

    const handleDelete = useCallback((row: IRole) => () => {
        confirmDialog({
            title: 'Delete Role',
            message: 'Are you sure you want to delete this role?',
        }).then(async () => {
            try {
                await deleteRole(row.id);
                showToasty('Role deleted successfully');
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
    ]);


    const columns: DataTableColumn<IRole>[] = [
        {
            name: 'name',
            label: 'Name',
            render: (row) => startCase(row?.name),
        },
        {
            name: 'createdAt',
            label: 'Created At',
            render: (row) => toDisplayDate(row?.createdAt),
        },
        {
            name: 'action',
            label: 'Action',
            props: {
                sx: {
                    width: 120,
                },
            },
            render: (row: IRole) => (
                <TableActionMenu
                    row={row}
                    {...(canEdit && { onEdit: () => navigate(PATH_DASHBOARD.users.roles.edit(row.id)) })}
                    {...(!row?.isSystem && canDelete && { onDelete: handleDelete(row) })}
                />
            ),
        },
    ];

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
                <DataTable
                    ref={datatableRef}
                    data={data || null}
                    isLoading={isLoading}
                    totalRow={data?.length}
                    hasFilter
                    hideSearch
                    columns={columns}

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
