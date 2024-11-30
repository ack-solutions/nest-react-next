
import { NotificationTemplateService,  useCrudOperations } from '@libs/react-core';

const service = NotificationTemplateService.getInstance<NotificationTemplateService>();

export const useNotificationTemplateQuery = () => {
    const { useGetMany, useGetOne, useCreate, useDelete, useUpdate } = useCrudOperations(service);

    return {
        useGetManyNotificationTemplate: useGetMany,
        useGetNotificationTemplateById: useGetOne,
        useCreateNotificationTemplate: useCreate,
        useDeleteNotificationTemplate: useDelete,
        useUpdateNotificationTemplate: useUpdate,
    };
};
