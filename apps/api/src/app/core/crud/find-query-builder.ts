import { Brackets, SelectQueryBuilder, Repository, DataSource, WhereExpressionBuilder, In, FindOptionsWhere, Not, IsNull } from "typeorm";
import { get, uniq, omit, map, concat, chain } from "lodash";
import { RequestContext } from "../request-context/request-context";
import { getDataSource } from "../../utils";
import { IFindOptions, IOrderBy, IWhereCondition, OrderDirectionEnum } from '@libs/types'

export class FindQueryBuilder<T> {

    private joins: string[] = [];
    dataSource: DataSource;
    distinctQuery: SelectQueryBuilder<T>;
    whereIndex = 0;

    constructor(
        protected repository: Repository<T>,
        protected options: IFindOptions
    ) {
        this.dataSource = getDataSource();
    }

    getCount() {
        if (!this.distinctQuery) {
            throw Error(`distinctQuery not created`)
        }
        return this.distinctQuery.clone().select(`COUNT(DISTINCT "id")`).getRawOne();
    }

    async getMany() {

        if (!this.distinctQuery) {
            throw Error(`distinctQuery not created`)
        }

        const idQuery = this.distinctQuery.clone()
        this.buildOrderBy(idQuery)
        idQuery.groupBy(`"distinct_alias"."id"`);

        if (this.options.take || this.options.limit) {
            idQuery.take(this.options.take || this.options.limit)
        }

        if (this.options.skip || this.options.offset) {
            idQuery.skip(this.options.skip || this.options.offset)
        } else if (this.options.page > 0) {
            const limit = this.options.take || this.options.limit;
            idQuery.skip(limit * (this.options.page - 1))
        }
        const rowIds = await idQuery.getRawMany();
        const ids = map(rowIds, 'id');

        const query: SelectQueryBuilder<T> = this.repository.createQueryBuilder();
        this.addSelect(query);

        // Merge "Join" and "Relations". I.e Join will not select
        const relations = chain(concat([], this.options.relations, this.joins)).uniq().filter((item) => Boolean(item)).value()

        for (const relation of relations) {
            // If added in `relations` params then it will select other wise it will just join for condition or order by
            const join = (this.options?.relations?.indexOf(relation) >= 0) ? 'leftJoinAndSelect' : 'leftJoin'
            this.addJoinInQuery(query, [relation], join)
        }

        query.setFindOptions({
            withDeleted: this.options.withDeleted || this.options.onlyDeleted,
            where: {
                id: In(ids)
            } as any
        });

        this.buildOrderBy(query)

        return query.getMany();
    }

    createDistinctQuery() {

        const primaryColumn = this.getPrimaryColumnName(this.repository);

        const distinctQuery = this.dataSource.createQueryBuilder()
            .select(`DISTINCT "distinct_alias"."id"`, "id")

        distinctQuery.from((sq) => {
            sq.from(this.repository.metadata.tableName, this.repository.metadata.name);
            sq.select(`${sq.alias}.${primaryColumn}`, 'id');

            this.addOrderBySelects(sq)
            this.buildWhereCondition(sq)

            sq.setFindOptions({
                withDeleted: this.options.withDeleted || this.options.onlyDeleted,
                where: {
                    ...(this.options.onlyDeleted ? { deletedAt: Not(IsNull()) } : {})
                    // ...this.addConditionInWhere({})
                }
            });


            if (this.joins?.length > 0) {
                this.addJoinInQuery(sq, this.joins, 'leftJoin')
            }
            return sq;
        }, 'distinct_alias')

        this.distinctQuery = distinctQuery
        return distinctQuery;
    }

    getPrimaryColumnName(repository) {
        if (repository?.metadata?.primaryColumns) {
            return repository?.metadata?.primaryColumns[0]?.propertyName;
        } else {
            return repository?.metadata.columns[0].propertyName;
        }
    }


    private buildOrderBy(query: SelectQueryBuilder<T>, alias?: string) {
        if (!alias) {
            alias = query.alias
        }
        const setOrderBy = (order: IOrderBy) => {
            for (const key in order) {
                if (Object.prototype.hasOwnProperty.call(order, key)) {
                    const direction = order[key];
                    if (alias === 'distinct_alias') {
                        query.addSelect(`(array_agg("${key}"))[1]`, key);
                    }
                    else {
                        const columnName = this.getColumnName(query, key);
                        query.addSelect(columnName, key)
                    }

                    query.orderBy(`"${key}"`, direction == OrderDirectionEnum.ASC ? 'ASC' : 'DESC', 'NULLS LAST')
                }
            }
        }

        if (this.options.order) {
            if (this.options.order instanceof Array) {
                for (let index = 0; index < this.options.order.length; index++) {
                    setOrderBy(this.options.order[index])
                }
            } else {
                setOrderBy(this.options.order)
            }
        }

        return query
    }

    private addSelect(query: SelectQueryBuilder<T>) {
        if (this.options.select instanceof Array) {
            const idColumnName = this.getColumnName(query, this.getPrimaryColumnName(this.repository))
            query.select(idColumnName);
            for (let index = 0; index < this.options.select.length; index++) {
                const columnName = this.getColumnName(query, this.options.select[index])
                query.addSelect(columnName)
            }
        }
    }

    private addOrderBySelects(query: SelectQueryBuilder<T>, alias?: string) {
        if (!alias) {
            alias = query.alias
        }
        const addSelect = (order: IOrderBy) => {
            for (const key in order) {
                if (Object.prototype.hasOwnProperty.call(order, key)) {
                    const columnName = this.getColumnName(query, key)
                    query.addSelect(columnName, key)
                }
            }
        }

        if (this.options.order) {
            if (this.options.order instanceof Array) {
                for (let index = 0; index < this.options.order.length; index++) {
                    addSelect(this.options.order[index])
                }
            } else {
                addSelect(this.options.order)
            }
        }
        return query
    }


    private buildWhereCondition(query: SelectQueryBuilder<T>) {

        const setWhereCondition = (condition: IWhereCondition | IWhereCondition[], sq: WhereExpressionBuilder, type: 'and' | 'or' = 'and') => {
            const conditionType = type === 'and' ? 'andWhere' : 'orWhere'

            if (condition instanceof Array) {
                sq[conditionType](new Brackets((whereQb) => {
                    for (let index = 0; index < condition.length; index++) {
                        setWhereCondition(condition[index], whereQb, type);
                    }
                }));
            } else {

                if (condition['$and']) {
                    sq[conditionType](new Brackets((whereQb) => {
                        setWhereCondition(condition['$and'], whereQb, 'and')
                    }));
                }

                if (condition['$or']) {
                    sq[conditionType](new Brackets((whereQb) => {
                        setWhereCondition(condition['$or'], whereQb, 'or')
                    }));
                }

                const extraConditions = omit(condition, '$or', '$and');

                for (const key in extraConditions) {
                    if (Object.prototype.hasOwnProperty.call(extraConditions, key)) {
                        let operator = '$eq';
                        let value = extraConditions[key];
                        const columnName = this.getColumnName(query, key);
                        const nestedKey = Object.keys(extraConditions[key])
                        if (`${nestedKey[0]}`.startsWith('$')) {
                            operator = nestedKey[0];
                            value = Object.values(extraConditions[key])[0]
                        }
                        const { conditionValue, conditionString } = this.createCondition(columnName, operator, value)
                        sq[conditionType](conditionString, conditionValue)
                    }
                }
            }
        }

        if (this.options.where) {
            setWhereCondition(this.options.where, query)
        }

        return query
    }


    private createCondition(columnName, operator, value) {
        let conditionString = ''
        let conditionValue = {}

        this.whereIndex = this.whereIndex + 1

        switch (operator) {

        case "$iLike":
        case "$like":
            conditionString = `${columnName}::TEXT ${operator == '$like' ? 'LIKE' : 'ILIKE'}  :value_${this.whereIndex}::TEXT`
            conditionValue = { [`value_${this.whereIndex}`]: `${value}` }
            break;

        case "$lte":
        case "$lt":
            conditionString = `${columnName} ${operator == '$lte' ? '<=' : '<'}  :value_${this.whereIndex}`
            conditionValue = { [`value_${this.whereIndex}`]: value }
            break;

        case "$gte":
        case "$gt":
            conditionString = `${columnName} ${operator == '$gte' ? '>=' : '>'}  :value_${this.whereIndex}`
            conditionValue = { [`value_${this.whereIndex}`]: value }
            break;

        case "$eq":
        case "$notEq":
            if (value) {
                conditionString = `${columnName} ${operator == '$notEq' ? '!=' : '='}  :value_${this.whereIndex}`
                conditionValue = { [`value_${this.whereIndex}`]: value }
            }
            break;

        case "$isNull":
        case "$notNull":
            conditionString = `${columnName} ${operator == '$isNull' ? 'IS NULL' : 'IS NOT NULL'}`
            break;

        case "$in":
        case "$notIn":
            if (value?.length > 0) {
                conditionString = `${columnName} ${operator == '$notIn' ? 'NOT IN' : 'IN'} (:...value_${this.whereIndex})`
                conditionValue = { [`value_${this.whereIndex}`]: value }
            } else {
                throw Error(`${columnName} aspects array but received ${typeof value}`)
            }
            break;

        case "$between":
            if (value?.length == 2) {
                conditionString = `${columnName} BETWEEN  :startValue_${this.whereIndex} AND :endValue_${this.whereIndex}`
                conditionValue = { [`startValue_${this.whereIndex}`]: value[0], [`endValue_${this.whereIndex}`]: value[1] }
            } else {
                throw Error(`${columnName} aspects array with two value`)
            }
            break;

        default:
            throw Error(`${operator} operator not supported`)
        }

        return { conditionString, conditionValue }
    }

    private getColumnName(query, name) {
        const columnMap = propertyMap(query.alias);

        if (name.indexOf('.') === -1) {
            const dbName = columnMap[name] || name;
            return `"${query.alias}"."${dbName}"`;
        } else {
            const dbName = get(columnMap, name);
            const parts: string[] = name.split('.');
            const lastPart = parts.pop();
            const colName = dbName || lastPart;
            const fieldName = `"${parts.join('_')}"."${colName}"`
            const relationStr = [];
            for (const part of parts) {
                relationStr.push(part)
                this.joins.push(relationStr.join('.'));
            }
            return fieldName;
        }
    }

    private addJoinInQuery(query: SelectQueryBuilder<T>, relations: string[], join: string) {
        relations = uniq(relations)
        relations.forEach((relation) => {
            if (relation.indexOf('.') >= 0) {
                const parts = relation.split('.');
                const newAlisa = parts.join('_');
                const relationName = parts.pop();
                const relationAlias = parts.join('_')
                query[join](`${relationAlias}.${relationName}`, newAlisa);
            } else {
                query[join](`${query.alias}.${relation}`, relation);
            }
        })
    }

    private checkOrganizationIdColumn(): boolean {

        return false;


    }

    private checkBusinessIdColumn(): boolean {
        // Obtain the metadata for the entity
        const metadata = this.repository.metadata;
        // Check if the `businessId` column exists
        return metadata.columns.some(column => column.propertyName === 'businessId');
    }

    // private addConditionInWhere(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
    //   if (this.checkOrganizationIdColumn()) {
    //     const organizationId = RequestContext.currentBusinessId() as any;
    //     where = {
    //       ...where,
    //       organizationId,
    //     } as any

    //   }

    //   if (this.checkBusinessIdColumn()) {
    //     const businessId = RequestContext.currentBusinessId() as any;
    //     where = {
    //       ...where,
    //       businessId,
    //     } as any
    //   }
    //   return where;
    // }
}

export function propertyMap(entity) {
    const dataSource = getDataSource();
    let metadata;
    if (typeof entity === 'object') {
        metadata = entity;
    } else {
        metadata = dataSource.getRepository(entity).metadata;
    }

    const map = {};
    for (const column of metadata.ownColumns) {
        map[column.propertyName] = column.databaseName;
    }
    let relationMap = {}
    // Added this condition because need to lod only one level relation
    if (typeof entity === 'string') {
        relationMap = relationPropertyMap(metadata)
    }
    return { ...map, ...relationMap };
}

function relationPropertyMap(metadata) {
    const map = {};
    for (const relation of metadata.ownRelations) {
        map[relation.propertyPath] = propertyMap(relation.inverseEntityMetadata)
    }
    return map;
}
