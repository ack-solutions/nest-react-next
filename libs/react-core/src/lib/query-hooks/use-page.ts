import { useCrudOperations } from '@libs/react-core';
import { PageService } from '../services/page.service';

const Service = PageService.getInstance<PageService>();

export const usePage = () => {
    const { useGetMany, useGetOne, useCreate, useDelete, useUpdate } = useCrudOperations(Service);

    return {
        useGetManyPage: useGetMany,
        useGetPageById: useGetOne,
        useCreatePage: useCreate,
        useDeletePage: useDelete,
        useUpdatePage: useUpdate,
    };
};
