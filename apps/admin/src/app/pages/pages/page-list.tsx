import { QueryBuilder, WhereOperatorEnum } from '@ackplus/nest-crud-request';
import { usePage } from '@libs/react-shared';
import { IPage, PermissionsEnum, PageStatusEnum } from '@libs/types';
import { toDisplayDate, toDisplayDateTime } from '@libs/utils';
import { Card, Button } from '@mui/material';
import { useCallback, useRef, useState, useMemo, useEffect } from 'react';

import {
    DataTableTab,
    DataTableTabItem,
    Page,
    StatusChip,
    getStatusConfig,
} from '../../components';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditPageDialog from '../../sections/pages/add-edit-page-dialog';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';
import CrudDataGrid from '@admin/app/components/data-grid/crud-data-grid';
import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import { useDataTableState } from '@admin/app/contexts/datatable-state-context';
import { startCase } from 'lodash';


export interface IPageTableFilter {
    status?: PageStatusEnum | 'all';
}

const defaultFilter: IPageTableFilter = {
    status: 'all',
};

function PageList() {
    const datatableRef = useRef<DataTableApi<IPage>>(null);
    const [selectedPage, setSelectedPage] = useState<IPage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Get cached state for pages table
    const dataTableStateKey = 'pagelist';
    const { state: cachedState, setState: setCachedState } = useDataTableState(dataTableStateKey);

    const [tableFilter, setTableFilter] = useState(cachedState?.tableFilter || defaultFilter);
    const [countFilter, setCountFilter] = useState(cachedState?.countFilter || {});

    const canCreate = useHasPermission(PermissionsEnum.CREATE_PAGES);
    const canEdit = useHasPermission(PermissionsEnum.UPDATE_PAGES);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_PAGES);

    const {
        useFetchManyPage,
        useGetManyPage,
        useDeletePage,
        useRestorePage,
        useDeleteForeverPage,
        useBulkDeletePage,
        useBulkRestorePage,
        useBulkDeleteForeverPage,
    } = usePage();

    const handleAddEdit = useCallback((page?: IPage) => {
        setSelectedPage(page || null);
        setIsDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setSelectedPage(null);
        setIsDialogOpen(false);
    }, []);

    const handleOnChangeTableFilter = useCallback((value: any, key: string) => {
        setCachedState({ tableFilter: { ...tableFilter, [key]: value } });
        setTableFilter((state) => ({
            ...state,
            [key]: value,
        }));
    }, [tableFilter, setCachedState]);

    const handleTrashData = useCallback((checked: boolean) => {
        setCountFilter((state) => {
            const newState = new QueryBuilder(state);
            newState.setOnlyDeleted(checked);
            return newState.toObject();
        });
        setCachedState({ countFilter: { ...countFilter, onlyDeleted: checked } });
    }, [countFilter, setCachedState]);

    const dataTableApiRequestMap = useCallback(
        async (queryBuilder: QueryBuilder, _filters: any) => {
            if (tableFilter?.status !== 'all') {
                queryBuilder.where({
                    status: { $eq: tableFilter?.status },
                });
            }

            if (_filters?.globalFilter) {
                queryBuilder.orWhere('title', WhereOperatorEnum.ILIKE, `%${_filters?.globalFilter}%`);
                queryBuilder.orWhere('name', WhereOperatorEnum.ILIKE, `%${_filters?.globalFilter}%`);
                queryBuilder.orWhere('slug', WhereOperatorEnum.ILIKE, `%${_filters?.globalFilter}%`);
            }

            return queryBuilder;
        },
        [tableFilter?.status],
    );

    const tabs: DataTableTabItem[] = useMemo(() => {
        return [
            {
                value: 'all',
                label: 'All',
                count: 0, // You can add counts later if needed
            },
            {
                value: PageStatusEnum.DRAFT,
                label: 'Draft',
                color: 'warning',
                count: 0,
            },
            {
                value: PageStatusEnum.PUBLISHED,
                label: 'Published',
                color: 'success',
                count: 0,
            },
            {
                value: PageStatusEnum.UNPUBLISHED,
                label: 'Unpublished',
                color: 'error',
                count: 0,
            },
        ];
    }, []);

    const columns: DataTableColumn<IPage>[] = [
        {
            accessorKey: 'name',
            header: 'Name (Admin perspective)',
            enableGlobalFilter: true,
            enableSorting: true,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            enableSorting: true,
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            enableSorting: true,
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            enableSorting: true,
            accessorFn: (row) => startCase(row.status),
            type: 'select',
            options: Object.values(PageStatusEnum).map((status) => ({
                label: startCase(status),
                value: status,
            })),
            cell: ({ row }) => (
                <StatusChip
                    status={row.original?.status || 'draft'}
                    statusConfig={getStatusConfig('page')}
                />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            enableSorting: true,
            type: 'date',
            accessorFn: (row) => toDisplayDateTime(row.createdAt),
        },
        {
            accessorKey: 'updatedAt',
            header: 'Updated At',
            enableSorting: true,
            type: 'date',
            accessorFn: (row) => toDisplayDateTime(row.updatedAt),
        },
    ];

    useEffect(() => {
        if (datatableRef.current) {
            datatableRef.current.data.reload();
        }
    }, [tableFilter]);

    return (
        <Page
            title="Pages"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Pages' },
            ]}
        >
            <Card>
                <DataTableTab
                    tabs={tabs}
                    value={tableFilter?.status}
                    onChange={(tab) => handleOnChangeTableFilter(tab, 'status')}
                />
                <CrudDataGrid
                    ref={datatableRef}
                    columns={columns}
                    crudName="Page"
                    stateKey={dataTableStateKey}
                    exportFilename="pages"
                    onToggleTrashData={handleTrashData}
                    dataTableApiRequestMap={dataTableApiRequestMap}
                    crudOperationHooks={{
                        fetchMany: useFetchManyPage,
                        useGetMany: useGetManyPage,
                        useDelete: useDeletePage,
                        useRestore: useRestorePage,
                        useDeleteForever: useDeleteForeverPage,
                        useBulkDelete: useBulkDeletePage,
                        useBulkRestore: useBulkRestorePage,
                        useBulkDeleteForever: useBulkDeleteForeverPage,
                    }}
                    initialState={{
                        sorting: [
                            {
                                id: 'createdAt',
                                desc: true,
                            },
                        ],
                    }}
                    hasSoftDelete
                    onEdit={canEdit ? handleAddEdit : undefined}
                    permissionsKey={{
                        delete: PermissionsEnum.DELETE_PAGES,
                        deleteForever: PermissionsEnum.DELETE_PAGES,
                        restore: PermissionsEnum.DELETE_PAGES,
                        edit: PermissionsEnum.UPDATE_PAGES,
                        view: PermissionsEnum.ACCESS_PAGES,
                    }}
                    extraFilter={canCreate ? (
                        <Button
                            variant="contained"
                            onClick={() => handleAddEdit()}
                        >
                            Add Page
                        </Button>
                    ) : null}
                />
            </Card>

            {isDialogOpen && (
                <AddEditPageDialog
                    initialValue={selectedPage}
                    onClose={handleCloseDialog}
                    onSubmit={() => {
                        datatableRef.current?.data?.reload();
                        handleCloseDialog();
                    }}
                />
            )}
        </Page>
    );
}

export default withRequirePermission(PageList, {
    permission: PermissionsEnum.ACCESS_PAGES,
});
