import { DataTable, DataTableApi, DataTableProps, DEFAULT_EXPANDING_COLUMN_NAME, DEFAULT_SELECTION_COLUMN_NAME, TableFilters, TableState } from '@ackplus/react-tanstack-data-table';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import { DataTableLayoutState, useDataTableState } from '@admin/app/contexts/datatable-state-context';


interface DataGridProps<T> extends Omit<DataTableProps<T>, 'onFetchData'> {
    loading?: boolean;
    onFetchData?: (filters?: Partial<TableState>) => Promise<{ data: T[]; total: number }>;
    stateKey?: string; // Key for localStorage persistence
    defaultHiddenColumns?: string[]; // Columns hidden by default
    onLayoutChange?: (layout: DataTableLayoutState) => void; // Callback when layout changes
}

const DataGrid = forwardRef<DataTableApi<any>, DataGridProps<any>>(
    ({
        columns,
        totalRow = 0,
        idKey,
        onDataStateChange,
        maxHeight = '100%',
        stateKey,
        defaultHiddenColumns,
        onLayoutChange,
        ...props
    }, ref) => {
        const tableRef = useRef<DataTableApi<any>>(null);
        const dataTableStateContext = stateKey ? useDataTableState(stateKey) : null;
        const savedLayout = dataTableStateContext?.layout;
        const isLayoutRestoredRef = useRef(false);
        const isRestoringRef = useRef(false); // Track if we're currently restoring

        // Expose ref to parent
        useImperativeHandle(ref, () => tableRef.current!, []);

        const initialState = useMemo(() => {
            const defaultColumnVisibility: Record<string, boolean> = {};
            (defaultHiddenColumns || []).forEach((col: string) => {
                defaultColumnVisibility[col] = false;
            });

            return {
                columnPinning: {
                    left: [DEFAULT_EXPANDING_COLUMN_NAME, DEFAULT_SELECTION_COLUMN_NAME],
                    right: ['action'],
                },
                pagination: {
                    pageIndex: 0,
                    pageSize: 50,
                },
                columnVisibility: defaultColumnVisibility,
                ...props.initialState,
            };
        }, [props.initialState, defaultHiddenColumns]);

        // Debounced save layout function
        const debouncedSaveLayout = useMemo(
            () =>
                debounce(() => {
                    if (dataTableStateContext && !isRestoringRef.current) {
                        const layout = tableRef.current.layout.saveLayout();
                        console.log('handleColumnChange', layout);

                        // Only save layout properties
                        const layoutOnly: DataTableLayoutState = {
                            columnVisibility: layout.columnVisibility,
                            columnOrder: layout.columnOrder,
                            columnSizing: layout.columnSizing,
                            columnPinning: layout.columnPinning,
                        };
                        dataTableStateContext.saveLayout(layoutOnly);
                        onLayoutChange?.(layout);
                    }
                }, 1000), // 500ms debounce delay
            [dataTableStateContext, onLayoutChange]
        );

        const handleStateChange = useCallback((state: TableFilters) => {
            onDataStateChange?.(state);
            if (stateKey && dataTableStateContext && tableRef.current && !isRestoringRef.current) {
                debouncedSaveLayout();
            }
        }, [onDataStateChange]);

        const handleColumnChange = useCallback(() => {
            if (stateKey && dataTableStateContext && tableRef.current && !isRestoringRef.current) {
                debouncedSaveLayout();
            }
        }, [stateKey, dataTableStateContext, debouncedSaveLayout, isRestoringRef]);

        // Restore layout only once on mount
        useEffect(() => {
            if (savedLayout && !isLayoutRestoredRef.current && tableRef.current) {
                // Small delay to ensure table is fully initialized
                console.log('Restoring layout', savedLayout);
                isRestoringRef.current = true;

                setTimeout(() => {
                    if (tableRef.current) {
                        tableRef.current.layout.restoreLayout(savedLayout);
                        isLayoutRestoredRef.current = true;

                        // Allow saving again after restoration is complete
                        setTimeout(() => {
                            isRestoringRef.current = false;
                        }, 100);
                    }
                }, 100);
            }
        }, []); // Empty deps - only run once on mount
        // Cleanup debounce on unmount
        useEffect(() => {
            console.log({ debouncedSaveLayout });
            return () => {

                debouncedSaveLayout.cancel();
            };
        }, [debouncedSaveLayout]);

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
                maxHeight={maxHeight}
                enableStripes
                onDataStateChange={handleStateChange}
                {...props}
                onColumnVisibilityChange={handleColumnChange}
                onColumnDragEnd={handleColumnChange}
                onColumnPinningChange={handleColumnChange}
                onColumnSizingChange={handleColumnChange}
                initialState={initialState}
                slotProps={{
                    pagination: {
                        rowsPerPageOptions: [
                            10,
                            25,
                            50,
                            100,
                            200,
                        ],
                    },
                    toolbar: {
                        sx: {
                            minHeight: '48px !important',
                        },
                    },
                    ...props.slotProps,
                }}
            />
        );
    },
);

export default DataGrid;
