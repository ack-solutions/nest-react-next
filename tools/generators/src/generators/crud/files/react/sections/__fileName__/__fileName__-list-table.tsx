import { useState, useCallback, useRef, MutableRefObject } from 'react';
import {
    DataTableColumn,
    DataTableHandle,
} from '@admin/app/components';
import { I<%= className %> } from '@libs/types';
import { use<%= className %> } from '@libs/react-core';
import { Tabs, Tab, Card, Divider } from '@mui/material';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table';

export interface <%= className %>ListTableProps {
    datatableRef?: MutableRefObject<DataTableHandle>;
    onEdit?: (row: I<%= className %>) => void
}

const filterTabs = [
    {
        label: 'All',
        value: 'all'
    },
]

export interface <%= className %>ListFilters {
    status?: string;
}


export default function <%= className %>ListTable({
    onEdit
}: <%= className %>ListTableProps) {

    const [customFilters, setCustomFilters] = useState<<%= className %>ListFilters>({
        status: 'all'
    });
    const datatableRef = useRef<CrudTableActions>(null);

    const { useGetMany<%= className %>, useDelete<%= className %>, useRestore<%= className %>, useDeleteForever<%= className %>, useBulkDelete<%= className %>, useBulkRestore<%= className %>, useBulkDeleteForever<%= className %> } = use<%= className %>();


    const handleTabChange = useCallback(
        (_event, value) => {
            setCustomFilters((state) => ({
                status: value,
            }))
            datatableRef.current.applyFilters((state) => ({
                ...state,
                status: value,
            }))
        },
        [],
    )

    const columns: DataTableColumn<I<%= className %>>[] = [
       <% columns.forEach(column => { %>{
            name: '<%= column.normalizeName.propertyName %>',
            label: '<%= column.normalizeName.name %>',
        },<% }) %>
    ];

    return (
        <Card>
            <Tabs
                value={customFilters?.status}
                onChange={handleTabChange}
                sx={{ px: 3 }}
            >
                {filterTabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        iconPosition="end"
                        value={tab.value}
                        label={tab.label}
                        disableRipple
                    // icon={
                    //     <Label
                    //         variant={tab.value === customFilters?.status ? 'filled' : 'soft'}
                    //         color={'default'}
                    //     >
                    //         {data?.total}
                    //     </Label>
                    // }
                    />
                ))}
            </Tabs>
            <Divider />
            <CrudTable
                hasSoftDelete
                crudName="<%= className %>"
                crudOperationHooks={{
                    useGetMany: useGetMany<%= className %>,
                    useDelete: useDelete<%= className %>,
                    useRestore: useRestore<%= className %>,
                    useDeleteForever: useDeleteForever<%= className %>,
                    useBulkDelete: useBulkDelete<%= className %>,
                    useBulkRestore: useBulkRestore<%= className %>,
                    useBulkDeleteForever: useBulkDeleteForever<%= className %>
                }}
                onEdit={onEdit}
                ref={datatableRef}
                columns={columns}
            />
        </Card>
    );
}
