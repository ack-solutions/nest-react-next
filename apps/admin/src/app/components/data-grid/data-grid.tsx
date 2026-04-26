import {
    DataTable,
    DataTableApi,
    DataTableProps,
} from '@ackplus/react-tanstack-data-table';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useDataTablePersistence } from './hooks/use-data-table-persistence';

interface DataGridProps<T> extends DataTableProps<T> {
    stateKey?: string;
    defaultHiddenColumns?: string[];
}

const DataGrid = forwardRef<DataTableApi<any>, DataGridProps<any>>(
    (
        {
            columns,
            totalRow = 0,
            idKey,
            maxHeight = '100%',
            stateKey,
            defaultHiddenColumns,
            onDataStateChange,
            initialState: initialStateProp,
            ...props
        },
        ref,
    ) => {
        const tableRef = useRef<DataTableApi<any>>(null);
        useImperativeHandle(ref, () => tableRef.current!, []);

        const { initialState, handleTableStateChange, handleLayoutChange } =
            useDataTablePersistence({
                stateKey,
                tableRef,
                defaultHiddenColumns,
                initialState: initialStateProp,
                onDataStateChange,
            });
        const mergedSlotProps = useMemo(() => {
            return {
                pagination: { rowsPerPageOptions: [10, 50, 100, 500, 1000] },
                toolbar: { sx: { minHeight: '48px !important' } },
                ...props.slotProps,
            };
        }, [props.slotProps]);

        return (
            <DataTable
                ref={tableRef}
                columns={columns}
                idKey={idKey}
                totalRow={totalRow}
                enableStickyHeaderOrFooter
                enableColumnDragging
                enableGlobalFilter
                enableColumnFilter
                enableSorting
                enableHover
                enableColumnResizing
                enableColumnPinning
                enableStripes
                maxHeight={maxHeight}
                onDataStateChange={handleTableStateChange}
                onColumnVisibilityChange={handleLayoutChange}
                onColumnDragEnd={handleLayoutChange}
                onColumnPinningChange={handleLayoutChange}
                onColumnSizingChange={handleLayoutChange}
                initialState={initialState}
                skeletonRows={10}
                {...props}
                slotProps={mergedSlotProps}
            />
        );
    },
);

export default DataGrid;
