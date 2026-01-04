import { useCrudOperations } from './use-crud-operations';
import { PermissionService } from '../services/permission.service';


const userService = PermissionService.getInstance<PermissionService>();

export const usePermission = () => {
    const {
        useGetMany,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useBulkRestore,
    } = useCrudOperations(userService);

    return {
        useGetManyPermission: useGetMany,
        useGetPermissionById: useGetOne,
        useCreatePermission: useCreate,
        useDeletePermission: useDelete,
        useUpdatePermission: useUpdate,
        useRestorePermission: useRestore,
        useDeleteForeverPermission: useDeleteForever,
        useBulkDeletePermission: useBulkDelete,
        useBulkDeleteForeverPermission: useBulkDeleteForever,
        useBulkRestorePermission: useBulkRestore,
    };
};
