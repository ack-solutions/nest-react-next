import { DataTable, DataTableColumn, DataTableHandle, TableActionMenu } from '@admin/app/components'
import { useConfirm } from '@admin/app/contexts/confirm-dialog-context';
import { useNotificationTemplateQuery, useToasty } from '@libs/react-core';
import { INotificationTemplate } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Box, Button } from '@mui/material';
import { useCallback, useRef, useState } from 'react'
import AddEditNotificationTemplateDialog from './add-edit-notification-template-dialog';
import { startCase } from 'lodash';

const NotificationSetting = () => {
    const [notificationTemplate, setNotificationTemplate] = useState<INotificationTemplate>()
    const { showToasty } = useToasty();
    const deleteConfirm = useConfirm();
    const datatableRef = useRef<DataTableHandle>(null);
    const [notificationTemplateRequest, setNotificationTemplateRequest] = useState()
    const { useGetManyNotificationTemplate, useDeleteNotificationTemplate } = useNotificationTemplateQuery()
    const { data: notificationData, refetch } = useGetManyNotificationTemplate(notificationTemplateRequest, {
        enabled: !!notificationTemplateRequest
    })
    const { mutate: deleteNotificationTemplate } = useDeleteNotificationTemplate()

    const handleOpenEditNotificationTemplateDialog = useCallback(
        (value?: INotificationTemplate) => () => {
            setNotificationTemplate(value)
        },
        [],
    )
    const handleCloseEditNotificationTemplateDialog = useCallback(
        (isRefresh) => {
            setNotificationTemplate(null)
            if (isRefresh) {
                refetch()
                datatableRef.current.refresh()
            }
        },
        [datatableRef],
    )

    const handleDataTableChange = useCallback((filter: any) => {
        filter = {
            ...filter,
            s: {
                ...filter?.s,
            },
        };
        setNotificationTemplateRequest(filter)
    }, []);

    const handleDeleteNotificationTemplate = useCallback(
        (row: any) => {
            if (row.id) {
                deleteConfirm(
                    {
                        title: row.deletedAt ? "Permanent Delete" : "Delete",
                        message: `Are you sure you want to ${row.deletedAt ? "permanent delete" : "delete"} this notification template?`
                    })
                    .then(async () => {

                        try {
                            deleteNotificationTemplate(row.id, {
                                onError: (error) => {
                                    showToasty(error.message, 'error');
                                },
                                onSuccess: () => {
                                    showToasty('Notification Template successfully deleted');
                                }
                            })
                            datatableRef?.current?.refresh();
                        } catch (error: any) {
                            showToasty(error, 'error');
                        }
                    })
                    .catch(() => {
                        //
                    });
            }

        },
        [deleteConfirm, showToasty]
    );

    const columns: DataTableColumn<INotificationTemplate>[] = [
        {
            name: 'title',
            label: 'Title',
            isSearchable: true,
            isSortable: true,
            render: (raw) => startCase(raw?.title)
        },
        {
            name: 'emailSubject',
            label: 'Email Subject',
            isSearchable: true,
            render: (raw) => startCase(raw?.emailSubject)
        },
        {
            name: 'slug',
            label: 'Slug',
            isSearchable: true,
            isSortable: true,
        },
        {
            name: 'event',
            label: 'Event',
            isSearchable: true,
        },
        {
            name: 'createdAt',
            label: 'Created Date',
            isSearchable: false,
            isSortable: true,
            render: (row) => toDisplayDate(row?.createdAt),
        },
        {
            name: 'action',
            label: 'Action',
            isAction: true,
            render: (row: any) => (
                <TableActionMenu
                    row={row}
                    onDelete={() => handleDeleteNotificationTemplate(row)}
                    {...!row?.deletedAt ? { onEdit: handleOpenEditNotificationTemplateDialog(row) } : {}}
                />
            ),
            props: { sx: { width: 150 } }
        },
    ];
    return (
        <Box>
            <DataTable
                data={notificationData?.items}
                columns={columns}
                ref={datatableRef}
                totalRow={notificationData?.total}
                defaultOrder='desc'
                defaultOrderBy='createdAt'
                onChange={handleDataTableChange}
                hasFilter
                detailRowTitle='Notification Templates'
                topAction={<Button
                    variant='contained'
                    onClick={handleOpenEditNotificationTemplateDialog({})}
                >
                    Add Template
                </Button>}
            />
            {notificationTemplate && (
                <AddEditNotificationTemplateDialog
                    templateValues={notificationTemplate}
                    onClose={handleCloseEditNotificationTemplateDialog}
                />
            )}
        </Box>
    )
}

export default NotificationSetting