import { RelationOptions, WhereOptions } from '@ackplus/nest-crud-request';


export interface ICrudControllerOptions {
    createDto: any;
    updateDto: any;
}

export enum OrderDirectionEnum {
    DESC = 'DESC',
    ASC = 'ASC',
}

/**
 * Describes generic pagination params
 */
export interface IPaginationRequest {
    /**
     * Pagination limit
     */
    take?: number;
    limit?: number;

    /**
     * Pagination offset
     */
    skip?: number;
    offset?: number;
    page?: number;
}

/**
 * Generic pagination interface
 */
export interface IPaginationResult<T> {
    /**
     * Items included in the current listing
     */
    items: T[];

    /**
     * Total number of available items
     */
    total: number;
}

export interface ICountResult {
    total: number;
    data?: Array<{ count: number, [key: string]: any }>;
}

export enum WhereConditionOperatorsEnum {
    BETWEEN = '$between',
    IN = '$in',
    NOT_IN = '$notIn',
    EQ = '$eq',
    NOT_EQ = '$notEq',
    LTE = '$lte',
    GTE = '$gte',
    LT = '$lt',
    GT = '$gt',
    IS_NULL = '$isNull',
    NOT_NULL = '$notNull',
    LIKE = '$like',
    I_LIKE = '$iLike',
}

export type IOperators =
    | '$in'
    | '$between'
    | '$in'
    | '$notIn'
    | '$eq'
    | '$notEq'
    | '$lte'
    | '$gte'
    | '$lt'
    | '$gt'
    | '$isNull'
    | '$notNull'
    | '$like'
    | '$iLike';

export type IConditionOperator = {
    // @ts-ignore
    [x: IOperators]: string | number;
};

export interface ISuccessResponse {
    message: string;
    success?: boolean;
}

export interface IWhereCondition {
    [x: string]: any;
    $and?: IWhereCondition | IWhereCondition[];
    $or?: IWhereCondition | IWhereCondition[];
}

export type IOrderBy = { [x: string]: OrderDirectionEnum };

export interface IFindOptions extends IPaginationRequest {
    withDeleted?: boolean;
    onlyDeleted?: boolean;
    select?: string[];
    relations?: RelationOptions;
    where?: WhereOptions;
    order?: Record<string, 'ASC' | 'DESC'>;
}
