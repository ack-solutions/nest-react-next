import { DataTableColumn } from '@admin/app/components';
import { CrudTable, CrudTableActions } from '@admin/app/components/crud/crud-table';
import AddEditNotificationTemplateDialog from '@admin/app/sections/setting/notification-setting/add-edit-notification-template-dialog';
import { useNotificationTemplateQuery } from '@libs/react-core';
import { INotificationTemplate } from '@libs/types';
import { toDisplayDate } from '@libs/utils';
import { Card } from '@mui/material';
import { startCase } from 'lodash';
import { useCallback, useRef, useState } from 'react';


const NotificationSetting = () => {
    const [notificationTemplate, setNotificationTemplate] = useState<INotificationTemplate>();
    const datatableRef = useRef<CrudTableActions>(null);
    const {
        useGetManyNotificationTemplate,
        useDeleteNotificationTemplate,
        useRestoreNotificationTemplate,
        useDeleteForeverNotificationTemplate,
        useBulkDeleteNotificationTemplate,
        useBulkRestoreNotificationTemplate,
        useBulkDeleteForeverNotificationTemplate,
    } = useNotificationTemplateQuery();

    const handleOpenEditNotificationTemplateDialog = useCallback(
        (value?: INotificationTemplate) => {
            setNotificationTemplate(value);
        },
        [],
    );
    const handleCloseEditNotificationTemplateDialog = useCallback(
        () => {
            setNotificationTemplate(null);
        },
        [],
    );

    const columns: DataTableColumn<INotificationTemplate>[] = [
        {
            name: 'title',
            label: 'Title',
            isSearchable: true,
            isSortable: true,
            render: (raw) => startCase(raw?.title),
        },
        {
            name: 'emailSubject',
            label: 'Email Subject',
            isSearchable: true,
            render: (raw) => startCase(raw?.emailSubject),
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
    ];
    return (
        <Card>
            <CrudTable
                hasSoftDelete
                crudName="NotificationTemplate"
                crudOperationHooks={{
                    useGetMany: useGetManyNotificationTemplate,
                    useDelete: useDeleteNotificationTemplate,
                    useRestore: useRestoreNotificationTemplate,
                    useDeleteForever: useDeleteForeverNotificationTemplate,
                    useBulkDelete: useBulkDeleteNotificationTemplate,
                    useBulkRestore: useBulkRestoreNotificationTemplate,
                    useBulkDeleteForever: useBulkDeleteForeverNotificationTemplate,
                }}
                onEdit={handleOpenEditNotificationTemplateDialog}
                ref={datatableRef}
                columns={columns}
            />
            {notificationTemplate && (
                <AddEditNotificationTemplateDialog
                    templateValues={notificationTemplate}
                    onClose={handleCloseEditNotificationTemplateDialog}
                />
            )}
        </Card>
    );
};

export default NotificationSetting;
