import {
    DataTable,
    DataTableHandle,
    DataTableProps,
    TableActionMenu,
} from '@admin/app/components';
import { TableBulkActionMenu } from '@admin/app/components/data-table/table-bulk-action-menu';
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';
import { errorMessage, useBoolean, useCrudOperations, useToasty } from '@libs/react-core';
import { IBaseEntity, IFindOptions } from '@libs/types';
import { FormControlLabel, Switch } from '@mui/material';
import { useState, useCallback, useRef, forwardRef, useMemo, useImperativeHandle, useEffect } from 'react';

import { TableAction } from '../data-table/table-action-menu';


export interface CrudTableProps<T> extends Partial<Omit<DataTableProps, 'data' | 'ref'>> {
    crudOperationHooks: Pick<ReturnType<typeof useCrudOperations>, 'useBulkDelete' | 'useBulkDeleteForever' | 'useDelete' | 'useDeleteForever' | 'useGetMany' | 'useBulkRestore' | 'useBulkRestore' | 'useRestore'>;
    crudName: string;
    hasSoftDelete?: boolean;
    onView?: (row: Partial<T>) => void;
    onEdit?: (row: Partial<T>) => void;
    rowActions?: (row: T) => TableAction[];
    bulkActions?: (rowIds: string[]) => TableAction[];
    getManyOptions?: IFindOptions;
    dataTableApiRequestMap?: (filter: IFindOptions) => IFindOptions;
}

export interface CrudTableActions {
    // create: () => void;
    // edit: (item: Entity) => void;
    applyFilters: (filter: any) => void,
    filters: any,
    datatable: DataTableHandle
}


export const CrudTable = forwardRef<CrudTableActions, CrudTableProps<any>>(({
    crudOperationHooks,
    crudName,
    hasSoftDelete,
    rowActions = () => [],
    bulkActions = () => [],
    getManyOptions,
    onEdit,
    onView,
    extraFilter,
    columns: initialColumn = [],
    dataTableApiRequestMap,
    ...props
}, ref) => {
    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();
    const [dataTableFilters, setDataTableFilters] = useState(getManyOptions);
    const datatableRef = useRef<DataTableHandle>(null);
    const isTrash = useBoolean();

    const { useGetMany, useDelete, useRestore, useDeleteForever, useBulkDelete, useBulkRestore, useBulkDeleteForever } = crudOperationHooks;

    const { data } = useGetMany(dataTableFilters, {
        enabled: Boolean(dataTableFilters),
    });

    const { mutateAsync: deleteItem } = useDelete();
    const { mutateAsync: restoreItem } = useRestore();
    const { mutateAsync: deleteForeverItem } = useDeleteForever();
    const { mutateAsync: bulkDeleteItems } = useBulkDelete();
    const { mutateAsync: bulkRestoreItems } = useBulkRestore();
    const { mutateAsync: bulkDeleteForeverItems } = useBulkDeleteForever();

    const handleDelete = useCallback(
        (row: any) => {
            confirmDialog({ message: `Are you sure you want to delete this ${crudName}?` })
                .then(() => {
                    deleteItem(row.id)
                        .then(() => {
                            showToasty(`The ${crudName} has been successfully deleted`);
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
            deleteItem,
            showToasty,
        ],
    );

    const handleRestore = useCallback(
        (row: any) => {
            confirmDialog({ message: `Are you sure you want to restore this ${crudName}?` })
                .then(() => {
                    restoreItem(row.id)
                        .then(() => {
                            showToasty(`The ${crudName} has been successfully restored`);
                        })
                        .catch((error) => {
                            showToasty(
                                errorMessage(
                                    error,
                                    `Oops! Something went wrong while trying to restore the ${crudName}. Please try again.`,
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
            restoreItem,
            showToasty,
        ],
    );

    const handleDeleteForever = useCallback(
        (row: any) => {
            confirmDialog({ message: `Are you sure you want to permanently delete this ${crudName}? This action cannot be undone.` })
                .then(() => {
                    deleteForeverItem(row.id)
                        .then(() => {
                            showToasty(`The ${crudName} has been successfully deleted permanently`);
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
            deleteForeverItem,
            showToasty,
        ],
    );

    const handleBulkDelete = useCallback(
        (rowIds: string[]) => {
            confirmDialog({ message: `Are you sure you want to delete this ${crudName}?` })
                .then(() => {
                    bulkDeleteItems(rowIds)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.clearSelection();
                            }
                            showToasty(`The ${crudName} has been successfully deleted`);
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
            bulkDeleteItems,
            showToasty,
        ],
    );

    const handleBulkRestore = useCallback(
        (rowIds: string[]) => {
            confirmDialog({ message: `Are you sure you want to restore this ${crudName}?` })
                .then(() => {
                    bulkRestoreItems(rowIds)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.clearSelection();
                            }
                            showToasty(`The ${crudName} has been successfully restored`);
                        })
                        .catch((error) => {
                            showToasty(
                                errorMessage(
                                    error,
                                    `Oops! Something went wrong while trying to restore the ${crudName}. Please try again.`,
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
            bulkRestoreItems,
            showToasty,
        ],
    );

    const handleBulkDeleteForever = useCallback(
        (rowIds: string[]) => {
            confirmDialog({ message: `Are you sure you want to permanently delete this ${crudName}? This action cannot be undone.` })
                .then(() => {
                    bulkDeleteForeverItems(rowIds)
                        .then(() => {
                            if (datatableRef.current) {
                                datatableRef.current.clearSelection();
                            }
                            showToasty(`The ${crudName} has been successfully deleted permanently`);
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
        ],
    );

    const handleDataTableChange = useCallback((filters) => {
        if (isTrash.value) {
            filters.onlyDeleted = true;
        }
        if (dataTableApiRequestMap) {
            filters = dataTableApiRequestMap(filters);
        }
        // Manage filters mapping here.
        setDataTableFilters(filters);
    }, [dataTableApiRequestMap, isTrash.value]);

    useEffect(() => {
        datatableRef?.current?.refresh();
    }, [isTrash.value]);

    useImperativeHandle(ref, () => ({
        filters: dataTableFilters,
        applyFilters: setDataTableFilters,
        datatable: datatableRef.current as any,
    }));

    const columns = useMemo(() => {
        return [
            ...initialColumn,
            {
                name: 'action',
                label: 'Action',
                props: {
                    sx: {
                        width: 120,
                    },
                },
                render: (row: IBaseEntity) => (
                    <TableActionMenu
                        row={row}
                        {...(hasSoftDelete && row.deletedAt ? {
                            onDeleteForever: () => handleDeleteForever(row),
                            onRestore: () => handleRestore(row),
                        } : {
                            onDelete: () => handleDelete(row),
                        })}
                        {...(onEdit && { onEdit: () => onEdit(row) })}
                        {...(onView && { onView: () => onView(row) })}
                        actions={rowActions(row)}
                    />
                ),
            },
        ];
    }, [
        handleDelete,
        handleDeleteForever,
        handleRestore,
        hasSoftDelete,
        initialColumn,
        onEdit,
        onView,
        rowActions,
    ]);

    return (
        <DataTable
            initialLoading
            ref={datatableRef}
            data={data?.items || null}
            totalRow={data?.total}
            defaultOrder='desc'
            defaultOrderBy="createdAt"
            onChange={handleDataTableChange}
            hasFilter
            selectable
            renderBulkAction={(selectedRowIds) => (
                <TableBulkActionMenu
                    {...(hasSoftDelete && isTrash?.value ? {
                        onRestore: () => handleBulkRestore(selectedRowIds),
                        onDeleteForever: () => handleBulkDeleteForever(selectedRowIds),
                    } : {
                        onDelete: () => handleBulkDelete(selectedRowIds),
                    })}
                    actions={bulkActions(selectedRowIds)}
                />
            )}
            extraFilter={(
                <>
                    {extraFilter}
                    {hasSoftDelete && (
                        <FormControlLabel
                            control={<Switch
                                checked={isTrash.value}
                                onChange={(_e, isChecked) => isTrash.setValue(isChecked)}
                            />}
                            label="Show Deleted"
                        />
                    )}
                </>
            )}
            columns={columns}
            {...props}
        />
    );
});
