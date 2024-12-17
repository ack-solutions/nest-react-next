import { useCrudOperations } from '../hook';
import { PageService } from '../services/page.service';

const Service = PageService.getInstance<PageService>();

export const usePage = () => {
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
    } = useCrudOperations(Service);

    return {
        useGetManyPage: useGetMany,
        useGetPageById: useGetOne,
        useCreatePage: useCreate,
        useDeletePage: useDelete,
        useUpdatePage: useUpdate,
        useRestorePage: useRestore,
        useDeleteForeverPage: useDeleteForever,
        useBulkDeletePage: useBulkDelete,
        useBulkDeleteForeverPage: useBulkDeleteForever,
        useBulkRestorePage: useBulkRestore,
    };
};
