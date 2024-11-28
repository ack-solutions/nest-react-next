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

                // Set data so will not main get api call again.
                // queryClient.setQueryData(
                //     [service.getQueryKey('get'), data.id],
                //     (oldData: Partial<T>) => ({ ...oldData, ...data }))

                // Update data in List
                // queryClient.setQueriesData(
                //     {
                //         predicate: (query) => query.queryKey[0] === service.getQueryKey('get-all'),
                //     },
                //     (oldData: any) => ({
                //         ...oldData,
                //         data: [data, ...oldData.data]
                //     })
                // )
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

                // // Update cache data for list
                // queryClient.setQueryData(
                //     [service.getQueryKey('get'), data.id],
                //     (oldData: Partial<T>) => oldData ? Object.assign(oldData, data) : data)

                // // Update cache data for list
                // queryClient.setQueriesData(
                //     {
                //         predicate: (query) => query.queryKey[0] === service.getQueryKey('get-all') ||  || query.queryKey[0] === service.getQueryKey('data-grid'),
                //     },
                //     (oldData: IPagination<any>) => {

                //         const index = findIndex(oldData?.data, { id: data.id });
                //         let updatedData = oldData ? [...oldData.data] : [];
                //         if (index >= 0) {
                //             updatedData.splice(index, 1, data);
                //         } else {
                //             updatedData = [data, ...updatedData];
                //         }
                //         return {
                //             ...oldData,
                //             data: updatedData
                //         }
                //     }
                // )
            }
        },
        ...options,
    });

    const useDelete = (options?: any) => useMutation<string, Error, any>({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: (_data, variable) => {
            // Remove cache data for get one
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === variable
            })

            // Remove cache data for list
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
            })
        },
        ...options,
    });

    // const useBulkUpdate = (options?: UpdateQueryOptions<Partial<T>[], Error, T[]>) => useMutation({
    //     mutationFn: (input) => service.bulkUpdate(input) as any,
    //     onSuccess: (data) => {

    //         if (!options?.disableCacheUpdate) {
    //             queryClient.invalidateQueries({
    //                 predicate: (query) =>
    //                     query.queryKey[0] === service.getQueryKey('get')
    //             })
    //             queryClient.invalidateQueries({
    //                 predicate: (query) =>
    //                     query.queryKey[0] === service.getQueryKey('get-all') || query.queryKey[0] === service.getQueryKey('data-grid')
    //             })
    //         }
    //     },
    //     ...options,
    // });


    return { useGetMany, useGetOne, useCreate, useUpdate, useDelete };
}
