import { Page } from '@admin/app/components/page';
import { useBoolean, useToasty } from '@admin/app/hook';
import { useTemplateLayout } from '@libs/react-shared';
import { ITemplateLayout, PermissionsEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditTemplateLayoutDialog from './add-edit-template-layout-dialog';
import { StatusChip, getStatusConfig } from '../../components';
import { TableActionMenu } from '../../components/data-table';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';
import DataGrid from '@admin/app/components/data-grid/data-grid';
import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import { HEADER } from '@admin/app/layout/config';


function TemplateLayoutList() {
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();
    const { useGetTemplateLayout, useDeleteTemplateLayout } = useTemplateLayout();
    const { data, isLoading, refetch } = useGetTemplateLayout({});
    const { mutateAsync: deleteTemplateLayout } = useDeleteTemplateLayout();
    const datatableRef = useRef<DataTableApi<ITemplateLayout>>(null);
    const isDialogOpen = useBoolean();

    const canCreate = useHasPermission(PermissionsEnum.CREATE_TEMPLATE_LAYOUTS);
    const canUpdate = useHasPermission(PermissionsEnum.UPDATE_TEMPLATE_LAYOUTS);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_TEMPLATE_LAYOUTS);

    const handleEditTemplateLayout = useCallback((templateLayout: ITemplateLayout) => {
        navigate(PATH_DASHBOARD.templateLayouts.edit(templateLayout.id));
    }, [navigate]);

    const handleDeleteTemplateLayout = useCallback((templateLayout: ITemplateLayout) => {
        confirmDialog('Are you sure you want to delete this template layout?').then(async () => {
            try {
                await deleteTemplateLayout(templateLayout.id || '');
                showToasty('Template layout deleted successfully', 'success');
                refetch();
            } catch (error) {
                showToasty(error, 'error');
            }
        }).catch(() => {
            //
        });
    }, [
        confirmDialog,
        deleteTemplateLayout,
        showToasty,
        refetch,
    ]);

    const handleRowClick = useCallback((_event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
        if (canUpdate) {
            handleEditTemplateLayout(row.original);
        }
    }, [canUpdate, handleEditTemplateLayout]);

    const columns: DataTableColumn<ITemplateLayout>[] = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            enableGlobalFilter: true,
            enableSorting: true,
        },
        {
            accessorKey: 'displayName',
            header: 'Display Name',
            enableGlobalFilter: true,
            enableSorting: true,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            enableSorting: true,
        },
        {
            accessorKey: 'language',
            header: 'Language',
            enableSorting: true,
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            enableSorting: true,
            cell: ({ row }) => (
                <StatusChip
                    status={row.original.isActive ? 'active' : 'inactive'}
                    statusConfig={getStatusConfig('template')}
                />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            enableSorting: true,
            cell: ({ row }) => toDisplayDate(row.original.createdAt),
        },
        {
            id: 'action',
            header: 'Action',
            enablePinning: false,
            enableHiding: false,
            enableResizing: false,
            maxSize: 80,
            cell: ({ row }) => (
                <TableActionMenu
                    row={row.original}
                    {...(canDelete && { onDelete: () => handleDeleteTemplateLayout(row.original) })}
                    {...(canUpdate && { onEdit: () => handleEditTemplateLayout(row.original) })}
                />
            ),
        },
    ], [canDelete, canUpdate, handleDeleteTemplateLayout, handleEditTemplateLayout]);

    return (
        <Page
            title="Template Layouts"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Template Layouts',
                    href: PATH_DASHBOARD.templateLayouts.root,
                },
                { name: 'List' },
            ]}
        >
            <Card>
                <DataGrid
                    ref={datatableRef}
                    columns={columns}
                    idKey="id"
                    data={data || []}
                    totalRow={data?.length || 0}
                    loading={isLoading}
                    dataMode="client"
                    stateKey="templatelayoutlist"
                    maxHeight={`calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
                    enablePagination
                    onRowClick={canUpdate ? handleRowClick : undefined}
                    extraFilter={canCreate && (
                        <Button
                            onClick={() => isDialogOpen.onTrue()}
                            variant="contained"
                        >
                            New Template Layout
                        </Button>
                    )}
                />
            </Card>
            {
                isDialogOpen.value ? (
                    <AddEditTemplateLayoutDialog
                        onClose={() => isDialogOpen.onFalse()}
                    />
                ) : null
            }
        </Page>
    );
}

export default withRequirePermission(TemplateLayoutList, {
    permission: PermissionsEnum.ACCESS_TEMPLATE_LAYOUTS,
});
