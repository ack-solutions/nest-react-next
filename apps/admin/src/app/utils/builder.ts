import { QueryBuilder, WhereOperatorEnum } from "@ackplus/nest-crud-request";

export const searchBySplitName = (queryBuilder: QueryBuilder, search: string, columnKeys: string[]) => {
    if (!search || !queryBuilder || !Array.isArray(columnKeys)) return queryBuilder;
    const searchValues = search.split(' ').map(s => s.trim()).filter(Boolean);
    searchValues.forEach((searchValue) => {
        columnKeys.forEach((columnKey) => {
            queryBuilder.orWhere({
                [columnKey]: { [WhereOperatorEnum.ILIKE]: `%${searchValue}%` },
            });
        });
    });
    return queryBuilder;
};
