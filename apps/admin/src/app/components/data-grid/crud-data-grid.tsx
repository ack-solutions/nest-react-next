import React, { forwardRef, useCallback, useMemo, useRef, useImperativeHandle, useState, useEffect } from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { QueryBuilder } from '@ackplus/nest-crud-request';
import { DataFetchMeta, DataTableApi, DataTableProps, TableFilters, TableState } from '@ackplus/react-tanstack-data-table';

import { useCrudOperations } from '@libs/react-shared';
import { useToasty } from '@admin/app/hook';
import { useConfirm } from '@admin/app/contexts';
import { useDataTableState } from '@admin/app/contexts/datatable-state-context';
import { HEADER } from '@admin/app/layout/config';
import { IFindOptions, PermissionsEnum } from '@libs/types';

import DataGrid from './data-grid';
import { useExportToasts } from './hooks/use-export-toasts';
import { useCrudTableActions } from './hooks/use-crud-table-actions';

import { TableAction, TableActionMenu, TableActionMenuProps, TableBulkActionMenu } from '../data-table';
import { buildQBFromTableState } from './ table-to-qb';
import { UseQueryResult } from '@tanstack/react-query';
import { useLatestRef } from './hooks/use-latest-ref';

export interface CrudDataGridProps<T>
    extends Partial<Omit<DataTableProps<T>, 'data' | 'ref' | 'onFetchData' | 'bulkActions' | 'onRowClick'>> {
    crudOperationHooks: {
        useGetMany: any;
    } & Partial<
        Pick<
            ReturnType<typeof useCrudOperations>,
            | 'fetchMany'
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
        columns: initialColumns = [],
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
    const { showToasty, dismissToasty } = useToasty();
    const confirmDialog = useConfirm();
    const datatableRef = useRef<DataTableApi<any>>(null);

    // expose table api
    useImperativeHandle(ref, () => datatableRef.current, []);

    // state persistence (sessionStorage now)
    const ctx = stateKey ? useDataTableState(stateKey) : null;
    const cached = ctx?.state;

    const [isTrash, setIsTrash] = useState<boolean>(cached?.showDeleted || false);
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState<number>(0);

    // CRUD hooks
    const {
        fetchMany,
        useGetMany,
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

    const [mappedQuery, setMappedQuery] = useState<QueryBuilder | undefined>(undefined);
    const mapQueryRef = useLatestRef(dataTableApiRequestMap);

    const queryObj = useMemo(
        () => mappedQuery?.toObject() as IFindOptions | undefined,
        [mappedQuery]
    );

    const { data, error, isSuccess, refetch, isFetching, ...q }: UseQueryResult<any, any> = useGetMany(queryObj, {
        enabled: !!queryObj,
    });

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

    // build columns (append action)
    const columns = useMemo(() => {
        return [
            ...initialColumns,
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
    }, [initialColumns, permissionsKey, crudActions, onEdit, onView, tableActionMenuProps]);

    // server fetch builder
    // const { fetchData } = useServerQueryBuilder<T>({
    //     columns,
    //     fetchMany,
    //     onFetchData: onFetchData
    //         ? async (qb, filters) => onFetchData(qb, filters)
    //         : undefined,
    //     mapQuery: dataTableApiRequestMap
    //         ? async (qb, filters) => dataTableApiRequestMap(qb, filters)
    //         : undefined,
    //     isTrash,
    // });

    const handleChangeSoftDelete = useCallback(
        (_e: any, checked: boolean) => {
            onToggleTrashData?.(checked);
            setIsTrash(checked);

            if (stateKey && ctx) {
                ctx.setState({ showDeleted: checked });
            }
            setMappedQuery((prev) => {
                if (!prev) return prev;
                const next = new QueryBuilder(prev.toObject());
                next.setOnlyDeleted(checked);
                return next;
            });
        },
        [onToggleTrashData, stateKey, ctx, mappedQuery],
    );

    const handleServerExportData = useCallback(
        async (filters?: Partial<TableFilters>) => {
            // return fetchData(filters as any);
            const qb = await buildQBFromTableState({
                columns: initialColumns,
                filters,
                isTrash,
                mapQuery: mapQueryRef.current
                    ? async (qb, f) => mapQueryRef.current!(qb, f)
                    : undefined,
            });

            const q = await fetchMany(qb.toObject() as IFindOptions);
            return {
                data: q?.items || [],
                total: q?.total || 0,
            };
        },
        [],
    );

    const { onExportProgress, onExportComplete, onExportError, onCancelExport } = useExportToasts({ showToasty, dismissToasty });


    const handleFetchRequestGeneration = useCallback(
        async (filters: Partial<TableFilters>, meta?: DataFetchMeta) => {
            const qb = await buildQBFromTableState({
                columns: initialColumns,
                filters,
                isTrash,
                mapQuery: mapQueryRef.current
                    ? async (qb, f) => mapQueryRef.current!(qb, f)
                    : undefined,
            });
            setMappedQuery(qb);
        },
        [initialColumns, isTrash, mapQueryRef],
    );
    // save table session state (sorting/pagination/globalFilter/columnFilter)
    const handleTableStateChange = useCallback(
        (state: Partial<TableState>) => {
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

    useEffect(() => {
        if (!isSuccess) {
            setRows(data?.items || []);
            setTotal(data?.total || 0);
            return;
        }
        if (data) {
            setRows(data?.items || []);
            setTotal(data?.total || 0);
        }
    }, [data]);
    return (
        <DataGrid
            idKey={idKey as keyof T}
            data={rows}
            totalRow={total}
            loading={isFetching}
            ref={datatableRef}
            stateKey={stateKey}
            defaultHiddenColumns={defaultHiddenColumns}
            // onFetchData={fetchData}
            onFetchStateChange={handleFetchRequestGeneration}
            initialLoadData
            dataMode="server"
            extraFilter={extraFilter}
            maxHeight={maxHeight || `calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
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
            onExportCancel={onCancelExport}
            onServerExport={handleServerExportData}

            enablePagination
            enableRowSelection
            enableRefresh
            enableStickyHeaderOrFooter
            initialState={mergedInitialState}
            onRowClick={adaptedOnRowClick}
            onDataStateChange={handleTableStateChange}
            slotProps={{
                toolbar: {
                    refreshButtonProps: {
                        loading: isFetching,
                        showSpinnerWhileLoading: true,
                        onRefresh: () => {
                            refetch();
                        }
                    }
                }
            }}
            {...props}
        />
    );
}

export const CrudDataGrid = forwardRef(CrudDataGridInner) as unknown as <T>(
    props: CrudDataGridProps<T> & { ref?: React.Ref<DataTableApi<T>> },
) => React.ReactElement;

export default CrudDataGrid;
