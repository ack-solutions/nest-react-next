/**
 * CRUD Generator Types
 */

export interface ColumnConfig {
    name: string;
    dbType: ColumnType;
    nullable?: boolean;
    unique?: boolean;
    index?: boolean;
    length?: number;
    default?: string;
    enumValues?: string[];
    label?: string;
}

export type ColumnType =
    | 'string'
    | 'text'
    | 'int'
    | 'float'
    | 'boolean'
    | 'date'
    | 'datetime'
    | 'json'
    | 'enum'
    | 'uuid';

export interface NormalizedColumn extends ColumnConfig {
    propertyName: string;
    tsType: string;
    optional: boolean;
    enumTypeName?: string;
    decoratorArgs: string;
    swaggerDecorator?: string;
    label?: string;
}

export interface GeneratorConfig {
    entityName: string;
    route?: string;
    moduleName?: string;
    columns: ColumnConfig[];
    outputApps?: {
        api?: boolean;
        admin?: boolean;
        web?: boolean;
    };
    implementationType?: 'nest-crud' | 'custom';
    viewType?: 'page' | 'dialog' | 'drawer';
    swagger?: boolean;
}

export interface GeneratorMeta {
    entityPascal: string;
    entityCamel: string;
    entityFile: string;
    pluralKebab: string;
    tableName: string;
    route: string;
    columns: NormalizedColumn[];
    enumColumns: NormalizedColumn[];
    implementationType: 'nest-crud' | 'custom';
    viewType: 'page' | 'dialog' | 'drawer';
    swagger: boolean;
}

export interface GeneratorOptions {
    dryRun?: boolean;
    force?: boolean;
}

export interface GeneratedFile {
    path: string;
    content: string;
    action: 'created' | 'skipped' | 'would-create' | 'would-update' | 'updated' | 'unchanged';
    reason?: string;
}

export interface ColumnPreset {
    id: string;
    label: string;
    description?: string;
    column: ColumnConfig;
}
