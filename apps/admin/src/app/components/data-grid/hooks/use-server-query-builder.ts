import { useCallback } from 'react';
import { OrderDirectionEnum, QueryBuilder } from '@ackplus/nest-crud-request';
import { TableState } from '@ackplus/react-tanstack-data-table';
import { useLatestRef } from './use-latest-ref';

type FetchManyFn = (request: any) => Promise<any>;

interface Options<T> {
    columns: any[];
    fetchMany?: FetchManyFn;
    onFetchData?: (qb: QueryBuilder, filters?: Partial<TableState>) => Promise<{ data: T[]; total: number }>;
    mapQuery?: (qb: QueryBuilder, filters?: any) => Promise<QueryBuilder> | QueryBuilder;
    isTrash: boolean;
}

export function useServerQueryBuilder<T>({
    columns,
    fetchMany,
    onFetchData,
    mapQuery,
    isTrash,
}: Options<T>) {
    const columnsRef = useLatestRef(columns);
    const fetchManyRef = useLatestRef(fetchMany);
    const onFetchDataRef = useLatestRef(onFetchData);
    const mapQueryRef = useLatestRef(mapQuery);
    const isTrashRef = useLatestRef(isTrash);

    const fetchData = useCallback(async (filters?: Partial<TableState>) => {
        const cols = columnsRef.current;
        const trash = isTrashRef.current;

        let qb = new QueryBuilder();

        if (filters?.pagination) {
            qb.setSkip((filters.pagination.pageIndex || 0) * (filters.pagination.pageSize || 50));
            qb.setTake(filters.pagination.pageSize || 50);
        }

        if (filters?.sorting) {
            filters.sorting.forEach(sort => {
                qb.addOrder(sort.id, sort.desc ? OrderDirectionEnum.DESC : OrderDirectionEnum.ASC);
            });
        }

        // NOTE: you also sometimes handle globalFilter in mapQuery.
        // This default behavior is kept (search across enableGlobalFilter columns)
        if (filters?.globalFilter) {
            const globalCols = (cols || []).filter((c: any) => c.enableGlobalFilter);
            const searchCols = globalCols.map((c: any) => c.id || c.accessorKey);

            searchCols.forEach((col: string) => {
                qb.orWhere(col, { $iLike: `%${filters.globalFilter}%` });
            });
        }

        if (trash) qb.setOnlyDeleted(true);

        if (mapQueryRef.current) {
            qb = await mapQueryRef.current(qb, filters);
        }

        // Custom external fetch
        if (onFetchDataRef.current) {
            const res = await onFetchDataRef.current(qb, filters);
            return { data: res?.data || [], total: res?.total || 0 };
        }

        // Default fetchMany
        if (fetchManyRef.current) {
            const result = await fetchManyRef.current(qb.toObject()).catch(() => ({ items: [], total: 0 }));
            return {
                data: result?.items || result?.data || [],
                total: result?.total || 0,
            };
        }

        return { data: [], total: 0 };
    }, []);

    return { fetchData };
}
