import { usePermission } from '@libs/react-shared';
import { toDisplayDate } from '@libs/utils';
import { Card } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useRef } from 'react';

import {
    CrudTableActions,
    DataTableColumn,
    Page,
    CustomBreadcrumbs,
    CrudTable,
} from '../../components';
import { PATH_DASHBOARD } from '../../routes/paths';


export default function PermissionList() {
    const datatableRef = useRef<CrudTableActions>(null);

    const {
        useGetManyPermission,
        useDeletePermission,
        useRestorePermission,
        useDeleteForeverPermission,
        useBulkDeletePermission,
        useBulkRestorePermission,
        useBulkDeleteForeverPermission,
    } = usePermission();

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

            />
            <Card>
                <CrudTable
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
                    ref={datatableRef}
                    columns={columns}
                    canCreate={false}
                    canUpdate={false}
                    canDelete={false}
                    canRestore={false}
                    canDeleteForever={false}
                />
            </Card>

        </Page>
    );
}
