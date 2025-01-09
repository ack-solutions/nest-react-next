import { IBaseEntity, IPaginationResult } from '@libs/types';
import { useQuery, useMutation, useQueryClient, DefinedInitialDataOptions, UseMutationOptions } from '@tanstack/react-query';

import { CRUDService } from '../services/crud-service';


export interface CreateQueryOptions<Input, Error, Response> extends UseMutationOptions<Input, Error, Response> {
    disableCacheUpdate?: boolean
}

export interface UpdateQueryOptions<Input, Error, Response> extends UseMutationOptions<Input, Error, Response> {
    disableCacheUpdate?: boolean
}


export function useCrudOperations<T extends IBaseEntity>(service: CRUDService<T>) {
    const queryClient = useQueryClient();


    const useGetAll = (request?: any, options?: Partial<DefinedInitialDataOptions<IPaginationResult<T>>>) => useQuery({
        queryKey: [service.getQueryKey('get-all'), request],
        queryFn: () => service.getAll(request),
        ...options,
    });

    const useGetMany = (request?: any, options?: Partial<DefinedInitialDataOptions<IPaginationResult<T>>>) => useQuery({
        queryKey: [service.getQueryKey('get-many'), request],
        queryFn: () => service.getMany(request),
        ...options,
    });


    const useGetOne = (id?: any, params?: any, options?: Partial<DefinedInitialDataOptions<T>>) => useQuery({
        queryKey: [service.getQueryKey('get-one'), id],
        queryFn: () => service.getOne(id, params),
        enabled: !!id,
        ...options,
    });


    const useCreate = (options?: CreateQueryOptions<Partial<T>, Error, T>) => useMutation({
        mutationFn: (input: Partial<T>) => service.create(input),
        onSuccess: (_data) => {
            invalidListQueryCache(queryClient, service);
        },
        ...options,
    });

    const useUpdate = (options?: UpdateQueryOptions<Partial<T>, Error, T>) => useMutation({
        mutationFn: ({ id, ...input }: Partial<T>) => service.update(id as any, input as Partial<T>),
        onSuccess: (data) => {
            invalidListQueryCache(queryClient, service);
            invalidUpdateOrCreateQueryCache(queryClient, service, data?.id);
        },
        ...options,
    });

    const useDelete = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: (_data, variable) => {
            invalidListQueryCache(queryClient, service);
            invalidUpdateOrCreateQueryCache(queryClient, service, variable);
        },
        ...options,
    });

    const useDeleteForever = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => service.permanentDelete(id),
        onSuccess: (_data, variable) => {
            invalidListQueryCache(queryClient, service);
            invalidUpdateOrCreateQueryCache(queryClient, service, variable);
        },
        ...options,
    });


    const useRestore = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => service.restore(id),
        onSuccess: (_data, variable) => {
            invalidListQueryCache(queryClient, service);
            invalidUpdateOrCreateQueryCache(queryClient, service, variable);
        },
        ...options,
    });


    const useBulkDelete = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (ids: string[]) => service.bulkDelete(ids),
        onSuccess: (_data, variable: string[]) => {
            variable.map((id) => {
                invalidUpdateOrCreateQueryCache(queryClient, service, id);
            });
            invalidListQueryCache(queryClient, service);
        },
        ...options,
    });


    const useBulkRestore = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (ids: string[]) => service.bulkRestore(ids),
        onSuccess: (_data, variable: string[]) => {
            variable.map((id) => {
                invalidUpdateOrCreateQueryCache(queryClient, service, id);
            });
            invalidListQueryCache(queryClient, service);
        },
        ...options,
    });


    const useBulkDeleteForever = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (ids: string[]) => service.bulkPermanentDelete(ids),
        onSuccess: (_data, variable: string[]) => {
            variable.map((id) => {
                invalidUpdateOrCreateQueryCache(queryClient, service, id);
            });
            invalidListQueryCache(queryClient, service);
        },
        ...options,
    });


    return {
        useGetAll,
        useGetMany,
        useGetOne,
        useCreate,
        useUpdate,
        useDelete,
        useDeleteForever,
        useRestore,
        useBulkDelete,
        useBulkRestore,
        useBulkDeleteForever,
    };
}


export function invalidListQueryCache(queryClient, service) {
    queryClient.invalidateQueries({
        predicate: (query) => {
            return query.queryKey[0] === service.getQueryKey('get-all') ||
                query.queryKey[0] === service.getQueryKey('get-many');
        },
    });
}

export function invalidUpdateOrCreateQueryCache(queryClient, service, id) {
    queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === id,
    });
}
