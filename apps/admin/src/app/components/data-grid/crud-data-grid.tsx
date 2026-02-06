import React, { forwardRef, useCallback, useMemo, useRef, useImperativeHandle, useState } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { QueryBuilder } from '@ackplus/nest-crud-request';
import { DataTableApi, DataTableProps, TableFilters, TableState } from '@ackplus/react-tanstack-data-table';

import { useCrudOperations } from '@libs/react-shared';
import { useToasty } from '@admin/app/hook';
import { useConfirm } from '@admin/app/contexts';
import { useDataTableState } from '@admin/app/contexts/datatable-state-context';
import { HEADER } from '@admin/app/layout/config';
import { PermissionsEnum } from '@libs/types';

import DataGrid from './data-grid';
import { useUpdateEffect } from './hooks/use-update-effect';
import { useServerQueryBuilder } from './hooks/use-server-query-builder';
import { useExportToasts } from './hooks/use-export-toasts';
import { useCrudTableActions } from './hooks/use-crud-table-actions';

import { TableAction, TableActionMenu, TableActionMenuProps, TableBulkActionMenu } from '../data-table';

export interface CrudDataGridProps<T>
    extends Partial<Omit<DataTableProps<T>, 'data' | 'ref' | 'onFetchData' | 'bulkActions' | 'onRowClick'>> {
    crudOperationHooks: {
        fetchMany: any;
    } & Partial<
        Pick<
            ReturnType<typeof useCrudOperations>,
            | 'useBulkDelete'
            | 'useBulkDeleteForever'
            | 'useDelete'
            | 'useDeleteForever'
            | 'useBulkRestore'
            | 'useRestore'
        >
    >;
    crudName: string;
    hasSoftDelete?: boolean;

    stateKey?: string;
    defaultHiddenColumns?: string[];

    onView?: (row: Partial<T>) => void;
    onRowClick?: (row: Partial<T>) => void;
    onEdit?: (row: Partial<T>) => void;

    bulkActions?: (rowIds: string[]) => TableAction[];
    onAction?: (
        type:
            | 'created'
            | 'updated'
            | 'deleted'
            | 'restored'
            | 'deleteForever'
            | 'bulkDelete'
            | 'bulkRestore'
            | 'bulkDeleteRestore',
    ) => void;

    onToggleTrashData?: (checked: boolean) => void;

    tableActionMenuProps?: (row?: any) => TableActionMenuProps;

    dataTableApiRequestMap?: (queryBuilder?: QueryBuilder, filter?: Partial<TableState>) => Promise<QueryBuilder> | QueryBuilder;

    onFetchData?: (queryBuilder?: QueryBuilder, filters?: Partial<TableState>) => Promise<{ data: T[]; total: number }>;

    permissionsKey?: {
        delete?: PermissionsEnum;
        deleteForever?: PermissionsEnum;
        restore?: PermissionsEnum;
        edit?: PermissionsEnum;
        view?: PermissionsEnum;
    };
}

function CrudDataGridInner<T>(
    {
        crudOperationHooks,
        idKey = 'id' as keyof T,
        crudName,
        hasSoftDelete,
        stateKey,
        defaultHiddenColumns,
        onEdit,
        onView,
        onRowClick,
        bulkActions,
        extraFilter,
        columns: userColumns = [],
        dataTableApiRequestMap,
        onAction,
        onToggleTrashData,
        tableActionMenuProps,
        onFetchData,
        maxHeight,
        initialState,
        permissionsKey,
        ...props
    }: CrudDataGridProps<T>,
    ref: React.Ref<DataTableApi<T>>,
) {
    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();
    const datatableRef = useRef<DataTableApi<any>>(null);

    // expose table api
    useImperativeHandle(ref, () => datatableRef.current, []);

    // state persistence (sessionStorage now)
    const ctx = stateKey ? useDataTableState(stateKey) : null;
    const cached = ctx?.state;

    const [isTrash, setIsTrash] = useState<boolean>(cached?.showDeleted || false);

    // CRUD hooks
    const {
        fetchMany,
        useDelete,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkRestore,
        useBulkDeleteForever,
    } = crudOperationHooks;

    const { mutateAsync: deleteItem } = useDelete?.() || ({} as any);
    const { mutateAsync: restoreItem } = useRestore?.() || ({} as any);
    const { mutateAsync: deleteForeverItem } = useDeleteForever?.() || ({} as any);
    const { mutateAsync: bulkDeleteItems } = useBulkDelete?.() || ({} as any);
    const { mutateAsync: bulkRestoreItems } = useBulkRestore?.() || ({} as any);
    const { mutateAsync: bulkDeleteForeverItems } = useBulkDeleteForever?.() || ({} as any);

    const crudActions = useCrudTableActions({
        crudName,
        confirmDialog,
        showToasty,
        datatableRef,
        onAction,
        deleteItem,
        restoreItem,
        deleteForeverItem,
        bulkDeleteItems,
        bulkRestoreItems,
        bulkDeleteForeverItems,
    });

    const handleChangeSoftDelete = useCallback(
        (_e: any, checked: boolean) => {
            onToggleTrashData?.(checked);
            setIsTrash(checked);

            if (stateKey && ctx) {
                ctx.setState({ showDeleted: checked });
            }
        },
        [onToggleTrashData, stateKey, ctx],
    );

    // reload when trash changed
    useUpdateEffect(() => {
        datatableRef.current?.selection?.deselectAll?.();
        datatableRef.current?.data?.reload?.();
    }, [isTrash]);

    // build columns (append action)
    const columns = useMemo(() => {
        return [
            ...userColumns,
            {
                id: 'action',
                header: 'Action',
                enablePinning: false,
                enableHiding: false,
                enableResizing: false,
                hideInExport: true,
                maxSize: 120,
                size: 80,
                cell: ({ row }: any) => (
                    <TableActionMenu
                        permissionsKeys={permissionsKey}
                        {...((row.original as any).deletedAt
                            ? {
                                onDeleteForever: () => crudActions.handleDeleteForever(row.original),
                                onRestore: () => crudActions.handleRestore(row.original),
                            }
                            : {
                                onDelete: () => crudActions.handleDelete(row.original),
                            })}
                        {...(onEdit && !(row.original as any)?.deletedAt && {
                            onEdit: () => onEdit(row.original),
                        })}
                        {...(onView && !(row.original as any)?.deletedAt && {
                            onView: () => onView(row.original),
                        })}
                        {...tableActionMenuProps?.(row.original)}
                    />
                ),
            },
        ];
    }, [userColumns, permissionsKey, crudActions, onEdit, onView, tableActionMenuProps]);

    // server fetch builder
    const { fetchData } = useServerQueryBuilder<T>({
        columns,
        fetchMany,
        onFetchData: onFetchData
            ? async (qb, filters) => onFetchData(qb, filters)
            : undefined,
        mapQuery: dataTableApiRequestMap
            ? async (qb, filters) => dataTableApiRequestMap(qb, filters)
            : undefined,
        isTrash,
    });

    const handleServerExportData = useCallback(
        async (filters?: Partial<TableFilters>) => {
            if (filters) delete (filters as any).pagination;
            return fetchData(filters as any);
        },
        [fetchData],
    );

    const { onExportProgress, onExportComplete, onExportError } = useExportToasts(showToasty);

    // save table session state (sorting/pagination/globalFilter/columnFilter)
    const handleTableStateChange = useCallback(
        (state: Partial<TableState>) => {
            console.log('state', state);
            if (!stateKey || !ctx) return;
            ctx.setState({
                sorting: state.sorting,
                pagination: state.pagination,
                globalFilter: state.globalFilter,
                columnFilter: state.columnFilter,
            });
        },
        [stateKey, ctx],
    );

    // merge cached state into initialState
    const mergedInitialState = useMemo(() => {
        const base = initialState || {};
        if (!cached) return base;

        return {
            ...base,
            ...(cached.sorting && { sorting: cached.sorting }),
            ...(cached.pagination && { pagination: cached.pagination }),
            ...(cached.globalFilter && { globalFilter: cached.globalFilter }),
            ...(cached.columnFilter && { columnFilter: cached.columnFilter }),
        };
    }, [cached, initialState]);

    // row click adapter
    const adaptedOnRowClick = useMemo(() => {
        if (!onRowClick) return undefined;
        return (_event: any, row: any) => onRowClick(row.original);
    }, [onRowClick]);

    return (
        <DataGrid
            idKey={idKey}
            ref={datatableRef}
            stateKey={stateKey}
            defaultHiddenColumns={defaultHiddenColumns}
            onFetchData={fetchData}
            initialLoadData
            dataMode="server"
            extraFilter={extraFilter}
            maxHeight={maxHeight || `calc(100svh - ${HEADER.H_DESKTOP}px  - ${230}px)`}
            footerFilter={
                hasSoftDelete ? (
                    <FormControlLabel
                        control={<Switch checked={isTrash} onChange={handleChangeSoftDelete} />}
                        label="Show Deleted"
                        slotProps={{ typography: { noWrap: true } }}
                    />
                ) : null
            }
            columns={columns as any}
            enableBulkActions
            bulkActions={(selectedState: any) => {
                const ids: string[] = selectedState.ids;

                return (
                    <TableBulkActionMenu
                        permissionsKeys={permissionsKey}
                        {...(hasSoftDelete && isTrash
                            ? {
                                onRestore: () => crudActions.handleBulkRestore(ids),
                                onDeleteForever: () => crudActions.handleBulkDeleteForever(ids),
                            }
                            : {
                                onDelete: () => crudActions.handleBulkDelete(ids),
                            })}
                        actions={bulkActions?.(ids) || []}
                    />
                );
            }}
            enableExport
            onExportProgress={onExportProgress}
            onExportComplete={onExportComplete}
            onExportError={onExportError}
            onServerExport={handleServerExportData}
            enablePagination
            enableRowSelection
            enableRefresh
            enableStickyHeaderOrFooter
            initialState={mergedInitialState}
            onRowClick={adaptedOnRowClick}
            onDataStateChange={handleTableStateChange}
            {...props}
        />
    );
}

export const CrudDataGrid = forwardRef(CrudDataGridInner) as <T>(
    props: CrudDataGridProps<T> & { ref?: React.Ref<DataTableApi<T>> },
) => React.ReactElement;

export default CrudDataGrid;
