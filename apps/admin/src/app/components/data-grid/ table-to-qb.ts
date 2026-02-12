// table-to-qb.ts
import { QueryBuilder, OrderDirectionEnum } from "@ackplus/nest-crud-request";
import type { TableState } from "@ackplus/react-tanstack-data-table";
import { buildColumnFilterGroup } from "./column-filter-to-query";

export async function buildQBFromTableState<T>(opts: {
    columns: any[];
    filters?: Partial<TableState>;
    isTrash?: boolean;
    mapQuery?: (qb: QueryBuilder, filters?: Partial<TableState>) => Promise<QueryBuilder> | QueryBuilder;
}) {
    const { columns, filters, isTrash, mapQuery } = opts;

    let qb = new QueryBuilder({});
    // pagination
    if (filters?.pagination) {
        const pageIndex = filters.pagination.pageIndex ?? 0;
        const pageSize = filters.pagination.pageSize ?? 50;
        qb.setSkip(pageIndex * pageSize);
        qb.setTake(pageSize);
    }

    // sorting
    if (filters?.sorting?.length) {
        filters.sorting.forEach((sort) => {
            qb.addOrder(sort.id, sort.desc ? OrderDirectionEnum.DESC : OrderDirectionEnum.ASC);
        });
    }

    // global filter
    if (filters?.globalFilter) {
        const globalCols = (columns || []).filter((c: any) => c.enableGlobalFilter);
        const searchCols = globalCols.map((c: any) => c.id || c.accessorKey).filter(Boolean);

        qb.andWhere({
            $or: searchCols.map((col) => ({ [col]: { $iLike: `%${filters.globalFilter}%` } })),
        });

        // IMPORTANT: group OR conditions
        // If your QueryBuilder supports `qb.andWhere` with `$or`, use that.
        // Otherwise your current qb.orWhere approach is ok, but ensure it doesn't break other AND filters.
        // searchCols.forEach((col: string) => qb.orWhere(col, { $iLike: `%${filters.globalFilter}%` }));
    }

    // column filters
    if (filters?.columnFilter?.filters?.length) {

        const logic = filters.columnFilter?.logic ?? "AND";

        const conditions = buildColumnFilterGroup(filters.columnFilter?.filters);
        if (conditions?.length > 0) {
            qb.andWhere((sqb) => {
                if (logic === "AND") {
                    conditions.forEach((condition) => {
                        sqb.andWhere(condition);
                    });
                } else {
                    conditions.forEach((condition) => {
                        sqb.orWhere(condition);
                    });
                }
            });
        }
    }

    // trash
    if (isTrash) qb.setOnlyDeleted(true);

    // custom mapping (extra where, joins, etc.)
    if (mapQuery) qb = await mapQuery(qb, filters) as any;

    return qb;
}
