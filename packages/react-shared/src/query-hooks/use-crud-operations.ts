import { IBaseEntity, ICountResult, IFindOptions, ISuccessResponse } from '@libs/types';
import { IPaginationResult } from '@libs/types';
import { useQuery, useMutation, useQueryClient, DefinedInitialDataOptions, UseMutationOptions } from '@tanstack/react-query';

import { CRUDService } from '../services/crud-service';


export interface CreateQueryOptions<Response, Error, Input> extends UseMutationOptions<Response, Error, Input> {
    disableCacheUpdate?: boolean;
    invalidateQueryKeys?: Array<FlexibleQueryKey> | ((variables: any, data: any) => Array<FlexibleQueryKey>);
}

type FlexibleQueryKey = string | readonly unknown[];
export interface UpdateQueryOptions<Response, Error, Input> extends UseMutationOptions<Response, Error, Input> {
    disableCacheUpdate?: boolean;
    invalidateQueryKeys?: Array<FlexibleQueryKey> | ((variables: any, data: any) => Array<FlexibleQueryKey>);
}

export function useCrudOperations<T extends IBaseEntity>(service: CRUDService<T>) {
    const queryClient = useQueryClient();

    const removeQueryCache = (options: any, variables?: any, data?: any) => {
        let keys = options?.invalidateQueryKeys;
        if (typeof keys === 'function') {
            keys = keys(variables, data);
        }
        const queryKeys = (keys || []).concat([
            service.getQueryKey('get-all'),
            service.getQueryKey('get-many'),
            service.getQueryKey('get-counts'),
        ]);
        if (queryKeys.length > 0) {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return queryKeys.some((targetKey) => {
                        const currentKey = query.queryKey;

                        // If targetKey is a string, match against first element
                        if (typeof targetKey === 'string') {
                            return currentKey[0] === targetKey;
                        }

                        // If array, do shallow prefix match
                        if (Array.isArray(targetKey)) {
                            return targetKey.every((part, index) => {
                                return currentKey[index] === part;
                            });
                        }

                        return false;
                    });
                },
            });
        }
    };

    const useGetAll = (request?: IFindOptions, options?: Partial<DefinedInitialDataOptions<T[]>>) => useQuery({
        queryKey: [service.getQueryKey('get-all'), request],
        queryFn: () => service.getAll(request),
        ...options,
    });

    const useGetMany = (request?: IFindOptions, options?: Partial<DefinedInitialDataOptions<IPaginationResult<T>>>) => useQuery({
        queryKey: [service.getQueryKey('get-many'), request],
        queryFn: () => service.getMany(request),
        ...options,
    });

    // builder for get-many (same key + fetcher)
    const buildGetManyQuery = (request?: IFindOptions) => ({
        queryKey: [service.getQueryKey('get-many'), request],
        queryFn: () => service.getMany(request),
    });

    // imperative fetch using the builder
    const fetchMany = async (request?: IFindOptions) => {
        const queryDef = buildGetManyQuery(request);
        // will reuse cache if fresh — this is the good pattern for “fetch on demand”  [oai_citation:1‡GitHub](https://github.com/TanStack/query/discussions/9135?utm_source=chatgpt.com)
        return queryClient.fetchQuery(queryDef);
    };



    const useGetOne = (id?: any, params?: any, options?: Partial<DefinedInitialDataOptions<T>>) => useQuery({
        queryKey: [service.getQueryKey('get'), id],
        queryFn: () => service.getOne(id, params),
        enabled: !!id,
        ...options,
    });

    const useGetCounts = (request?: { filter: IFindOptions, groupByKey?: string | string[] }, options?: Partial<DefinedInitialDataOptions<ICountResult>>) => useQuery({
        queryKey: [service.getQueryKey('get-counts'), request],
        queryFn: () => service.getCounts(request),
        ...options,
    });

    const useCreate = (options?: CreateQueryOptions<T, Error, Partial<T>>) => useMutation({
        mutationFn: (input: Partial<T>) => service.create(input),
        onSuccess: (data, variables, _context) => {
            removeQueryCache(options, variables, data);
        },
        ...options,
    });

    const useCreateMany = (options?: CreateQueryOptions<T[], Error, Partial<T>[]>) => useMutation({
        mutationFn: (input: Partial<T>[]) => service.createMany(input),
        onSuccess: (data, variables, _context) => {
            removeQueryCache(options, variables, data);
        },
        ...options,
    });

    const useUpdate = (options?: UpdateQueryOptions<T, Error, Partial<T>>) => useMutation({
        mutationFn: (input: Partial<T>) => service.update(input?.id as any, input),
        onSuccess: (data, variables, _context) => {
            removeQueryCache(options, variables, data);
            invalidUpdateOrCreateQueryCache(queryClient, service, data?.id);
        },
        ...options,
    });

    const useUpdateMany = (options?: UpdateQueryOptions<Partial<T>[], Error, Partial<T>[]>) => useMutation({
        mutationFn: (input: Partial<T>[]) => service.updateMany(input),
        onSuccess: (data, variables, _context) => {
            removeQueryCache(options, variables, data);
        },
        ...options,
    });

    const useDelete = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) => useMutation({
        mutationFn: (id: string) => service.delete(id),
        onSuccess: (_data, variable) => {
            removeQueryCache(options, variable);
            invalidUpdateOrCreateQueryCache(queryClient, service, variable);
        },
        ...options,
    });

    const useDeleteForever = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) => useMutation({
        mutationFn: (id: string) => service.permanentDelete(id),
        onSuccess: (_data, variable) => {
            removeQueryCache(options, variable);
            invalidUpdateOrCreateQueryCache(queryClient, service, variable);
        },
        ...options,
    });


    const useRestore = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) => useMutation({
        mutationFn: (id: string) => service.restore(id),
        onSuccess: (_data, variable) => {
            removeQueryCache(options, variable);
            invalidUpdateOrCreateQueryCache(queryClient, service, variable);
        },
        ...options,
    });


    const useBulkDelete = (options?: UpdateQueryOptions<ISuccessResponse, Error, string[]>) => useMutation({
        mutationFn: (ids: string[]) => service.bulkDelete(ids),
        onSuccess: (_data, variable: string[]) => {
            variable.map((id) => {
                return invalidUpdateOrCreateQueryCache(queryClient, service, id);
            });
            removeQueryCache(options, variable);
        },
        ...options,
    });


    const useBulkRestore = (options?: UpdateQueryOptions<ISuccessResponse, Error, string[]>) => useMutation({
        mutationFn: (ids: string[]) => service.bulkRestore(ids),
        onSuccess: (_data, variable: string[]) => {
            variable.map((id) => {
                return invalidUpdateOrCreateQueryCache(queryClient, service, id);
            });
            removeQueryCache(options, variable);
        },
        ...options,
    });


    const useBulkDeleteForever = (options?: UpdateQueryOptions<ISuccessResponse, Error, string[]>) => useMutation({
        mutationFn: (ids: string[]) => service.bulkPermanentDelete(ids),
        onSuccess: (_data, variable: string[]) => {
            variable.map((id) => {
                return invalidUpdateOrCreateQueryCache(queryClient, service, id);
            });
            removeQueryCache(options, variable);
        },
        ...options,
    });


    return {
        queryClient,
        useGetAll,
        useGetMany,
        useGetOne,
        useGetCounts,
        useCreate,
        useUpdate,
        useCreateMany,
        useUpdateMany,
        useDelete,
        useDeleteForever,
        useRestore,
        useBulkDelete,
        useBulkRestore,
        useBulkDeleteForever,
        removeQueryCache,
        buildGetManyQuery,
        fetchMany,
    };
}


export function invalidListQueryCache(queryClient, service) {
    queryClient.invalidateQueries({
        predicate: (query) => {
            return query.queryKey[0] === service.getQueryKey('get-all') ||
                query.queryKey[0] === service.getQueryKey('get-many') ||
                query.queryKey[0] === service.getQueryKey('get-counts');
        },
    });
}

export function invalidUpdateOrCreateQueryCache(queryClient, service, id) {
    queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === service.getQueryKey('get') && query.queryKey[1] === id,
    });
}
