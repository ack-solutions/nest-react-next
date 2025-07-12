import { QueryBuilder, WhereOperatorEnum } from '@ackplus/nest-crud-request';
import { usePage } from '@libs/react-shared';
import { IPage, PermissionsEnum, PageStatusEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Card, Button } from '@mui/material';
import { useCallback, useRef, useState, useMemo, useEffect } from 'react';

import {
    CrudTable,
    CrudTableActions,
    DataTableColumn,
    DataTableTab,
    DataTableTabItem,
    IDataTableFilter,
    Page,
    StatusChip,
    getStatusConfig,
} from '../../components';
import { useAccess, withPermission } from '../../contexts/react-access-control';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditPageDialog from '../../sections/pages/add-edit-page-dialog';


export interface IPageTableFilter {
    status?: PageStatusEnum | 'all';
}

const defaultFilter: IPageTableFilter = {
    status: 'all',
};

function PageList() {
    const datatableRef = useRef<CrudTableActions>(null);
    const { showToasty } = useToasty();
    const { hasPermission } = useAccess();
    const [selectedPage, setSelectedPage] = useState<IPage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tableFilter, setTableFilter] = useState(defaultFilter);
    const [countFilter, setCountFilter] = useState({});

    const canCreate = hasPermission(PermissionsEnum.CREATE_PAGES);
    const canEdit = hasPermission(PermissionsEnum.UPDATE_PAGES);
    const canDelete = hasPermission(PermissionsEnum.DELETE_PAGES);

    const {
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

    const handleOnChangeTableFilter = useCallback((value, key) => {
        setTableFilter((state) => ({
            ...state,
            [key]: value,
        }));
    }, []);

    const handleTrashData = useCallback((checked) => {
        setCountFilter((state) => {
            const newState = new QueryBuilder(state);
            newState.setOnlyDeleted(checked);
            return newState.toObject();
        });
    }, []);

    const handleDataTableApiRequestMap = useCallback(
        (queryBuilder: QueryBuilder, request: IDataTableFilter) => {
            if (tableFilter?.status !== 'all') {
                queryBuilder.where({
                    status: { $eq: tableFilter?.status },
                });
            }

            if (request?.search) {
                queryBuilder.orWhere('title', WhereOperatorEnum.ILIKE, `%${request?.search}%`);
                queryBuilder.orWhere('name', WhereOperatorEnum.ILIKE, `%${request?.search}%`);
                queryBuilder.orWhere('slug', WhereOperatorEnum.ILIKE, `%${request?.search}%`);
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
            name: 'name',
            label: 'Name (Admin perspective)',
            isSearchable: true,
            isSortable: true,
            render: (row) => row?.name || '-',
        },
        {
            name: 'title',
            label: 'Title',
            isSortable: true,
            isSearchable: true,
            render: (row) => row?.title || '-',
        },
        {
            name: 'slug',
            label: 'Slug',
            isSortable: true,
            isSearchable: true,
            render: (row) => row?.slug || '-',
        },
        {
            name: 'status',
            label: 'Status',
            isSortable: true,
            render: (row) => (
                <StatusChip
                    status={row?.status || 'draft'}
                    statusConfig={getStatusConfig('page')}
                />
            ),
        },
        {
            name: 'createdAt',
            label: 'Created At',
            isSortable: true,
            render: (row) => toDisplayDate(row?.createdAt),
        },
        {
            name: 'updatedAt',
            label: 'Updated At',
            isSortable: true,
            render: (row) => toDisplayDate(row?.updatedAt),
        },
    ];

    useEffect(() => {
        if (datatableRef.current) {
            datatableRef.current.datatable.refresh();
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
                <CrudTable
                    crudName="Page"
                    crudPermissionKey="pages"
                    columns={columns}
                    ref={datatableRef}
                    hasSoftDelete
                    // Permission props
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canRestore={canDelete} // Usually same as delete permission
                    canDeleteForever={canDelete} // Usually same as delete permission
                    onToggleTrashData={handleTrashData}
                    dataTableApiRequestMap={handleDataTableApiRequestMap}
                    crudOperationHooks={{
                        useGetMany: useGetManyPage,
                        useDelete: useDeletePage,
                        useRestore: useRestorePage,
                        useDeleteForever: useDeleteForeverPage,
                        useBulkDelete: useBulkDeletePage,
                        useBulkRestore: useBulkRestorePage,
                        useBulkDeleteForever: useBulkDeleteForeverPage,
                    }}
                    onEdit={canEdit ? handleAddEdit : undefined}
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
                        datatableRef.current?.datatable?.refresh();
                        handleCloseDialog();
                    }}
                />
            )}
        </Page>
    );
}

export default withPermission({
    permissions: [PermissionsEnum.ACCESS_PAGES],
})(PageList);
