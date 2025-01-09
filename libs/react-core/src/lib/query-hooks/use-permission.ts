import { useCrudOperations } from '../hook';
import { PermissionService } from '../services';


const service = PermissionService.getInstance<PermissionService>();

export const usePermissionQuery = () => {
    const {
        useGetMany,
        useGetOne,
        useCreate,
        useDelete,
        useUpdate,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useBulkRestore,
    } = useCrudOperations(service);

    return {
        useGetManyPermission: useGetMany,
        useGetPermissionById: useGetOne,
        useCreatePermission: useCreate,
        useUpdatePermission: useUpdate,
        useDeletePermission: useDelete,
        useDeleteForeverPermission: useDeleteForever,
        useBulkDeletePermission: useBulkDelete,
        useBulkDeleteForeverPermission: useBulkDeleteForever,
        useRestorePermission: useRestore,
        useBulkRestorePermission: useBulkRestore,
    };
};
