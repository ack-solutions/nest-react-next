import { useTemplate } from '@libs/react-shared';
import { PermissionsEnum } from '@libs/types';
import { ITemplate, TemplateTypeEnum } from '@libs/types';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddEditEmailTemplateDialog from './add-edit-email-template-dialog';
import { Page, StatusLabel, getStatusConfig } from '../../components';
import { DataTable, TableActionMenu } from '../../components/data-table';
import { useConfirm } from '../../contexts/confirm-dialog-context';
import { useToasty } from '../../hook';
import { PATH_DASHBOARD } from '../../routes/paths';
import { withRequirePermission } from '@ackplus/nest-auth-react';


function EmailTemplateList() {
    const navigate = useNavigate();
    const confirmDialog = useConfirm();
    const { showToasty } = useToasty();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const { useGetTemplate, useDeleteTemplate } = useTemplate();
    const { data: templates, isLoading, refetch } = useGetTemplate({
        type: TemplateTypeEnum.EMAIL, // Filter only email templates
    });
    const { mutateAsync: deleteTemplate } = useDeleteTemplate();

    const handleEdit = useCallback((template: ITemplate) => {
        navigate(PATH_DASHBOARD.emailTemplates.edit(template.id));
    }, [navigate]);

    const handleDelete = useCallback((template: ITemplate) => {
        confirmDialog({
            title: 'Delete Email Template',
            message: 'Are you sure you want to delete this email template?',
        }).then(async () => {
            try {
                await deleteTemplate(template.id);
                showToasty('Email template deleted successfully', 'success');
                refetch();
            } catch (error) {
                showToasty('Failed to delete email template', 'error');
            }
        }).catch(() => {
            // User cancelled
        });
    }, [
        confirmDialog,
        deleteTemplate,
        showToasty,
        refetch,
    ]);

    const handleCreateNew = useCallback(() => {
        setIsCreateDialogOpen(true);
    }, []);

    const handleCloseCreateDialog = useCallback(() => {
        setIsCreateDialogOpen(false);
        refetch(); // Refresh the list after creating
    }, [refetch]);

    const statusConfig = getStatusConfig('general');

    const columns = [
        {
            name: 'displayName',
            field: 'displayName',
            headerName: 'Template Name',
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="body2" fontWeight="medium">
                        {params.row.displayName}
                    </Typography>
                </Stack>
            ),
        },
        {
            name: 'subject',
            field: 'subject',
            headerName: 'Subject',
            flex: 1,
            minWidth: 200,
            renderCell: (params: any) => (
                <Typography variant="body2" color="text.secondary">
                    {params.row.subject || 'No subject'}
                </Typography>
            ),
        },
        {
            name: 'language',
            field: 'language',
            headerName: 'Language',
            width: 100,
            renderCell: (params: any) => (
                <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                    {params.row.language}
                </Typography>
            ),
        },
        {
            name: 'templateLayoutName',
            field: 'templateLayoutName',
            headerName: 'Layout',
            width: 150,
            renderCell: (params: any) => (
                <Typography variant="body2" color="text.secondary">
                    {params.row.templateLayoutName || 'No layout'}
                </Typography>
            ),
        },
        {
            name: 'isActive',
            field: 'isActive',
            headerName: 'Status',
            width: 120,
            renderCell: (params: any) => (
                <StatusLabel
                    status={params.row.isActive ? 'active' : 'inactive'}
                    statusConfig={statusConfig}
                    defaultVariant="soft"
                />
            ),
        },
        {
            name: 'createdAt',
            field: 'createdAt',
            headerName: 'Created',
            width: 150,
            renderCell: (params: any) => (
                <Typography variant="body2" color="text.secondary">
                    {new Date(params.row.createdAt).toLocaleDateString()}
                </Typography>
            ),
        },
        {
            name: 'actions',
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params: any) => (
                <TableActionMenu
                    row={params.row}
                    onEdit={() => handleEdit(params.row)}
                    onDelete={() => handleDelete(params.row)}
                />
            ),
        },
    ];

    return (
        <Page
            title="Email Templates"
            breadcrumbs={[
                {
                    name: 'Dashboard',
                    href: PATH_DASHBOARD.root,
                },
                { name: 'Email Templates' },
            ]}
            actions={(
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNew}
                >
                    Create Email Template
                </Button>
            )}
        >
            <Card>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={templates || []}
                        isLoading={isLoading}
                        idKey="id"
                        totalRow={templates?.length || 0}
                        showPagination={false}
                        noOptionsText={(
                            <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No email templates found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create your first email template to get started.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleCreateNew}
                                >
                                    Create Email Template
                                </Button>
                            </Stack>
                        )}
                    />
                </CardContent>
            </Card>

            <AddEditEmailTemplateDialog
                open={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
            />
        </Page>
    );
}

export default withRequirePermission(EmailTemplateList, {
    permission: PermissionsEnum.ACCESS_EMAIL_TEMPLATES,
});
