import { Page } from '@admin/app/components/page';
import { useBoolean, useToasty } from '@admin/app/hook';
import { useTemplateLayout } from '@libs/react-shared';
import { ITemplateLayout, PermissionsEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditTemplateLayoutDialog from './add-edit-template-layout-dialog';
import { StatusChip, getStatusConfig } from '../../components';
import { DataTable, TableActionMenu } from '../../components/data-table';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useHasPermission, withRequirePermission } from '@ackplus/nest-auth-react';


function TemplateLayoutList() {
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();
    const { useGetTemplateLayout, useDeleteTemplateLayout } = useTemplateLayout();
    const { data, isLoading } = useGetTemplateLayout({});
    const { mutateAsync: deleteTemplateLayout } = useDeleteTemplateLayout();
    const datatableRef = useRef<any>(null);
    const isDialogOpen = useBoolean();

    const canCreate = useHasPermission(PermissionsEnum.CREATE_TEMPLATE_LAYOUTS);
    const canUpdate = useHasPermission(PermissionsEnum.UPDATE_TEMPLATE_LAYOUTS);
    const canDelete = useHasPermission(PermissionsEnum.DELETE_TEMPLATE_LAYOUTS);

    const handleEditTemplateLayout = (templateLayout: ITemplateLayout) => {
        navigate(PATH_DASHBOARD.templateLayouts.edit(templateLayout.id));
    };

    const handleDeleteTemplateLayout = useCallback((templateLayout: ITemplateLayout) => {
        confirmDialog('Are you sure you want to delete this template layout?').then(async () => {
            try {
                await deleteTemplateLayout(templateLayout.id || '');
                showToasty('Template layout deleted successfully', 'success');
                datatableRef.current?.refresh();
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
    ]);

    const columns = [
        {
            name: 'name',
            label: 'Name',
        },
        {
            name: 'displayName',
            label: 'Display Name',
        },
        {
            name: 'type',
            label: 'Type',
        },
        {
            name: 'language',
            label: 'Language',
        },
        {
            name: 'isActive',
            label: 'Status',
            render: (row: ITemplateLayout) => (
                <StatusChip
                    status={row.isActive ? 'active' : 'inactive'}
                    statusConfig={getStatusConfig('template')}
                />
            ),
        },
        {
            name: 'createdAt',
            label: 'Created At',
            render: (row: ITemplateLayout) => toDisplayDate(row.createdAt),
        },
        {
            name: 'action',
            label: 'Action',
            props: {
                sx: {
                    width: 120,
                },
            },
            render: (row: ITemplateLayout) => (
                <TableActionMenu
                    row={row}
                    {...(canDelete && { onDelete: () => handleDeleteTemplateLayout(row) })}
                    {...(canUpdate && { onEdit: () => handleEditTemplateLayout(row) })}
                />
            ),
        },
    ];

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
                <DataTable
                    isLoading={isLoading}
                    ref={datatableRef}
                    data={data || null}
                    totalRow={data?.length || 0}
                    onRowClick={canUpdate ? handleEditTemplateLayout : undefined}
                    columns={columns}
                    hasFilter
                    hideSearch
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
