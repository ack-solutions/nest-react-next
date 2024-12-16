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


export interface CrudTableProps extends Partial<Omit<DataTableProps, 'ref'>> {
    crudOperationHooks: Partial<ReturnType<typeof useCrudOperations>>;
    crudName: string;
    hasSoftDelete?: boolean;
    onEdit?: (updatedValue: Partial<any>) => void;
    rowActions?: (row) => TableAction[];
    bulkActions?: (rows: any[]) => TableAction[];
}

export interface CrudTableActions {
    // create: () => void;
    // edit: (item: Entity) => void;
    applyFilters: (filter: any) => void,
    filters: any,
    datatable: DataTableHandle
}


export const CrudTable = forwardRef<CrudTableActions, CrudTableProps>(({
    crudOperationHooks,
    crudName,
    hasSoftDelete,
    rowActions,
    bulkActions,
    onEdit,
    columns: initialColumn,
    ...props
}, ref) => {

    const { showToasty } = useToasty();
    const confirmDialog = useConfirm();
    const [dataTableFilters, setDataTableFilters] = useState(null);
    const datatableRef = useRef<DataTableHandle>(null);
    const isTrash = useBoolean();

    const { useGetMany, useDelete, useRestore, useDeleteForever, useBulkDelete, useBulkRestore, useBulkDeleteForever } = crudOperationHooks;

    const { data } = useGetMany(dataTableFilters, {
        enabled: Boolean(dataTableFilters),
    });

    const { mutateAsync: deleteItem } = useDelete()
    const { mutateAsync: restoreItem } = useRestore()
    const { mutateAsync: deleteForeverItem } = useDeleteForever()
    const { mutateAsync: bulkDeleteItems } = useBulkDelete()
    const { mutateAsync: bulkRestoreItems } = useBulkRestore()
    const { mutateAsync: bulkDeleteForeverItems } = useBulkDeleteForever()

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
                                    `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`
                                ),
                                'error'
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [confirmDialog, deleteItem, showToasty]
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
                                    `Oops! Something went wrong while trying to restore the ${crudName}. Please try again.`
                                ),
                                'error'
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [confirmDialog, restoreItem, showToasty]
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
                                    `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`
                                ),
                                'error'
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [confirmDialog, deleteForeverItem, showToasty]
    );

    const handleBulkDelete = useCallback(
        (rowIds: string[]) => {
            confirmDialog({ message: `Are you sure you want to delete this ${crudName}?` })
                .then(() => {
                    bulkDeleteItems(rowIds)
                        .then(() => {
                            datatableRef.current.clearSelection();
                            showToasty(`The ${crudName} has been successfully deleted`);
                        })
                        .catch((error) => {
                            showToasty(
                                errorMessage(
                                    error,
                                    `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`
                                ),
                                'error'
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [confirmDialog, bulkDeleteItems, showToasty]
    );

    const handleBulkRestore = useCallback(
        (rowIds: string[]) => {
            confirmDialog({ message: `Are you sure you want to restore this ${crudName}?` })
                .then(() => {
                    bulkRestoreItems(rowIds)
                        .then(() => {
                            datatableRef.current.clearSelection();
                            showToasty(`The ${crudName} has been successfully restored`);
                        })
                        .catch((error) => {
                            showToasty(
                                errorMessage(
                                    error,
                                    `Oops! Something went wrong while trying to restore the ${crudName}. Please try again.`
                                ),
                                'error'
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [confirmDialog, bulkRestoreItems, showToasty]
    );

    const handleBulkDeleteForever = useCallback(
        (rowIds: string[]) => {
            confirmDialog({ message: `Are you sure you want to permanently delete this ${crudName}? This action cannot be undone.` })
                .then(() => {
                    bulkDeleteForeverItems(rowIds)
                        .then(() => {
                            datatableRef.current.clearSelection();
                            showToasty(`The ${crudName} has been successfully deleted permanently`);
                        })
                        .catch((error) => {
                            showToasty(
                                errorMessage(
                                    error,
                                    `Oops! Something went wrong while trying to delete the ${crudName}. Please try again.`
                                ),
                                'error'
                            );
                        });
                })
                .catch(() => {
                    // Nothing
                });
        },
        [confirmDialog, bulkDeleteForeverItems, showToasty]
    );


    const handleDataTableChange = useCallback((filters) => {
        if (isTrash.value) {
            filters.onlyDeleted = true
        }
        // Manage filters mapping here.
        setDataTableFilters(filters);
    }, [isTrash.value]);


    useEffect(() => {
        datatableRef?.current?.refresh()
    }, [isTrash.value])



    useImperativeHandle(ref, () => ({
        filters: dataTableFilters,
        applyFilters: setDataTableFilters,
        datatable: datatableRef.current
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
                    }
                },
                render: (row: IBaseEntity) => (
                    <TableActionMenu
                        row={row}
                        {...(hasSoftDelete && row.deletedAt ? {
                            onDeleteForever: () => handleDeleteForever(row),
                            onRestore: () => handleRestore(row)
                        } : {
                            onDelete: () => handleDelete(row)
                        })}
                        onEdit={() => onEdit && onEdit(row)}
                        actions={rowActions ? rowActions(row) : []}
                    />
                ),
            },
        ]
    }, [initialColumn])

    return (
        <DataTable
            initialLoading
            ref={datatableRef}
            data={data?.items}
            totalRow={data?.total}
            defaultOrderBy="createdAt"
            onChange={handleDataTableChange}
            hasFilter
            selectable
            renderBulkAction={(selectedRowIds) => (
                <TableBulkActionMenu
                    {...(hasSoftDelete && isTrash?.value ? {
                        onRestore: () => handleBulkRestore(selectedRowIds),
                        onDeleteForever: () => handleBulkDeleteForever(selectedRowIds)
                    } : {
                        onDelete: () => handleBulkDelete(selectedRowIds)
                    })}
                    actions={bulkActions ? bulkActions(selectedRowIds) : []}
                />
            )}
            extraFilter={(
                <FormControlLabel
                    control={<Switch
                        checked={isTrash.value}
                        onChange={(e, isChecked) => isTrash.setValue(isChecked)}
                    />}
                    label="Show Deleted"
                />
            )}
            columns={columns}
            {...props}
        />
    );
})
