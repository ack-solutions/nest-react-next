
import { NotificationTemplateService, useCrudOperations } from '@libs/react-core';

const service = NotificationTemplateService.getInstance<NotificationTemplateService>();

export const useNotificationTemplateQuery = () => {
    const {
        useGetMany,
        useGetOne,
        useCreate,
        useDelete,
        useUpdate,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useRestore,
        useBulkRestore
    } = useCrudOperations(service);

    return {
        useGetManyNotificationTemplate: useGetMany,
        useGetNotificationTemplateById: useGetOne,
        useCreateNotificationTemplate: useCreate,
        useUpdateNotificationTemplate: useUpdate,
        useDeleteNotificationTemplate: useDelete,
        useDeleteForeverNotificationTemplate: useDeleteForever,
        useBulkDeleteNotificationTemplate: useBulkDelete,
        useBulkDeleteForeverNotificationTemplate: useBulkDeleteForever,
        useRestoreNotificationTemplate: useRestore,
        useBulkRestoreNotificationTemplate: useBulkRestore,
    };
};
