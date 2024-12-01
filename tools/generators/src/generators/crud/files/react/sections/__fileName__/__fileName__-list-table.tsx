import { useState, useCallback, useRef, MutableRefObject } from 'react';
import {
    DataTable,
    DataTableColumn,
    DataTableHandle,
    TableActionMenu,
} from '@admin/app/components';
import { I<%= className %> } from '@libs/types';
import { use<%= className %> } from '@libs/react-core';
import { useForkRef } from '@mui/material';

export interface <%= className %>ListTableProps {
    datatableRef?: MutableRefObject<DataTableHandle>,
    onEdit: (updatedValue: Partial<I<%= className %>>) => void,
    onDelete: (item: I<%= className %>) => void,
}

export default function <%= className %>ListTable({
    datatableRef: parentComponentDatatableRef,
    onEdit,
    onDelete,
}: <%= className %>ListTableProps) {

    const [dataTableFilters, setDataTableFilters] = useState(null);
    const datatableRef = useRef<DataTableHandle>(null);
    const handleDatatableRef = useForkRef(parentComponentDatatableRef, datatableRef)

    const { useGetMany<%= className %> } = use<%= className %>();

    const { data } = useGetMany<%= className %>(dataTableFilters, {
        enabled: Boolean(dataTableFilters),
    });

    const handleDataTableChange = useCallback((filters) => {
        // Manage filters mapping here.
        setDataTableFilters(filters);
    }, []);

    const columns: DataTableColumn<I<%= className %>>[] = [
         <% columns.forEach(column => { %>{
            name: <%= column.normalizeName.propertyName %>,
            label: <%= column.normalizeName.name %>,
        },<% }) %>
        {
            name: 'action',
            label: 'Action',
            render: (row) => (
                <TableActionMenu
                    row={row}
                    onDelete={() => onDelete(row)}
                    onEdit={() => onEdit(row)}
                />
            ),
        },
    ];

    return (
        <DataTable
            initialLoading
            ref={handleDatatableRef}
            data={data?.items}
            columns={columns}
            totalRow={data?.total}
            defaultOrderBy="createdAt"
            onChange={handleDataTableChange}
        />
    );
}
