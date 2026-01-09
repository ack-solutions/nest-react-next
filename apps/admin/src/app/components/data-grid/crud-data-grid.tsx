import { OrderDirectionEnum, QueryBuilder } from '@ackplus/nest-crud-request';
import { DataTableApi, DataTableProps, TableFilters, TableState } from '@ackplus/react-tanstack-data-table';
import { errorMessage } from '@libs/utils';
import { FormControlLabel, Switch } from '@mui/material';
import React, {
    useCallback,
    useRef,
    useMemo,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { useCrudOperations } from '@libs/react-shared';
import { TableAction, TableActionMenu, TableActionMenuProps, TableBulkActionMenu } from '../data-table';
import { useBoolean, useToasty } from '@admin/app/hook';
import { useConfirm } from '@admin/app/contexts';
import { useHasPermission } from '@ackplus/nest-auth-react';
import { useDataTableState } from '@admin/app/contexts/datatable-state-context';
import DataGrid from './data-grid';
import { HEADER } from '@admin/app/layout/config';
import { useEffectAfter } from '@admin/app/hook/use-effect-after';
import { PermissionsEnum } from '@libs/types';


export interface CrudDataGridProps<T> extends Partial<Omit<DataTableProps<T>, 'data' | 'ref' | 'onFetchData' | 'bulkActions' | 'onRowClick'>> {
    crudOperationHooks: {
        fetchMany: any;
    } & Partial<Pick<
        ReturnType<typeof useCrudOperations>,
        | 'useBulkDelete'
        | 'useBulkDeleteForever'
        | 'useDelete'
        | 'useDeleteForever'
        | 'useBulkRestore'
        | 'useBulkRestore'
        | 'useRestore'
    >>;
    crudName: string;
    hasSoftDelete?: boolean;
    stateKey?: string; // Key for caching datatable state and layout
    defaultHiddenColumns?: string[]; // Columns hidden by default
    onView?: (row: Partial<T>) => void;
    onRowClick?: (row: Partial<T>) => void;
    onEdit?: (row: Partial<T>) => void;
    bulkActions?: (rowIds: string[]) => TableAction[];
    onAction?: (type: 'created' | 'updated' | 'deleted' | 'restored' | 'deleteForever' | 'bulkDelete' | 'bulkRestore' | 'bulkDeleteRestore') => void
    onToggleTrashData?: (checked: boolean) => void;
    tableActionMenuProps?: (row?: any) => TableActionMenuProps;
    dataTableApiRequestMap?: (queryBuilder?: QueryBuilder, filter?: any,) => Promise<QueryBuilder> | QueryBuilder;
    onFetchData?: (queryBuilder?: QueryBuilder, filters?: Partial<TableState>) => Promise<{ data: T[]; total: number }>;
    permissionsKey?: {
        delete?: PermissionsEnum;
        deleteForever?: PermissionsEnum;
        restore?: PermissionsEnum;
        edit?: PermissionsEnum;
        view?: PermissionsEnum;
    }
}


export const CrudDataGrid = forwardRef<DataTableApi<any>, CrudDataGridProps<any>>((
    {
        crudOperationHooks,
        idKey = 'id' as keyof any,
        crudName,
        hasSoftDelete,
        stateKey,
        defaultHiddenColumns,
        onEdit,
        onView,
        onRowClick,
        bulkActions,
        extraFilter,
        columns: initialColumn = [],
        dataTableApiRequestMap,
        onAction,
        onToggleTrashData,
        tableActionMenuProps,
        onFetchData,
        maxHeight,
        initialState,
        permissionsKey,
        ...props
    }: CrudDataGridProps<any>,
    ref: React.Ref<DataTableApi<any>>,
) => {
    const exportToastIdRef = useRef<string | number | null>(null);
    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();
    const datatableRef = useRef<DataTableApi<any>>(null);

    // Get cached state if stateKey is provided
    const dataTableStateContext = stateKey ? useDataTableState(stateKey) : null;
    const cachedState = dataTableStateContext?.state;


    // Initialize isTrash from cached state or default to false
    const isTrash = useBoolean(cachedState?.showDeleted || false);

    const canDelete = permissionsKey.delete ? useHasPermission(permissionsKey.delete) : undefined;
    const canDeleteForever = permissionsKey.deleteForever ? useHasPermission(permissionsKey.deleteForever) : undefined;
    const canRestore = permissionsKey.restore ? useHasPermission(permissionsKey.restore) : undefined;
    const canEdit = permissionsKey.edit ? useHasPermission(permissionsKey.edit) : undefined;
    const canView = permissionsKey.view ? useHasPermission(permissionsKey.view) : undefined;

    const {
        fetchMany,
        useDelete,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkRestore,
        useBulkDeleteForever,
    } = crudOperationHooks;

    const { mutateAsync: deleteItem } = useDelete();
    const { mutateAsync: restoreItem } = useRestore();
    const { mutateAsync: deleteForeverItem } = useDeleteForever();
    const { mutateAsync: bulkDeleteItems } = useBulkDelete();
    const { mutateAsync: bulkRestoreItems } = useBulkRestore();
    const { mutateAsync: bulkDeleteForeverItems } = useBulkDeleteForever();

    useImperativeHandle(ref, () => {
        return datatableRef.current;
    }, [datatableRef]);

    const handleDelete = useCallback(
        (row: any) => {
            confirmDialog({
                message: `Are you sure you want to delete this ${crudName}?`,
            })
                .then(() => {
                    deleteItem(row.id)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.selection.deselectAll();
                            }
                            showToasty(`The ${crudName} has been successfully deleted`);
                            onAction?.('deleted');
                        })
                        .catch((error) => {
                            showToasty(error || `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`, 'error');
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [
            confirmDialog,
            crudName,
            deleteItem,
            onAction,
            showToasty,
        ],
    );

    const handleRestore = useCallback(
        (row: any) => {
            confirmDialog({
                message: `Are you sure you want to restore this ${crudName}?`,
            })
                .then(() => {
                    restoreItem(row.id)
                        .then(() => {
                            showToasty(`The ${crudName} has been successfully restored`);
                            onAction?.('restored');
                        })
                        .catch((error) => {
                            showToasty(error || `Oops! Something went wrong while trying to restore the ${crudName}. Please try again.`, 'error');
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [
            confirmDialog,
            crudName,
            onAction,
            restoreItem,
            showToasty,
        ],
    );

    const handleDeleteForever = useCallback(
        (row: any) => {
            confirmDialog({
                message: `Are you sure you want to permanently delete this ${crudName}? This action cannot be undone.`,
            })
                .then(() => {
                    deleteForeverItem(row.id)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.selection.deselectAll();
                            }
                            showToasty(`The ${crudName} has been successfully deleted permanently`);
                            onAction?.('deleteForever');
                        })
                        .catch((error) => {
                            showToasty(error || `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`, 'error');
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [
            confirmDialog,
            crudName,
            deleteForeverItem,
            onAction,
            showToasty,
        ],
    );

    const handleBulkDelete = useCallback(
        (rowIds: string[]) => {
            confirmDialog({
                message: `Are you sure you want to delete this ${crudName}?`,
            })
                .then(() => {
                    bulkDeleteItems(rowIds)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.selection.deselectAll();
                            }
                            showToasty(`The ${crudName} has been successfully deleted`);
                            onAction?.('bulkDelete');
                        })
                        .catch((error) => {
                            showToasty(error || `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`, 'error');
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [
            confirmDialog,
            crudName,
            bulkDeleteItems,
            showToasty,
            onAction,
        ],
    );

    const handleBulkRestore = useCallback(
        (rowIds: string[]) => {
            confirmDialog({
                message: `Are you sure you want to restore this ${crudName}?`,
            })
                .then(() => {
                    bulkRestoreItems(rowIds)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.selection.deselectAll();
                            }
                            showToasty(`The ${crudName} has been successfully restored`);
                            onAction?.('bulkRestore');
                        })
                        .catch((error) => {
                            showToasty(error || `Oops! Something went wrong while trying to restore the ${crudName}. Please try again.`, 'error');
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [
            confirmDialog,
            crudName,
            bulkRestoreItems,
            showToasty,
            onAction,
        ],
    );

    const handleBulkDeleteForever = useCallback(
        (rowIds: string[]) => {
            confirmDialog({
                message: `Are you sure you want to permanently delete this ${crudName}? This action cannot be undone.`,
            })
                .then(() => {
                    bulkDeleteForeverItems(rowIds)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.selection.deselectAll();
                            }
                            showToasty(`The ${crudName} has been successfully deleted permanently`);
                            onAction?.('bulkDeleteRestore');
                        })
                        .catch((error) => {
                            showToasty(
                                errorMessage(
                                    error,
                                    `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`,
                                ),
                                'error',
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [
            confirmDialog,
            crudName,
            bulkDeleteForeverItems,
            showToasty,
            onAction,
        ],
    );

    const handleChangeSoftDelete = useCallback(
        (_e, isChecked: boolean) => {
            onToggleTrashData?.(isChecked);
            isTrash.setValue(isChecked);

            // Save to cache if stateKey is provided
            if (stateKey && dataTableStateContext) {
                dataTableStateContext.setState({ showDeleted: isChecked });
            }
        },
        [onToggleTrashData, isTrash, stateKey, dataTableStateContext],
    );

    // Refresh only when isTrash changes, after state has committed
    useEffectAfter(() => {
        if (datatableRef.current) {
            datatableRef.current.data.reload();
            datatableRef.current.selection.deselectAll();
        }
    }, [isTrash?.value]);

    const columns = useMemo(() => {
        return [
            ...initialColumn,
            {
                id: 'action',
                header: 'Action',
                enablePinning: false,
                enableHiding: false,
                enableResizing: false,
                hideInExport: true,
                maxSize: 80,
                cell: ({ row }) => (
                    <TableActionMenu
                        row={row.original}
                        {...((row.original as any).deletedAt ?
                            {
                                ...(canDeleteForever && { onDeleteForever: () => handleDeleteForever(row.original) }),
                                ...(canRestore && { onRestore: () => handleRestore(row.original) }),
                            } :
                            {
                                ...(canDelete && { onDelete: () => handleDelete(row.original) }),
                            })}
                        {...((onEdit && !((row.original as any).deletedAt) && canEdit) && { onEdit: () => onEdit(row.original) })}
                        {...((onView && !((row.original as any).deletedAt) && canView) && { onView: () => onView(row.original) })}
                        {...tableActionMenuProps?.(row.original)}
                    />
                ),
            },
        ];
    }, [
        canDelete,
        canDeleteForever,
        canEdit,
        canRestore,
        canView,
        handleDelete,
        handleDeleteForever,
        handleRestore,
        initialColumn,
        onEdit,
        onView,
        tableActionMenuProps,
    ]);

    const onFetchDataRef = useRef(onFetchData);
    const dataTableApiRequestMapRef = useRef(dataTableApiRequestMap);

    const handleFetchData = useCallback(
        async (filters?: Partial<TableState>) => {
            let queryBuilder = new QueryBuilder();

            // if (filters.columnFilter) {
            //     mapCustomColumnsFilter(queryBuilder, filters.columnFilter);
            // }
            if (filters.pagination) {
                queryBuilder.setSkip((filters.pagination?.pageIndex || 0) * (filters.pagination?.pageSize || 50));
                queryBuilder.setTake(filters.pagination?.pageSize || 50);
            }
            if (filters.sorting) {
                filters.sorting.forEach((sort) => {
                    queryBuilder.addOrder(sort.id, sort.desc ? OrderDirectionEnum.DESC : OrderDirectionEnum.ASC);
                });
            }
            if (filters.globalFilter) {
                const tableColumns = columns.filter((column) => column.enableGlobalFilter);
                const searchColumns = tableColumns.map((column) => column.id || (column as any).accessorKey);
                searchColumns.forEach((column) => {
                    queryBuilder.orWhere(column, { $iLike: `%${filters.globalFilter}%` });
                });
            }
            if (isTrash?.value) {
                queryBuilder.setOnlyDeleted(true);
            }
            // Manage filters mapping here.
            if (dataTableApiRequestMapRef.current) {
                queryBuilder = await dataTableApiRequestMapRef.current(queryBuilder, filters);
            }

            let result = null;

            if (onFetchDataRef.current) {
                result = await onFetchDataRef.current(queryBuilder, filters);
            } else if (fetchMany) {
                const request = queryBuilder.toObject();
                result = await fetchMany(request).then((_res) => {
                    return _res;
                }).catch((_error) => {
                    console.error('Error fetching data:', _error);
                    return {
                        items: [],
                        total: 0,
                    };
                });
            }

            return {
                data: result?.items || result?.data || [],
                total: result?.total || 0,
            };
        },
        [
            columns,
            isTrash?.value,
            dataTableApiRequestMap,
            fetchMany,
        ],
    );

    const handleServerExportData = useCallback(
        async (filters?: Partial<TableFilters>, _selectedState?: any) => {
            delete filters.pagination;
            return handleFetchData(filters);
        },
        [handleFetchData],
    );


    const handleExportProgress = useCallback((progress: { processedRows?: number; totalRows?: number; percentage?: number; }) => {
        let message = `Exporting data`;
        if (progress?.percentage >= 0) {
            message += `... ${progress?.percentage?.toFixed(0)}% (${progress?.processedRows}/${progress?.totalRows})`;
        } else {
            message += `please wait...`;
        }
        if (exportToastIdRef.current === null) {
            // First progress update - create loading toast
            exportToastIdRef.current = showToasty(message, 'loading') as any;
        } else {
            // Update existing toast
            showToasty(message, 'loading', { id: exportToastIdRef.current });
        }
    }, [showToasty]);

    const handleExportComplete = useCallback((result: { success: boolean; filename: string; totalRows: number }) => {
        const message = `Successfully exported ${result.totalRows} rows to ${result.filename}`;

        if (exportToastIdRef.current !== null) {
            // Update existing toast to success
            showToasty(message, 'success', { id: exportToastIdRef.current });
            exportToastIdRef.current = null;
        } else {
            // Create new success toast if somehow ref was lost
            showToasty(message, 'success');
        }
    }, [showToasty]);

    const handleExportError = useCallback((error: { message: string; code: string }) => {
        const message = `Export failed: ${error.message}`;
        if (exportToastIdRef.current !== null) {
            // Update existing toast to error
            showToasty(message, 'error', { id: exportToastIdRef.current });
            exportToastIdRef.current = null;
        } else {
            // Create new error toast if somehow ref was lost
            showToasty(message, 'error');
        }
    }, [showToasty]);

    // Callback to handle table state changes
    const handleTableStateChange = useCallback(
        (state: Partial<TableState>) => {
            if (stateKey && dataTableStateContext) {
                dataTableStateContext.setState({
                    sorting: state.sorting,
                    pagination: state.pagination,
                    globalFilter: state.globalFilter,
                    columnFilter: state.columnFilter,
                });
            }
        },
        [stateKey, dataTableStateContext],
    );

    useEffect(() => {
        onFetchDataRef.current = onFetchData || null;
        dataTableApiRequestMapRef.current = dataTableApiRequestMap || null;
    }, [onFetchData, dataTableApiRequestMap]);

    // Merge cached state with provided initialState
    const mergedInitialState = useMemo(() => {
        const baseState = initialState || {};

        if (!cachedState) return baseState;

        return {
            ...baseState,
            ...(cachedState.sorting && { sorting: cachedState.sorting }),
            ...(cachedState.pagination && { pagination: cachedState.pagination }),
            ...(cachedState.globalFilter && { globalFilter: cachedState.globalFilter }),
            ...(cachedState.columnFilter && { columnFilter: cachedState.columnFilter }),
        };
    }, [cachedState, initialState]);

    // Adapter to convert onRowClick signature from (row: Partial<T>) => void
    // to (event: MouseEvent, row: Row<T>) => void
    const adaptedOnRowClick = useMemo(() => {
        if (!onRowClick) return undefined;
        return (event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
            onRowClick(row.original);
        };
    }, [onRowClick]);
    return (
        <DataGrid
            idKey={idKey}
            ref={datatableRef}
            stateKey={stateKey}
            defaultHiddenColumns={defaultHiddenColumns}
            onFetchData={handleFetchData}
            initialLoadData
            dataMode="server"
            extraFilter={extraFilter}
            maxHeight={maxHeight || `calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
            footerFilter={hasSoftDelete ? (
                <FormControlLabel
                    control={(
                        <Switch
                            checked={isTrash?.value}
                            onChange={handleChangeSoftDelete}
                        />
                    )}
                    label="Show Deleted"
                    slotProps={{
                        typography: {
                            noWrap: true,
                        },
                    }}
                />
            ) : null}
            columns={columns}
            enableBulkActions
            bulkActions={(selectedState) => {
                const selectedRowIds = selectedState.ids;
                return (
                    <TableBulkActionMenu
                        {...(hasSoftDelete && isTrash?.value ?
                            {
                                onRestore: () => handleBulkRestore(selectedRowIds),
                                onDeleteForever: () => handleBulkDeleteForever(selectedRowIds),
                            } :
                            {
                                onDelete: () => handleBulkDelete(selectedRowIds),
                            })}
                        actions={bulkActions?.(selectedRowIds) || []}
                    />
                );
            }}
            enableExport
            onExportProgress={handleExportProgress}
            onExportComplete={handleExportComplete}
            onExportError={handleExportError}
            onServerExport={handleServerExportData}
            enablePagination
            enableRowSelection
            enableStickyHeaderOrFooter
            initialState={mergedInitialState}
            onRowClick={adaptedOnRowClick}
            {...props}
            onDataStateChange={handleTableStateChange}
        />
    );
});

export default CrudDataGrid;
