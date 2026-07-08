import React, {
    forwardRef,
    useCallback,
    useMemo,
    useRef,
    useImperativeHandle,
    useState,
} from 'react';
import { FormControlLabel, Switch } from '@mui/material';
import { QueryBuilder } from '@ackplus/nest-crud-request';
import {
    DataTable,
    DataTableApi,
    DataTableProps,
    ExportRequest,
    TableFilters,
    TableState,
} from '@ackplus/mui-tanstack-data-grid';

import { useCrudOperations } from '@libs/react-shared';
import { useToasty } from '../../hook';
import { useConfirm } from '../../contexts';
import { useDataTableState } from './context/datatable-state-context';
import { HEADER } from '../../layout/config';
import { IFindOptions, PermissionsEnum } from '@libs/types';

import { useLatestRef } from './hooks/use-latest-ref';
import { useExportToasts } from './hooks/use-export-toasts';
import { useCrudTableActions } from './hooks/use-crud-table-actions';

import { UseQueryResult } from '@tanstack/react-query';
import { buildQBFromTableState } from './utils';
import { useDataTablePersistence } from './hooks/use-data-table-persistence';
import _ from 'lodash';
import { TableActionMenu } from './components/table-action-menu';
import { TableBulkActionMenu } from './components/table-bulk-action-menu';
import { TableAction, TableActionMenuProps } from './components/table-action-menu';

export interface CrudDataGridProps<T>
    extends Partial<
        Omit<
            DataTableProps<T>,
            'data' | 'ref' | 'onFetchData' | 'bulkActions' | 'onRowClick'
        >
    > {
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

    /** Receives selected ids and optional context (e.g. isTrash). Return custom bulk actions; when isTrash is true you may return [] or custom actions for deleted data. */
    bulkActions?: (
        rowIds: string[],
        context?: { isTrash?: boolean },
    ) => TableAction[];
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

    /** Receives row and optional context (e.g. isDeleted). Return custom menu props; when isDeleted you may return { actions: [] } or custom actions for deleted rows. */
    tableActionMenuProps?: (
        row?: any,
        context?: { isDeleted?: boolean },
    ) => TableActionMenuProps;

    dataTableApiRequestMap?: (
        queryBuilder?: QueryBuilder,
        filter?: Partial<TableState>,
    ) => Promise<QueryBuilder> | QueryBuilder;

    onFetchData?: (
        queryBuilder?: QueryBuilder,
        filters?: Partial<TableState>,
    ) => Promise<{ data: T[]; total: number }>;

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
        initialState: initialStateProp,
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
    const [queryObj, setQueryObj] = useState<IFindOptions | undefined>(
        undefined,
    );
    const [isTrash, setIsTrash] = useState<boolean>(
        cached?.showDeleted || false,
    );
    const mappedFiltersRef = useRef<Partial<TableFilters> | undefined>(
        undefined,
    );
    const queryBuildSeqRef = useRef(0);
    const queryObjKeyRef = useRef('');
    const persistedTableStateKeyRef = useRef(
        JSON.stringify({
            sorting: cached?.sorting,
            pagination: cached?.pagination,
            globalFilter: cached?.globalFilter,
            columnFilter: cached?.columnFilter,
        }),
    );

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
    const { mutateAsync: deleteForeverItem } =
        useDeleteForever?.() || ({} as any);
    const { mutateAsync: bulkDeleteItems } = useBulkDelete?.() || ({} as any);
    const { mutateAsync: bulkRestoreItems } = useBulkRestore?.() || ({} as any);
    const { mutateAsync: bulkDeleteForeverItems } =
        useBulkDeleteForever?.() || ({} as any);

    const mapQueryRef = useLatestRef(dataTableApiRequestMap);
    const isTrashRef = useLatestRef(isTrash);
    const columnsRef = useLatestRef(initialColumns);
    const { data, refetch, isFetching }: UseQueryResult<any, any> = useGetMany(
        queryObj,
        {
            enabled: !!queryObj,
            placeholderData: (prev) => {
                console.log('placeholderData', _.cloneDeep(prev))
                return prev;
            }
        },
    );
    const { initialState, handleTableStateChange, handleLayoutChange } =
        useDataTablePersistence({
            stateKey,
            tableRef: datatableRef,
            defaultHiddenColumns,
            initialState: initialStateProp,
            onDataStateChange: (state) => {
                if (!stateKey || !ctx) return;
                const nextState = {
                    sorting: state.sorting,
                    pagination: state.pagination,
                    globalFilter: state.globalFilter,
                    columnFilter: state.columnFilter,
                };
                const nextPersistKey = JSON.stringify(nextState);

                if (nextPersistKey === persistedTableStateKeyRef.current) {
                    return;
                }

                persistedTableStateKeyRef.current = nextPersistKey;
                ctx.setState(nextState);
            },
        });


    const {
        handleDelete,
        handleRestore,
        handleDeleteForever,
        handleBulkDelete,
        handleBulkRestore,
        handleBulkDeleteForever,
    } = useCrudTableActions({
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
                cell: ({ row }: any) => {
                    const isDeleted = !!(row.original as any).deletedAt;
                    return (
                        <TableActionMenu
                            permissionsKeys={permissionsKey}
                            {...(isDeleted
                                ? {
                                    onDeleteForever: () =>
                                        handleDeleteForever(row.original),
                                    onRestore: () =>
                                        handleRestore(row.original),
                                }
                                : {
                                    onDelete: () =>
                                        handleDelete(row.original),
                                })}
                            {...(onEdit &&
                                !isDeleted && {
                                onEdit: () => onEdit(row.original),
                            })}
                            {...(onView &&
                                !isDeleted && {
                                onView: () => onView(row.original),
                            })}
                            {...tableActionMenuProps?.(row.original, {
                                isDeleted,
                            })}
                        />
                    );
                },
            },
        ];
    }, [
        handleDelete,
        handleDeleteForever,
        handleRestore,
        initialColumns,
        onEdit,
        onView,
        permissionsKey,
        tableActionMenuProps,
    ]);

    const handleQueryObjectChange = useCallback(
        async (params: {
            filters?: Partial<TableFilters>;
            isTrash?: boolean;
        }) => {
            const buildId = queryBuildSeqRef.current + 1;
            queryBuildSeqRef.current = buildId;

            const qb = await buildQBFromTableState({
                columns: columnsRef.current,
                filters: params.filters,
                isTrash: params.isTrash ?? false,
                mapQuery: mapQueryRef.current
                    ? async (queryBuilder, filters) => {
                        const mapQuery = mapQueryRef.current;
                        return mapQuery
                            ? mapQuery(queryBuilder, filters)
                            : queryBuilder;
                    }
                    : undefined,
            });

            if (buildId !== queryBuildSeqRef.current) {
                return;
            }

            const nextQueryObj = qb.toObject() as IFindOptions;
            const nextQueryKey = JSON.stringify(nextQueryObj || {});

            if (nextQueryKey === queryObjKeyRef.current) {
                return;
            }

            queryObjKeyRef.current = nextQueryKey;
            setQueryObj(nextQueryObj);
        },
        [columnsRef, mapQueryRef],
    );

    const handleChangeSoftDelete = useCallback(
        (_e: any, checked: boolean) => {
            onToggleTrashData?.(checked);
            setIsTrash(checked);
            datatableRef.current?.selection?.deselectAll?.();
            if (stateKey && ctx) {
                ctx.setState({ showDeleted: checked });
            }
            void handleQueryObjectChange({
                filters: mappedFiltersRef.current,
                isTrash: checked,
            });
        },
        [onToggleTrashData, stateKey, ctx, handleQueryObjectChange],
    );

    const handleServerExportData = useCallback(
        async (request: ExportRequest, _signal?: AbortSignal) => {
            // v2 grid passes an ExportRequest descriptor instead of raw filters.
            // Rebuild the TableState-shaped filters (global + column + sort) it carries,
            // without pagination so the export covers all matching rows.
            const filters = {
                ...((request?.filters as Partial<TableFilters>) ?? {}),
                sorting: request?.sorting,
            } as Partial<TableFilters>;
            const qb = await buildQBFromTableState({
                columns: columnsRef.current,
                filters,
                isTrash: isTrashRef.current,
                mapQuery: mapQueryRef.current
                    ? async (queryBuilder, currentFilters) => {
                        const mapQuery = mapQueryRef.current;
                        return mapQuery
                            ? mapQuery(queryBuilder, currentFilters)
                            : queryBuilder;
                    }
                    : undefined,
            });

            if (onFetchData) {
                return onFetchData(qb, filters as Partial<TableState>);
            }

            const q = fetchMany
                ? await fetchMany(qb.toObject() as IFindOptions)
                : null;
            return {
                data: (q?.items || []) as T[],
                total: q?.total || 0,
            };
        },
        [columnsRef, fetchMany, isTrashRef, mapQueryRef, onFetchData],
    );

    const { onExportProgress, onExportComplete, onExportError, onCancelExport } = useExportToasts(showToasty);

    const handleFetchRequestGeneration = useCallback(
        (filters: Partial<TableFilters>) => {
            console.log('handleFetchRequestGeneration', filters?.pagination)
            mappedFiltersRef.current = filters;
            handleQueryObjectChange({
                filters,
                isTrash: isTrashRef.current,
            });
        },
        [handleQueryObjectChange, isTrashRef],
    );

    const renderBulkActions = useCallback(
        (selectedState: any) => {
            const ids: string[] = selectedState.ids;
            const showOnlyTrashActions = hasSoftDelete && isTrash;

            return (
                <TableBulkActionMenu
                    permissionsKeys={permissionsKey}
                    {...(showOnlyTrashActions
                        ? {
                            onRestore: () => handleBulkRestore(ids),
                            onDeleteForever: () =>
                                handleBulkDeleteForever(ids),
                        }
                        : {
                            onDelete: () => handleBulkDelete(ids),
                        })}
                    actions={bulkActions?.(ids, { isTrash }) ?? []}
                />
            );
        },
        [
            bulkActions,
            handleBulkDelete,
            handleBulkDeleteForever,
            handleBulkRestore,
            hasSoftDelete,
            isTrash,
            permissionsKey,
        ],
    );

    const toolbarRefresh = useCallback(() => {
        refetch();
        (props.slotProps?.toolbar?.refreshButton as any)?.onRefresh?.();
    }, [props.slotProps, refetch]);

    const mergedSlotProps = useMemo(() => {
        return {
            pagination: { rowsPerPageOptions: [10, 50, 100, 500, 1000] },
            ...props.slotProps,
            toolbar: {
                toolbar: { sx: { minHeight: '48px !important' } },
                ...props.slotProps?.toolbar,
                refreshButton: {
                    ...props.slotProps?.toolbar?.refreshButton,
                    onRefresh: toolbarRefresh,
                },
            },
        };
    }, [props.slotProps, toolbarRefresh]);


    return (
        <DataTable
            apiRef={datatableRef}
            idKey={idKey}
            data={data?.items ?? []}
            totalRow={data?.total ?? 0}
            columns={columns}
            loading={isFetching}
            dataMode="server"
            stateKey={stateKey}
            onFetchStateChange={(request: Partial<TableState>) => {
                handleFetchRequestGeneration(request as Partial<TableFilters>)
            }}
            onDataStateChange={handleTableStateChange}
            // onColumnVisibilityChange={handleLayoutChange}
            // onColumnDragEnd={handleLayoutChange}
            // onColumnPinningChange={handleLayoutChange}
            // onColumnSizingChange={handleLayoutChange}
            onRowClick={adaptedOnRowClick}

            enableStickyHeaderOrFooter
            enablePagination
            enableRowSelection
            enableRefresh
            enableColumnDragging
            enableGlobalFilter
            enableColumnFilter
            enableSorting
            enableHover
            enableColumnResizing
            enableColumnPinning
            enableBulkActions
            enableStripes

            enableExport
            onExportProgress={onExportProgress}
            onExportComplete={onExportComplete}
            onExportError={onExportError}
            onExportCancel={onCancelExport}
            onServerExport={handleServerExportData}

            initialState={mergedInitialState}
            bulkActions={renderBulkActions}
            maxHeight={maxHeight || `calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
            skeletonRows={10}
            extraFilter={extraFilter}
            footerFilter={
                hasSoftDelete ? (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isTrash}
                                onChange={handleChangeSoftDelete}
                            />
                        }
                        label="Show Deleted"
                        slotProps={{ typography: { noWrap: true } }}
                    />
                ) : null
            }
            {...props}
            slotProps={mergedSlotProps}
        />
    );
}

export const CrudDataGrid = forwardRef(CrudDataGridInner) as unknown as <T>(
    props: CrudDataGridProps<T> & { ref?: React.Ref<DataTableApi<T>> },
) => React.ReactElement;

export default CrudDataGrid;
