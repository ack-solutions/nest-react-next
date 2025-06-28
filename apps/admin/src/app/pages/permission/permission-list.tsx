import { usePermission } from '@libs/react-shared';
import { toDisplayDate } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { startCase } from 'lodash';
import { useState, useCallback, useRef } from 'react';

import {
    CrudTableActions,
    DataTableColumn,
    Page,
    CustomBreadcrumbs,
    CrudTable,
} from '../../components';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditPermissionDialog from '../../sections/permission/add-edit-permission-dialog';


export default function PermissionList() {
    const datatableRef = useRef<CrudTableActions>(null);
    const [selectPermission, setSelectPermission] = useState<any>();

    const {
        useGetManyPermission,
        useDeletePermission,
        useRestorePermission,
        useDeleteForeverPermission,
        useBulkDeletePermission,
        useBulkRestorePermission,
        useBulkDeleteForeverPermission,
    } = usePermission();

    const handleOpenAddEditRoleDialog = useCallback((row?: any) => {
        setSelectPermission(row);
    }, []);

    const handleCloseAddEditRoleDialog = useCallback(() => {
        setSelectPermission(null);
    }, []);

    const handleDataTableApiRequestMap = useCallback((filter) => {
        filter = {
            ...filter,
            where: {
                ...filter?.where,
            },
            relations: ['roles'],
        };
        return filter;
    }, []);

    const columns: DataTableColumn<any>[] = [
        {
            name: 'name',
            label: 'Name',
            isSearchable: true,
            render: (row) => startCase(row?.name),
        },
        {
            name: 'createdAt',
            label: 'Created Date',
            isSearchable: false,
            isSortable: true,
            render: (row) => toDisplayDate(row?.createdAt),
        },
    ];

    return (
        <Page title="Permissions">
            <CustomBreadcrumbs
                heading="Permissions"
                links={[
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
                action={(
                    <Button
                        variant="contained"
                        onClick={() => handleOpenAddEditRoleDialog()}
                    >
                        Add Permission
                    </Button>
                )}
            />
            <Card>
                <CrudTable
                    hasSoftDelete
                    crudName="Permission"
                    crudOperationHooks={{
                        useGetMany: useGetManyPermission,
                        useDelete: useDeletePermission,
                        useRestore: useRestorePermission,
                        useDeleteForever: useDeleteForeverPermission,
                        useBulkDelete: useBulkDeletePermission,
                        useBulkRestore: useBulkRestorePermission,
                        useBulkDeleteForever: useBulkDeleteForeverPermission,
                    }}
                    dataTableApiRequestMap={handleDataTableApiRequestMap}
                    onEdit={handleOpenAddEditRoleDialog}
                    ref={datatableRef}
                    columns={columns}
                />
            </Card>
            {selectPermission ? (
                <AddEditPermissionDialog
                    onClose={handleCloseAddEditRoleDialog}
                    values={!!selectPermission && selectPermission}
                />
            ) : null}
        </Page>
    );
}
