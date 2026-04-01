import {
    IBaseEntity,
    ICountResult,
    IFindOptions,
    ISuccessResponse,
    IPaginationResult,
} from '@libs/types';
import {
    useQuery,
    useMutation,
    useQueryClient,
    DefinedInitialDataOptions,
    UseMutationOptions,
    QueryKey,
    QueryClient,
} from '@tanstack/react-query';

import { CRUDService } from '../services/crud-service';

type FlexibleQueryKey = QueryKey | string;

/** Extends React Query mutation options with our invalidation helpers */
export interface CrudMutationOptions<Response, TError, TVariables>
    extends UseMutationOptions<Response, TError, TVariables> {
    /**
     * If true, skip automatic invalidations (useful for bulk ops / export flows).
     */
    disableCacheUpdate?: boolean;

    /**
     * Extra query keys to invalidate in addition to default CRUD list keys.
     * - string: treated as `[string]`
     * - array: treated as queryKey directly
     * - function: receives (variables, data) and returns keys
     */
    invalidateQueryKeys?:
    | Array<FlexibleQueryKey>
    | ((variables: any, data: any) => Array<FlexibleQueryKey>);
}

export type CreateQueryOptions<Response, Error, Input> = CrudMutationOptions<Response, Error, Input>;
export type UpdateQueryOptions<Response, Error, Input> = CrudMutationOptions<Response, Error, Input>;

function asQueryKey(key: FlexibleQueryKey): QueryKey {
    return typeof key === 'string' ? [key] : key;
}

function invalidateCrudLists<T extends IBaseEntity>(queryClient: QueryClient, service: CRUDService<T>,) {
    queryClient.invalidateQueries({ queryKey: [service.getQueryKey('get-all')] });
    queryClient.invalidateQueries({ queryKey: [service.getQueryKey('get-many')] });
    queryClient.invalidateQueries({ queryKey: [service.getQueryKey('get-counts')] });
}

export function invalidListQueryCache<T extends IBaseEntity>(queryClient: QueryClient, service: CRUDService<T>) {
    invalidateCrudLists(queryClient, service);
}

export function invalidUpdateOrCreateQueryCache<T extends IBaseEntity>(queryClient: QueryClient, service: CRUDService<T>, id: string) {
    queryClient.invalidateQueries({
        queryKey: [service.getQueryKey('get'), id],
    });
}

export function useCrudOperations<T extends IBaseEntity>(service: CRUDService<T>) {
    const queryClient = useQueryClient();

    /**
     * Central invalidation helper:
     * - invalidates default list keys (get-all, get-many, get-counts)
     * - invalidates any custom keys provided in options.invalidateQueryKeys
     */
    type AnyCrudOptions = CrudMutationOptions<any, any, any> | undefined;

    const invalidateAfterMutation = (
        options: AnyCrudOptions,
        variables?: unknown,
        data?: unknown,
    ) => {
        if (!options?.disableCacheUpdate) {
            invalidateCrudLists(queryClient, service);
        }

        const rawKeys = options?.invalidateQueryKeys ?? [];
        const extraKeys: Array<FlexibleQueryKey> =
            typeof rawKeys === 'function' ? (rawKeys(variables, data) ?? []) : rawKeys;

        for (const k of extraKeys) {
            queryClient.invalidateQueries({ queryKey: asQueryKey(k) });
        }
    };

    /**
     * IMPORTANT: Use one key builder everywhere (hooks + imperative fetch),
     * so cache is consistent and invalidation works reliably.
     */
    const getAllKey = (request?: IFindOptions) => [service.getQueryKey('get-all'), request ?? null] as const;

    const getManyKey = (request?: IFindOptions) => [service.getQueryKey('get-many'), request ?? null] as const;

    const getOneKey = (id?: any, params?: any) => [service.getQueryKey('get'), id ?? null, params ?? null] as const;

    const getCountsKey = (request?: { filter: IFindOptions; groupByKey?: string | string[] }) => [service.getQueryKey('get-counts'), request ?? null] as const;

    // -------------------- Queries --------------------

    const useGetAll = (request?: IFindOptions, options?: Partial<DefinedInitialDataOptions<T[]>>) =>
        useQuery({
            queryKey: getAllKey(request),
            queryFn: () => service.getAll(request),
            ...options
        });

    const useGetMany = (request?: IFindOptions, options?: Partial<DefinedInitialDataOptions<IPaginationResult<T>>>) =>
        useQuery({
            queryKey: getManyKey(request),
            queryFn: () => service.getMany(request),
            ...options,
        });

    /**
     * Imperative fetch for cases like export / background fetch / multi-page loop.
     * Uses SAME key as useGetMany, so it can share cache when you want it to.
     */
    const fetchMany = (request?: IFindOptions) =>
        queryClient.fetchQuery({
            queryKey: getManyKey(request),
            queryFn: () => service.getMany(request),
        });
    /**
     * No-cache variant (export flows where you never want caching).
     * (This is optional but usually handy.)
     */
    const fetchManyNoCache = (request?: IFindOptions) => service.getMany(request);

    const useGetOne = (id?: any, params?: any, options?: Partial<DefinedInitialDataOptions<T>>) =>
        useQuery({
            queryKey: getOneKey(id, params),
            queryFn: () => service.getOne(id, params),
            enabled: !!id,
            ...options,
        });

    const useGetCounts = (request?: { filter: IFindOptions; groupByKey?: string | string[] }, options?: Partial<DefinedInitialDataOptions<ICountResult>>) =>
        useQuery({
            queryKey: getCountsKey(request),
            queryFn: () => service.getCounts(request),
            ...options,
        });

    // -------------------- Mutations (compose callbacks safely) --------------------

    const useCreate = (options?: CreateQueryOptions<T, Error, Partial<T>>) =>
        useMutation({
            mutationFn: (input: Partial<T>) => service.create(input),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useCreateMany = (options?: CreateQueryOptions<T[], Error, Partial<T>[]>) =>
        useMutation({
            mutationFn: (input: Partial<T>[]) => service.createMany(input),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useUpdate = (options?: UpdateQueryOptions<T, Error, Partial<T>>) =>
        useMutation({
            mutationFn: (input: Partial<T>) => service.update(input?.id as any, input),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);

                // Also refresh the single-entity query
                if (!options?.disableCacheUpdate && data?.id) {
                    invalidUpdateOrCreateQueryCache(queryClient, service, String(data.id));
                }

                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useUpdateMany = (
        options?: UpdateQueryOptions<Partial<T>[], Error, Partial<T>[]>,
    ) =>
        useMutation({
            mutationFn: (input: Partial<T>[]) => service.updateMany(input),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useDelete = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) =>
        useMutation({
            mutationFn: (id: string) => service.delete(id),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                if (!options?.disableCacheUpdate) {
                    invalidUpdateOrCreateQueryCache(queryClient, service, String(variables));
                }
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useDeleteForever = (
        options?: UpdateQueryOptions<ISuccessResponse, Error, string>,
    ) =>
        useMutation({
            mutationFn: (id: string) => service.permanentDelete(id),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                if (!options?.disableCacheUpdate) {
                    invalidUpdateOrCreateQueryCache(queryClient, service, String(variables));
                }
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useRestore = (options?: UpdateQueryOptions<ISuccessResponse, Error, string>) =>
        useMutation({
            mutationFn: (id: string) => service.restore(id),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                if (!options?.disableCacheUpdate) {
                    invalidUpdateOrCreateQueryCache(queryClient, service, String(variables));
                }
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useBulkDelete = (
        options?: UpdateQueryOptions<ISuccessResponse, Error, string[]>,
    ) =>
        useMutation({
            mutationFn: (ids: string[]) => service.bulkDelete(ids),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                if (!options?.disableCacheUpdate) {
                    for (const id of variables ?? []) {
                        invalidUpdateOrCreateQueryCache(queryClient, service, String(id));
                    }
                }
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useBulkRestore = (
        options?: UpdateQueryOptions<ISuccessResponse, Error, string[]>,
    ) =>
        useMutation({
            mutationFn: (ids: string[]) => service.bulkRestore(ids),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                if (!options?.disableCacheUpdate) {
                    for (const id of variables ?? []) {
                        invalidUpdateOrCreateQueryCache(queryClient, service, String(id));
                    }
                }
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    const useBulkDeleteForever = (
        options?: UpdateQueryOptions<ISuccessResponse, Error, string[]>,
    ) =>
        useMutation({
            mutationFn: (ids: string[]) => service.bulkPermanentDelete(ids),
            ...options,
            onSuccess: (data, variables, onMutationSuccess, context) => {
                invalidateAfterMutation(options, variables, data);
                if (!options?.disableCacheUpdate) {
                    for (const id of variables ?? []) {
                        invalidUpdateOrCreateQueryCache(queryClient, service, String(id));
                    }
                }
                options?.onSuccess?.(data, variables, onMutationSuccess, context);
            },
        });

    return {
        queryClient,

        // queries
        useGetAll,
        useGetMany,
        useGetOne,
        useGetCounts,

        // imperative
        fetchMany,
        fetchManyNoCache,

        // mutations
        useCreate,
        useCreateMany,
        useUpdate,
        useUpdateMany,
        useDelete,
        useDeleteForever,
        useRestore,
        useBulkDelete,
        useBulkRestore,
        useBulkDeleteForever,

        // invalidation helper (kept, but renamed behavior)
        invalidateAfterMutation,
    };
}
