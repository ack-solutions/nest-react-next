
import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Button,
    Card,
} from '@mui/material';
import { usePermissionQuery } from '@libs/react-core';
import { IPermission, IRole } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import AddEditPermissionDialog from '../../sections/user/add-edit-permission-dialog';
import { startCase } from 'lodash';
import { DataTableColumn } from '@admin/app/components';
import Page from '@admin/app/components/page';
import CustomBreadcrumbs from '@admin/app/components/custom-breadcrumbs/custom-breadcrumbs';
import { PATH_DASHBOARD } from '@admin/app/routes/paths';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table';

export default function PermissionList() {
    const datatableRef = useRef<CrudTableActions>(null);
    const [selectPermission, setSelectPermission] = useState<any>()

    const {
        useGetManyPermission,
        useDeletePermission,
        useRestorePermission,
        useDeleteForeverPermission,
        useBulkDeletePermission,
        useBulkRestorePermission,
        useBulkDeleteForeverPermission, } = usePermissionQuery();

    const handleOpenAddEditRoleDialog = useCallback(
        (row: IRole) => {
            setSelectPermission(row)
        },
        [],
    )

    const handleCloseAddEditRoleDialog = useCallback(
        () => {
            setSelectPermission(null)
        },
        [],
    )


    // const handleDataTableChange = useCallback((filter: any) => {
    //     filter = {
    //         ...filter,
    //         s: {
    //             ...filter?.s,
    //         },
    //         relations: ['roles'],
    //     };
    //     setsPermissionRequest(filter)
    // }, []);

    const columns: DataTableColumn<IPermission>[] = [
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
        <Page title='Permissions'>
            <Container maxWidth={false}>
                <CustomBreadcrumbs
                    heading="Permissions"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Permissions', href: PATH_DASHBOARD.users.permissions },
                        { name: 'List' },
                    ]}
                    action={
                        <Button variant='contained' onClick={() => handleOpenAddEditRoleDialog({})}>Add Permission</Button>
                    }
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
                        onEdit={handleOpenAddEditRoleDialog}
                        ref={datatableRef}
                        columns={columns}
                    />
                </Card>
                {selectPermission && (
                    <AddEditPermissionDialog
                        onClose={handleCloseAddEditRoleDialog}
                        values={!!selectPermission && selectPermission}
                    />)
                }
            </Container>
        </Page>
    );
}
