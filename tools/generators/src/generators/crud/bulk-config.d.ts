import {
    CrudType,
    ColumnType,
    ConflictResolution,
    Column,
    ProcessedColumn,
    Features,
    NormalizedName
} from './schema';

export interface CrudBulkConfig {
    entities: EntityConfig[];
}

export interface EntityConfig {
    name: string;
    tableName?: string;
    description?: string;
    crudType?: CrudType;
    generateApi?: boolean;
    generateReact?: boolean;
    generateTypes?: boolean;
    columns: Column[];
    features?: Features;
}

export interface ProcessedBulkConfig extends CrudBulkConfig {
    processedEntities: ProcessedEntityConfig[];
}

export interface ProcessedEntityConfig extends EntityConfig {
    className: string;
    propertyName: string;
    fileName: string;
    processedColumns: ProcessedColumn[];
    // Fill in defaults
    crudType: CrudType;
    generateApi: boolean;
    generateReact: boolean;
    generateTypes: boolean;
    features: Required<Features>;
}

export interface BulkGenerationOptions {
    configFile?: string;
    entities?: string[];
    skipExisting?: boolean;
    dryRun?: boolean;
    verbose?: boolean;
    force?: boolean;
    interactive?: boolean;
    conflictResolution?: ConflictResolution;
    createBackup?: boolean;
}
