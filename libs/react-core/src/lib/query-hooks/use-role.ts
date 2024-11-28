
import { RoleService, useCrudOperations } from '@libs/react-core';

const service = RoleService.getInstance<RoleService>();

export const useRoleQuery = () => {
    const { useGetMany, useGetOne, useCreate, useDelete, useUpdate } = useCrudOperations(service);

    return {
        useGetManyRole: useGetMany,
        useGetRoleById: useGetOne,
        useCreateRole: useCreate,
        useDeleteRole: useDelete,
        useUpdateRole: useUpdate,
    };
};
