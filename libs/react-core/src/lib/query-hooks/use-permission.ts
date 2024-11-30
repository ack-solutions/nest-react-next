
import { PermissionService, useCrudOperations } from '@libs/react-core';

const service = PermissionService.getInstance<PermissionService>();

export const usePermissionQuery = () => {
    const { useGetMany, useGetOne, useCreate, useDelete, useUpdate } = useCrudOperations(service);

    return {
        useGetManyPermission: useGetMany,
        useGetPermissionById: useGetOne,
        useCreatePermission: useCreate,
        useDeletePermission: useDelete,
        useUpdatePermission: useUpdate,
    };
};
