import { IPage } from '@libs/types';
import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { PageService } from '../services';
import { useCrudOperations } from './use-crud-operations';


const pageService = PageService.getInstance<PageService>();

export const usePage = () => {
    const {
        useGetMany,
        fetchMany,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        useRestore,
        useDeleteForever,
        useBulkDelete,
        useBulkDeleteForever,
        useBulkRestore,
    } = useCrudOperations(pageService);

    const useGetBySlug = (slug?: any, options?: Partial<DefinedInitialDataOptions<IPage>>) => useQuery({
        queryKey: [pageService.getQueryKey('getPageBySlug'), slug],
        queryFn: () => pageService.getPageBySlug(slug),
        enabled: !!slug,
        ...options,
    });


    return {
        useGetBySlug,
        useGetManyPage: useGetMany,
        useFetchManyPage: fetchMany,
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
