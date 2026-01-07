import { Page } from '@admin/app/components/page';
import { useBoolean, useToasty } from '@admin/app/hook';
import { useTemplate } from '@libs/react-shared';
import { ITemplate, PermissionsEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditTemplateDialog from './add-edit-template-dialog';
import { StatusChip, getStatusConfig } from '../../components';
import { TableActionMenu } from '../../components/data-table';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';
import DataGrid from '@admin/app/components/data-grid/data-grid';
import { DataTableApi, DataTableColumn } from '@ackplus/react-tanstack-data-table';
import { HEADER } from '@admin/app/layout/config';

interface TemplateListProps {
    organizationId?: string;
}

function TemplateList({ organizationId }: TemplateListProps) {
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();
    const { useGetTemplate, useDeleteTemplate } = useTemplate();
    const { mutateAsync: deleteTemplate } = useDeleteTemplate();
    const datatableRef = useRef<DataTableApi<ITemplate>>(null);
    const isAddDialogOpen = useBoolean(false);

    const canCreate = useHasPermission(PermissionsEnum.CREATE_TEMPLATES);
    const canUpdate = useHasPermission(PermissionsEnum.UPDATE_TEMPLATES);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_TEMPLATES);

    const { data, isLoading, refetch } = useGetTemplate({
        scopeId: organizationId,
    });

    const handleEditTemplate = useCallback((template: ITemplate) => {
        navigate(PATH_DASHBOARD.templates.edit(template.id));
    }, [navigate]);

    const handleDeleteTemplate = useCallback((template: ITemplate) => {
        confirmDialog('Are you sure you want to delete this template?').then(async () => {
            await deleteTemplate(template.id).then(() => {
                showToasty('Template deleted successfully', 'success');
                refetch();
            }).catch((error) => {
                showToasty(error, 'error');
            });
        }).catch(() => {
            showToasty('Template deletion cancelled', 'error');
        });
    }, [
        confirmDialog,
        deleteTemplate,
        showToasty,
        refetch,
    ]);

    const handleRowClick = useCallback((_event: React.MouseEvent<HTMLTableRowElement>, row: any) => {
        if (canUpdate) {
            handleEditTemplate(row.original);
        }
    }, [canUpdate, handleEditTemplate]);

    const columns: DataTableColumn<ITemplate>[] = useMemo(() => [
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
                    {...(canDelete && { onDelete: () => handleDeleteTemplate(row.original) })}
                    {...(canUpdate && { onEdit: () => handleEditTemplate(row.original) })}
                />
            ),
        },
    ], [canDelete, canUpdate, handleDeleteTemplate, handleEditTemplate]);

    return (
        <Page
            title="Templates"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                {
                    name: 'Templates',
                    href: PATH_DASHBOARD.templates.root,
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
                    stateKey="templatelist"
                    maxHeight={`calc(100svh - ${HEADER.H_DESKTOP}px  - ${280}px)`}
                    enablePagination
                    onRowClick={canUpdate ? handleRowClick : undefined}
                    extraFilter={canCreate && (
                        <Button
                            onClick={() => isAddDialogOpen.onTrue()}
                            variant="contained"
                        >
                            New Template
                        </Button>
                    )}
                />
                <AddEditTemplateDialog
                    open={isAddDialogOpen.value}
                    onClose={() => isAddDialogOpen.onFalse()}
                />
            </Card>
        </Page>
    );
}

export default withRequirePermission(TemplateList, {
    permission: PermissionsEnum.ACCESS_TEMPLATES,
});
