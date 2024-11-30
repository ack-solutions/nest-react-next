import { useQuery, useMutation, useQueryClient, DefinedInitialDataOptions, UseMutationOptions } from '@tanstack/react-query';
import { IBaseEntity, IPaginationResult } from "@libs/types";
import { CRUDService } from '../services/crud-service';


export interface CreateQueryOptions<Input, Error, Response> extends UseMutationOptions<Input, Error, Response> {
    disableCacheUpdate?: boolean
}

export interface UpdateQueryOptions<Input, Error, Response> extends UseMutationOptions<Input, Error, Response> {
    disableCacheUpdate?: boolean
}


export function useCrudOperations<T extends IBaseEntity>(service: CRUDService<T>) {
    const queryClient = useQueryClient();


    const useGetMany = (request?: any, options?: Partial<DefinedInitialDataOptions<IPaginationResult<T>>>) => useQuery({
        queryKey: [service.getQueryKey('get-all'), request],
        queryFn: () => service.getMany(request),
        ...options,
    });


    const useGetOne = (id?: any, params?: any, options?: Partial<DefinedInitialDataOptions<T>>) => useQuery({
        queryKey: [service.getQueryKey('get'), id],
        queryFn: () => service.getOne(id, params),
        enabled: !!id,
        ...options,
    });


    const useCreate = (options?: CreateQueryOptions<Partial<T>, Error, T>) => useMutation({
        mutationFn: (input: Partial<T>) => service.create(input),
        onSuccess: (data) => {
            if (!options?.disableCacheUpdate) {

                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === data.id
                })

                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
                })

            }
        },
        ...options,
    });

    const useUpdate = (options?: UpdateQueryOptions<Partial<T>, Error, T>) => useMutation({
        mutationFn: ({ id, ...input }: Partial<T>) => service.update(id as any, input as Partial<T>),
        onSuccess: (data) => {
            if (!options?.disableCacheUpdate) {
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === data.id
                })
                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
                })

            }
        },
        ...options,
    });

    const useDelete = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: (_data, variable) => {

            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === variable
            })

            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
            })
        },
        ...options,
    });

    const useTrashDelete = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => service.trashDelete(id),
        onSuccess: (_data, variable) => {

            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === variable
            })

            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
            })
        },
        ...options,
    });

    return { useGetMany, useGetOne, useCreate, useUpdate, useDelete, useTrashDelete };
}
