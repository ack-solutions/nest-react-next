import { QueryBuilder } from '@ackplus/nest-crud-request';
import { useCrudOperations } from '@libs/react-shared';
import { IBaseEntity, IFindOptions } from '@libs/types';
import { errorMessage } from '@libs/utils';
import { FormControlLabel, Switch } from '@mui/material';
import {
    useState,
    useCallback,
    useRef,
    forwardRef,
    useMemo,
    useImperativeHandle,
    useEffect,
} from 'react';

import { useConfirm } from '../../contexts';
import { useBoolean, useToasty } from '../../hook';
import {
    DataTable,
    DataTableHandle,
    DataTableProps,
    IDataTableFilter,
    TableBulkActionMenu,
} from '../data-table';
import { TableAction, TableActionMenu, TableActionMenuProps } from '../data-table/table-action-menu';


export interface CrudTableProps<T>
    extends Partial<Omit<DataTableProps, 'data' | 'ref'>> {
    crudOperationHooks: {
        useGetMany: any;
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
    crudPermissionKey?: string;
    hasSoftDelete?: boolean;
    canView?: boolean;
    canEdit?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canRestore?: boolean;
    canDeleteForever?: boolean;
    onView?: (row: Partial<T>) => void;
    onRowClick?: (row: Partial<T>) => void;
    onEdit?: (row: Partial<T>) => void;
    bulkActions?: (rowIds: string[]) => TableAction[];
    getManyOptions?: IFindOptions;
    dataTableApiRequestMap?: (queryBuilder?: QueryBuilder, filter?: IDataTableFilter,) => Promise<QueryBuilder> | QueryBuilder;
    onAction?: (type: 'created' | 'updated' | 'deleted' | 'restored' | 'deleteForever' | 'bulkDelete' | 'bulkRestore' | 'bulkDeleteRestore') => void
    onToggleTrashData?: (checked: boolean) => void
    tableActionMenuProps?: (row?: any) => TableActionMenuProps
}

export interface CrudTableActions {
    applyFilters: (filter: any) => void;
    filters: any;
    datatable: DataTableHandle;
}

export const CrudTable = forwardRef<CrudTableActions, CrudTableProps<any>>(
    (
        {
            crudOperationHooks,
            crudName,
            crudPermissionKey,
            canEdit,
            canView,
            canCreate,
            canUpdate,
            canDelete,
            canRestore,
            canDeleteForever,
            hasSoftDelete,
            bulkActions = () => [],
            getManyOptions,
            onEdit,
            onView,
            onRowClick,
            extraFilter,
            columns: initialColumn = [],
            dataTableApiRequestMap,
            onAction,
            onToggleTrashData,
            tableActionMenuProps,
            filters,
            onSetFilterValues,
            ...props
        },
        ref,
    ) => {
        const { showToasty } = useToasty();
        const confirmDialog = useConfirm();
        const [dataTableFilters, setDataTableFilters] = useState(getManyOptions);
        const datatableRef = useRef<DataTableHandle>(null);
        const isTrash = useBoolean();

        const {
            useGetMany,
            useDelete,
            useRestore,
            useDeleteForever,
            useBulkDelete,
            useBulkRestore,
            useBulkDeleteForever,
        } = crudOperationHooks;

        const { data } = useGetMany(dataTableFilters, {
            enabled: Boolean(dataTableFilters),
        });

        const { mutateAsync: deleteItem } = useDelete();
        const { mutateAsync: restoreItem } = useRestore();
        const { mutateAsync: deleteForeverItem } = useDeleteForever();
        const { mutateAsync: bulkDeleteItems } = useBulkDelete();
        const { mutateAsync: bulkRestoreItems } = useBulkRestore();
        const { mutateAsync: bulkDeleteForeverItems } = useBulkDeleteForever();

        const updatedFilters = useMemo(() => {
            return {
                ...(filters || {}),
                ...(isTrash?.value && {
                    isTrash: true,
                }),
            };
        }, [filters, isTrash?.value]);

        const handleDelete = useCallback(
            (row: any) => {
                confirmDialog({
                    message: `Are you sure you want to delete this ${crudName}?`,
                })
                    .then(() => {
                        deleteItem(row.id)
                            .then(() => {
                                if (datatableRef.current) {
                                    datatableRef.current.clearSelection();
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
                                    datatableRef.current.clearSelection();
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
                                    datatableRef.current.clearSelection();
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
                                    datatableRef.current.clearSelection();
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
                                    datatableRef.current.clearSelection();
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
            },
            [onToggleTrashData, isTrash],
        );


        const handleDataTableChangeFilters = useCallback(
            async (queryBuilder: QueryBuilder, filters?: IDataTableFilter) => {
                if (dataTableApiRequestMap) {
                    queryBuilder = await dataTableApiRequestMap(queryBuilder, filters) as QueryBuilder;
                }
                if (isTrash?.value) {
                    queryBuilder.setOnlyDeleted(true);
                }
                const dataFilters: any = queryBuilder?.toObject();
                // Manage filters mapping here.
                setDataTableFilters(dataFilters);
                return queryBuilder;
            },
            [dataTableApiRequestMap, isTrash?.value],
        );

        useEffect(() => {
            if (datatableRef.current) {
                datatableRef.current?.refresh();
                datatableRef.current?.clearSelection();
            }
        }, [isTrash?.value]);

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
                            crudPermissionKey={crudPermissionKey}
                            row={row}
                            {...(row.deletedAt ?
                                {
                                    ...(canDeleteForever && { onDeleteForever: () => handleDeleteForever(row) }),
                                    ...(canRestore && { onRestore: () => handleRestore(row) }),
                                } :
                                {
                                    ...(canDelete && { onDelete: () => handleDelete(row) }),
                                })}
                            {...((onEdit && !row.deletedAt && canEdit) && { onEdit: () => onEdit(row) })}
                            {...((onView && !row.deletedAt && canView) && { onView: () => onView(row) })}
                            {...tableActionMenuProps?.(row)}
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

        return (
            <DataTable
                initialLoading
                ref={datatableRef}
                data={data?.items || null}
                totalRow={data?.total}
                defaultOrder="desc"
                defaultOrderBy="createdAt"
                // onChange={handleDataTableChange}
                handleDataLoadFilters={handleDataTableChangeFilters}
                onRowClick={onRowClick}
                hasFilter
                selectable
                filters={updatedFilters}
                onSetFilterValues={(filters: any) => {
                    // Check if isTrash filter was removed (either individually or via clear all)
                    if (isTrash?.value && !filters?.isTrash) {
                        isTrash.setValue(false);
                        onToggleTrashData?.(false);
                    }
                    // Check if isTrash filter was added
                    if (!isTrash?.value && filters?.isTrash) {
                        isTrash.setValue(true);
                        onToggleTrashData?.(true);
                    }
                    onSetFilterValues?.(filters);
                }}
                renderBulkAction={(selectedRowIds) => (
                    <TableBulkActionMenu
                        {...(hasSoftDelete && isTrash?.value ?
                            {
                                onRestore: () => handleBulkRestore(selectedRowIds),
                                onDeleteForever: () => handleBulkDeleteForever(selectedRowIds),
                            } :
                            {
                                onDelete: () => handleBulkDelete(selectedRowIds),
                            })}
                        actions={bulkActions(selectedRowIds)}
                        canDelete={canDelete}
                        canRestore={canRestore}
                        canDeleteForever={canDeleteForever}
                    />
                )}
                extraFilter={(
                    <>
                        {/* {hasSoftDelete ? (
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
                        ) : null} */}
                        {extraFilter}
                    </>
                )}
                columns={columns}
                tableActions={(
                    hasSoftDelete ? (
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
                    ) : null
                )}
                {...props}
            />
        );
    },
);
