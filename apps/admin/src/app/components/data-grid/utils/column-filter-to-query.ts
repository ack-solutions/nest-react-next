import { QueryBuilder, WhereOperatorEnum, WhereLogicalOperatorEnum } from '@ackplus/nest-crud-request';

/**
 * Frontend column filter rule (matches table.types ColumnFilterState.filters items).
 * We use only filters + logic; pendingFilters and pendingLogic are not sent to the server.
 */
export interface ColumnFilterRuleForQuery {
    columnId: string;
    operator: string;
    value: any;
    columnType?: string;
}

export interface ColumnFilterStateForQuery {
    filters: ColumnFilterRuleForQuery[];
    logic: 'AND' | 'OR';
}

/**
 * Maps frontend filter operator + columnType to backend condition object
 * compatible with QueryBuilder (WhereOperatorEnum).
 * Returns { $operator: value } with value formatted for the backend (e.g. % for like).
 */
export function mapFilterRuleToCondition(
    operator: string,
    value: any,
    columnType: string = 'text'
): Record<string, unknown> | null {
    const type = columnType || 'text';

    // --- Boolean: "is" with true/false/any ---
    if (type === 'boolean') {
        if (operator !== 'is') return null;
        if (value === 'any') return null; // no condition
        if (value === 'true' || value === true) return { [WhereOperatorEnum.IS_TRUE]: true };
        if (value === 'false' || value === false) return { [WhereOperatorEnum.IS_FALSE]: true };
        return { [WhereOperatorEnum.EQ]: value };
    }

    // --- Date ---
    if (type === 'date') {
        switch (operator) {
            case 'equals':
                return value != null ? { [WhereOperatorEnum.EQ]: value } : null;
            case 'notEquals':
                return value != null ? { [WhereOperatorEnum.NOT_EQ]: value } : null;
            case 'after':
                return value != null ? { [WhereOperatorEnum.GT]: value } : null;
            case 'before':
                return value != null ? { [WhereOperatorEnum.LT]: value } : null;
            case 'isEmpty':
                return { [WhereOperatorEnum.IS_NULL]: true };
            case 'isNotEmpty':
                return { [WhereOperatorEnum.IS_NOT_NULL]: true };
            default:
                return null;
        }
    }

    // --- Select: in, notIn, equals, notEquals ---
    if (type === 'select') {
        if (operator === 'in') {
            return Array.isArray(value) && value.length > 0
                ? { [WhereOperatorEnum.IN]: value }
                : null;
        }
        if (operator === 'notIn') {
            return Array.isArray(value) && value.length > 0
                ? { [WhereOperatorEnum.NOT_IN]: value }
                : null;
        }
        if (operator === 'equals') return { [WhereOperatorEnum.EQ]: value };
        if (operator === 'notEquals') return { [WhereOperatorEnum.NOT_EQ]: value };
        return null;
    }

    // --- Text / Number (and fallback) ---
    switch (operator) {
        case 'contains':
            return value != null && String(value).trim() !== ''
                ? { [WhereOperatorEnum.ILIKE]: `%${String(value)}%` }
                : null;
        case 'notContains':
            return value != null && String(value).trim() !== ''
                ? { [WhereOperatorEnum.NOT_ILIKE]: `%${String(value)}%` }
                : null;
        case 'startsWith':
            return value != null && String(value).trim() !== ''
                ? { [WhereOperatorEnum.ISTARTS_WITH]: String(value) }
                : null;
        case 'endsWith':
            return value != null && String(value).trim() !== ''
                ? { [WhereOperatorEnum.IENDS_WITH]: String(value) }
                : null;
        case 'isEmpty':
            return { [WhereOperatorEnum.IS_NULL]: true };
        case 'isNotEmpty':
            return { [WhereOperatorEnum.IS_NOT_NULL]: true };
        case 'equals':
            return { [WhereOperatorEnum.EQ]: value };
        case 'notEquals':
            return { [WhereOperatorEnum.NOT_EQ]: value };
        case 'greaterThan':
            return value != null ? { [WhereOperatorEnum.GT]: Number(value) } : null;
        case 'greaterThanOrEqual':
            return value != null ? { [WhereOperatorEnum.GT_OR_EQ]: Number(value) } : null;
        case 'lessThan':
            return value != null ? { [WhereOperatorEnum.LT]: Number(value) } : null;
        case 'lessThanOrEqual':
            return value != null ? { [WhereOperatorEnum.LT_OR_EQ]: Number(value) } : null;
        default:
            return null;
    }
}

/**
 * Builds a single grouped condition for all column filters ($and or $or),
 * so it can be applied with one andWhere() call (same idea as global search
 * using multiple orWhere for one $or group).
 */
export function buildColumnFilterGroup(
    columnFilter: ColumnFilterStateForQuery | undefined | null
): Record<string, unknown> | null {
    if (!columnFilter?.filters?.length) return null;

    const activeFilters = columnFilter.filters.filter(
        (f): f is ColumnFilterRuleForQuery => Boolean(f?.columnId && f?.operator)
    );
    if (activeFilters.length === 0) return null;

    const conditions: Record<string, unknown>[] = [];

    activeFilters.forEach((filter) => {
        const condition = mapFilterRuleToCondition(
            filter.operator,
            filter.value,
            filter.columnType || 'text'
        );
        if (condition == null) return;

        conditions.push({ [filter.columnId]: condition } as Record<string, unknown>);
    });

    if (conditions.length === 0) return null;

    const logic = columnFilter.logic === 'OR' ? WhereLogicalOperatorEnum.OR : WhereLogicalOperatorEnum.AND;
    return { [logic]: conditions };
}

/**
 * Applies column filter state (filters + logic only; pendingFilters are ignored)
 * to the given QueryBuilder as a single group (like global search), so it is
 * combined with the rest of the query via andWhere.
 */
export function applyColumnFilterToQueryBuilder(
    qb: QueryBuilder,
    columnFilter: ColumnFilterStateForQuery | undefined | null
): void {
    const group = buildColumnFilterGroup(columnFilter);
    if (group) qb.andWhere(group);
}
