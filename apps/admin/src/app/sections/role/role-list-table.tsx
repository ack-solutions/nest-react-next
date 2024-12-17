import { DataTableColumn } from '@admin/app/components';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table'
import { useRoleQuery } from '@libs/react-core';
import { IRole } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Card } from '@mui/material'
import React, { useRef } from 'react'

export interface RoleListTableProps {
    onEdit?: (row: IRole) => void;
}

const RoleListTable = ({ onEdit }: RoleListTableProps) => {
    const datatableRef = useRef<CrudTableActions>(null);
    const { useGetManyRole,
        useDeleteRole,
        useBulkDeleteRole,
        useRestoreRole,
        useBulkDeleteRoleForever,
        useBulkRestoreRole,
        useDeleteRoleForever
    } = useRoleQuery();

    const columns: DataTableColumn<IRole>[] = [
        {
            name: 'name',
            label: 'Name',
            isSearchable: true,
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
        <Card>
            <CrudTable
                hasSoftDelete
                crudName="Role"
                crudOperationHooks={{
                    useGetMany: useGetManyRole,
                    useDelete: useDeleteRole,
                    useRestore: useRestoreRole,
                    useDeleteForever: useDeleteRoleForever,
                    useBulkDelete: useBulkDeleteRole,
                    useBulkRestore: useBulkRestoreRole,
                    useBulkDeleteForever: useBulkDeleteRoleForever,
                }}
                onEdit={onEdit}
                ref={datatableRef}
                columns={columns}
            />
        </Card>
    )
}

export default RoleListTable
