import { usePage } from '@libs/react-shared';
import { IPage, PermissionsEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Card, Button, Chip } from '@mui/material';
import { useCallback, useRef, useState } from 'react';

import {
    DataTable,
    DataTableColumn,
    DataTableHandle,
    Page,
    TableActionMenu,
} from '../../components';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { useAccess, withPermission } from '../../contexts/react-access-control';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import AddEditPageDialog from '../../sections/pages/add-edit-page-dialog';


function PageList() {
    const datatableRef = useRef<DataTableHandle>(null);
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();
    const { hasPermission } = useAccess();
    const [selectedPage, setSelectedPage] = useState<IPage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const canCreate = hasPermission(PermissionsEnum.CREATE_PAGES);
    const canEdit = hasPermission(PermissionsEnum.UPDATE_PAGES);
    const canDelete = hasPermission(PermissionsEnum.DELETE_PAGES);

    const {
        useGetManyPage,
        useDeletePage,
        useRestorePage,
        useDeleteForeverPage,
    } = usePage();

    const { data, isLoading } = useGetManyPage();
    const { mutateAsync: deletePage } = useDeletePage();
    const { mutateAsync: restorePage } = useRestorePage();
    const { mutateAsync: deleteForeverPage } = useDeleteForeverPage();

    const handleAddEdit = useCallback((page?: IPage) => {
        setSelectedPage(page || null);
        setIsDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setSelectedPage(null);
        setIsDialogOpen(false);
    }, []);

    const handleDelete = useCallback((row: IPage) => () => {
        confirmDialog({
            title: 'Delete Page',
            message: 'Are you sure you want to delete this page?',
        }).then(async () => {
            try {
                await deletePage(row.id);
                showToasty('Page deleted successfully');
            } catch (error) {
                showToasty(error || 'Failed to delete page', 'error');
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [
        confirmDialog,
        deletePage,
        showToasty,
    ]);

    const handleRestore = useCallback((row: IPage) => () => {
        confirmDialog({
            title: 'Restore Page',
            message: 'Are you sure you want to restore this page?',
        }).then(async () => {
            try {
                await restorePage(row.id);
                showToasty('Page restored successfully');
            } catch (error) {
                showToasty(error || 'Failed to restore page', 'error');
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [
        confirmDialog,
        restorePage,
        showToasty,
    ]);

    const handleDeleteForever = useCallback((row: IPage) => () => {
        confirmDialog({
            title: 'Delete Page Forever',
            message: 'Are you sure you want to permanently delete this page? This action cannot be undone.',
        }).then(async () => {
            try {
                await deleteForeverPage(row.id);
                showToasty('Page permanently deleted');
            } catch (error) {
                showToasty(error || 'Failed to delete page permanently', 'error');
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [
        confirmDialog,
        deleteForeverPage,
        showToasty,
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            case 'unpublished':
                return 'error';
            default:
                return 'default';
        }
    };

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
                <Chip
                    label={row?.status || 'Draft'}
                    color={getStatusColor(row?.status) as any}
                    size="small"
                    variant="outlined"
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
        {
            name: 'actions',
            label: 'Actions',
            isAction: true,
            render: (row) => (
                <TableActionMenu
                    row={row}
                    {...(canEdit && !row?.deletedAt && { onEdit: () => handleAddEdit(row) })}
                    {...(canDelete && !row?.deletedAt && { onDelete: handleDelete(row) })}
                    {...(canDelete && row?.deletedAt && {
                        onRestore: handleRestore(row),
                        onDeleteForever: handleDeleteForever(row),
                    })}
                />
            ),
        },
    ];

    return (
        <Page
            title="CMS Pages"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'CMS Pages' },
            ]}
        >
            <Card>
                <DataTable
                    ref={datatableRef}
                    columns={columns}
                    data={data?.items || []}
                    isLoading={isLoading}
                    totalRow={data?.total || 0}
                    selectable={false}
                    hasFilter
                    topAction={
                        canCreate ? (
                            <Button
                                variant="contained"
                                onClick={() => handleAddEdit()}
                            >
                                Add Page
                            </Button>
                        ) : null
                    }
                />
            </Card>

            {isDialogOpen && (
                <AddEditPageDialog
                    initialValue={selectedPage}
                    onClose={handleCloseDialog}
                    onSubmit={() => {
                        datatableRef.current?.refresh();
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
