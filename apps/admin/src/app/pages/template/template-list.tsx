import { Page } from '@admin/app/components/page';
import { useAccess, withPermission } from '@admin/app/contexts';
import { useBoolean, useToasty } from '@admin/app/hook';
import { useTemplate } from '@libs/react-shared';
import { ITemplate, PermissionsEnum } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Button, Card } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditTemplateDialog from './add-edit-template-dialog';
import { StatusChip, getStatusConfig } from '../../components';
import { DataTable, TableActionMenu } from '../../components/data-table';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { PATH_DASHBOARD } from '../../routes/paths';


interface TemplateListProps {
    organizationId?: string;
}

function TemplateList({ organizationId }: TemplateListProps) {
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();
    const { useGetTemplate, useDeleteTemplate } = useTemplate();
    const { mutateAsync: deleteTemplate } = useDeleteTemplate();
    const datatableRef = useRef<any>(null);
    const isAddDialogOpen = useBoolean(false);
    const { hasPermission } = useAccess();

    // Permission checks
    const canCreate = hasPermission(PermissionsEnum.CREATE_TEMPLATES);
    const canUpdate = hasPermission(PermissionsEnum.UPDATE_TEMPLATES);
    const canDelete = hasPermission(PermissionsEnum.DELETE_TEMPLATES);

    const { data, isLoading } = useGetTemplate({
        scopeId: organizationId,
    });

    const handleEditTemplate = (template: ITemplate) => {
        navigate(PATH_DASHBOARD.templates.edit(template.id));
    };

    const handleDeleteTemplate = useCallback((template: ITemplate) => {
        confirmDialog('Are you sure you want to delete this template?').then(async () => {
            await deleteTemplate(template.id).then(() => {
                showToasty('Template deleted successfully', 'success');
                datatableRef.current?.refresh();
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
            render: (row: ITemplate) => (
                <StatusChip
                    status={row.isActive ? 'active' : 'inactive'}
                    statusConfig={getStatusConfig('template')}
                />
            ),
        },
        {
            name: 'createdAt',
            label: 'Created At',
            render: (row: ITemplate) => toDisplayDate(row.createdAt),
        },
        {
            name: 'action',
            label: 'Action',
            props: {
                sx: {
                    width: 120,
                },
            },
            render: (row: ITemplate) => (
                <TableActionMenu
                    row={row}
                    {...(canDelete && { onDelete: () => handleDeleteTemplate(row) })}
                    {...(canUpdate && { onEdit: () => handleEditTemplate(row) })}
                />
            ),
        },
    ];

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
                <DataTable
                    isLoading={isLoading}
                    ref={datatableRef}
                    data={data || null}
                    totalRow={data?.length || 0}
                    onRowClick={canUpdate ? handleEditTemplate : undefined}
                    columns={columns}
                    hasFilter
                    hideSearch
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

export default withPermission({
    permissions: [PermissionsEnum.ACCESS_TEMPLATES],
})(TemplateList);
