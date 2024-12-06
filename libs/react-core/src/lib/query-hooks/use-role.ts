
import { RoleService, useCrudOperations } from '@libs/react-core';

const service = RoleService.getInstance<RoleService>();

export const useRoleQuery = () => {
    const {
        useGetMany,
        useGetOne,
        useCreate,
        useDelete,
        useUpdate,
        useRestore,
        useBulkDelete,
        useBulkRestore,
        useBulkDeleteForever,
        useDeleteForever
    } = useCrudOperations(service);

    return {
        useGetManyRole: useGetMany,
        useGetRoleById: useGetOne,
        useCreateRole: useCreate,
        useDeleteRole: useDelete,
        useBulkDeleteRole: useBulkDelete,
        useUpdateRole: useUpdate,
        useRestoreRole: useRestore,
        useBulkRestoreRole: useBulkRestore,
        useBulkDeleteRoleForever: useBulkDeleteForever,
        useDeleteRoleForever: useDeleteForever,
    };
};
