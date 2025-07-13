import { CrudBulkConfig, EntityConfig, BulkColumnConfig } from './bulk-config';

export interface ValidationError {
    path: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

export class ConfigValidator {
    private errors: ValidationError[] = [];
    private warnings: ValidationError[] = [];

    validate(config: CrudBulkConfig): ValidationResult {
        this.errors = [];
        this.warnings = [];

        this.validateRoot(config);
        this.validateProject(config.project);
        this.validateDatabase(config.database);
        this.validateGlobalDefaults(config.globalDefaults);
        this.validateEntities(config.entities);

        return {
            isValid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
        };
    }

    private validateRoot(config: CrudBulkConfig): void {
        if (!config.version) {
            this.addError('version', 'Version is required');
        } else if (!this.isValidVersion(config.version)) {
            this.addError('version', 'Invalid version format. Use semantic versioning (e.g., 1.0.0)');
        }

        if (!config.entities || config.entities.length === 0) {
            this.addError('entities', 'At least one entity must be defined');
        }
    }

    private validateProject(project: any): void {
        if (!project) {
            this.addError('project', 'Project configuration is required');
            return;
        }

        if (!project.name) {
            this.addError('project.name', 'Project name is required');
        } else if (typeof project.name !== 'string' || project.name.trim().length === 0) {
            this.addError('project.name', 'Project name must be a non-empty string');
        }

        if (project.version && !this.isValidVersion(project.version)) {
            this.addWarning('project.version', 'Invalid version format. Use semantic versioning (e.g., 1.0.0)');
        }
    }

    private validateDatabase(database: any): void {
        if (!database) {
            this.addError('database', 'Database configuration is required');
            return;
        }

        const validDbTypes = ['postgres', 'mysql', 'sqlite', 'mariadb', 'oracle', 'mssql'];
        if (!database.type) {
            this.addError('database.type', 'Database type is required');
        } else if (!validDbTypes.includes(database.type)) {
            this.addError('database.type', `Invalid database type. Must be one of: ${validDbTypes.join(', ')}`);
        }

        if (database.timestampColumns !== undefined && typeof database.timestampColumns !== 'boolean') {
            this.addError('database.timestampColumns', 'timestampColumns must be a boolean');
        }

        if (database.softDelete !== undefined && typeof database.softDelete !== 'boolean') {
            this.addError('database.softDelete', 'softDelete must be a boolean');
        }

        if (database.auditColumns !== undefined && typeof database.auditColumns !== 'boolean') {
            this.addError('database.auditColumns', 'auditColumns must be a boolean');
        }
    }

    private validateGlobalDefaults(globalDefaults: any): void {
        if (!globalDefaults) {
            this.addError('globalDefaults', 'Global defaults configuration is required');
            return;
        }

        const validCrudTypes = ['custom', 'ackplus'];
        if (globalDefaults.crudType && !validCrudTypes.includes(globalDefaults.crudType)) {
            this.addError('globalDefaults.crudType', `Invalid CRUD type. Must be one of: ${validCrudTypes.join(', ')}`);
        }

        // Validate boolean fields
        const booleanFields = ['generateApi', 'generateReact', 'generateTypes'];
        booleanFields.forEach(field => {
            if (globalDefaults[field] !== undefined && typeof globalDefaults[field] !== 'boolean') {
                this.addError(`globalDefaults.${field}`, `${field} must be a boolean`);
            }
        });

        // Validate UI options
        if (globalDefaults.uiOptions) {
            this.validateUIOptions(globalDefaults.uiOptions, 'globalDefaults.uiOptions');
        }

        // Validate features
        if (globalDefaults.features) {
            this.validateFeatures(globalDefaults.features, 'globalDefaults.features');
        }
    }

    private validateEntities(entities: EntityConfig[]): void {
        if (!Array.isArray(entities)) {
            this.addError('entities', 'Entities must be an array');
            return;
        }

        const entityNames = new Set<string>();
        const tableNames = new Set<string>();

        entities.forEach((entity, index) => {
            const entityPath = `entities[${index}]`;
            this.validateEntity(entity, entityPath);

            // Check for duplicate entity names
            if (entity.name) {
                if (entityNames.has(entity.name)) {
                    this.addError(`${entityPath}.name`, `Duplicate entity name: ${entity.name}`);
                } else {
                    entityNames.add(entity.name);
                }
            }

            // Check for duplicate table names
            if (entity.tableName) {
                if (tableNames.has(entity.tableName)) {
                    this.addError(`${entityPath}.tableName`, `Duplicate table name: ${entity.tableName}`);
                } else {
                    tableNames.add(entity.tableName);
                }
            }
        });
    }

    private validateEntity(entity: any, path: string): void {
        if (!entity.name) {
            this.addError(`${path}.name`, 'Entity name is required');
        } else if (!this.isValidIdentifier(entity.name)) {
            this.addError(`${path}.name`, 'Entity name must be a valid identifier (letters, numbers, underscores)');
        }

        if (entity.tableName && !this.isValidIdentifier(entity.tableName)) {
            this.addError(`${path}.tableName`, 'Table name must be a valid identifier');
        }

        const validCrudTypes = ['custom', 'ackplus'];
        if (entity.crudType && !validCrudTypes.includes(entity.crudType)) {
            this.addError(`${path}.crudType`, `Invalid CRUD type. Must be one of: ${validCrudTypes.join(', ')}`);
        }

        // Validate boolean fields
        const booleanFields = ['generateApi', 'generateReact', 'generateTypes'];
        booleanFields.forEach(field => {
            if (entity[field] !== undefined && typeof entity[field] !== 'boolean') {
                this.addError(`${path}.${field}`, `${field} must be a boolean`);
            }
        });

        // Validate columns
        if (!entity.columns || !Array.isArray(entity.columns)) {
            this.addError(`${path}.columns`, 'Entity must have at least one column');
        } else {
            this.validateColumns(entity.columns, `${path}.columns`);
        }

        // Validate features
        if (entity.features) {
            this.validateFeatures(entity.features, `${path}.features`);
        }

        // Validate UI options
        if (entity.uiOptions) {
            this.validateUIOptions(entity.uiOptions, `${path}.uiOptions`);
        }

        // Validate relationships
        if (entity.relationships) {
            this.validateRelationships(entity.relationships, `${path}.relationships`);
        }
    }

    private validateColumns(columns: BulkColumnConfig[], path: string): void {
        if (columns.length === 0) {
            this.addError(path, 'At least one column is required');
            return;
        }

        const columnNames = new Set<string>();
        const validTypes = [
            'string', 'number', 'boolean', 'date', 'time', 'date-time',
            'enum', 'text', 'json', 'uuid', 'decimal', 'float', 'integer', 'bigint'
        ];

        columns.forEach((column, index) => {
            const columnPath = `${path}[${index}]`;

            if (!column.name) {
                this.addError(`${columnPath}.name`, 'Column name is required');
            } else if (!this.isValidIdentifier(column.name)) {
                this.addError(`${columnPath}.name`, 'Column name must be a valid identifier');
            } else if (columnNames.has(column.name)) {
                this.addError(`${columnPath}.name`, `Duplicate column name: ${column.name}`);
            } else {
                columnNames.add(column.name);
            }

            if (!column.type) {
                this.addError(`${columnPath}.type`, 'Column type is required');
            } else if (!validTypes.includes(column.type)) {
                this.addError(`${columnPath}.type`, `Invalid column type. Must be one of: ${validTypes.join(', ')}`);
            }

            // Validate enum values
            if (column.type === 'enum') {
                if (!column.enum || !Array.isArray(column.enum) || column.enum.length === 0) {
                    this.addError(`${columnPath}.enum`, 'Enum type requires at least one enum value');
                } else {
                    const enumValues = new Set<string>();
                    column.enum.forEach((value, enumIndex) => {
                        if (typeof value !== 'string' || value.trim().length === 0) {
                            this.addError(`${columnPath}.enum[${enumIndex}]`, 'Enum value must be a non-empty string');
                        } else if (enumValues.has(value)) {
                            this.addError(`${columnPath}.enum[${enumIndex}]`, `Duplicate enum value: ${value}`);
                        } else {
                            enumValues.add(value);
                        }
                    });
                }
            }

            // Validate numeric constraints
            if (['decimal', 'float'].includes(column.type)) {
                if (column.precision !== undefined && (typeof column.precision !== 'number' || column.precision <= 0)) {
                    this.addError(`${columnPath}.precision`, 'Precision must be a positive number');
                }
                if (column.scale !== undefined && (typeof column.scale !== 'number' || column.scale < 0)) {
                    this.addError(`${columnPath}.scale`, 'Scale must be a non-negative number');
                }
                if (column.precision !== undefined && column.scale !== undefined && column.scale > column.precision) {
                    this.addError(`${columnPath}.scale`, 'Scale cannot be greater than precision');
                }
            }

            if (column.length !== undefined && (typeof column.length !== 'number' || column.length <= 0)) {
                this.addError(`${columnPath}.length`, 'Length must be a positive number');
            }

            // Validate boolean fields
            const booleanFields = ['nullable', 'unique', 'primary'];
            booleanFields.forEach(field => {
                if (column[field] !== undefined && typeof column[field] !== 'boolean') {
                    this.addError(`${columnPath}.${field}`, `${field} must be a boolean`);
                }
            });

            // Validate validation rules
            if (column.validation) {
                this.validateColumnValidation(column.validation, `${columnPath}.validation`);
            }

            // Validate UI options
            if (column.ui) {
                this.validateColumnUI(column.ui, `${columnPath}.ui`);
            }
        });
    }

    private validateColumnValidation(validation: any, path: string): void {
        if (validation.minLength !== undefined && (typeof validation.minLength !== 'number' || validation.minLength < 0)) {
            this.addError(`${path}.minLength`, 'minLength must be a non-negative number');
        }

        if (validation.maxLength !== undefined && (typeof validation.maxLength !== 'number' || validation.maxLength < 0)) {
            this.addError(`${path}.maxLength`, 'maxLength must be a non-negative number');
        }

        if (validation.minLength !== undefined && validation.maxLength !== undefined && validation.minLength > validation.maxLength) {
            this.addError(`${path}.maxLength`, 'maxLength cannot be less than minLength');
        }

        if (validation.min !== undefined && typeof validation.min !== 'number') {
            this.addError(`${path}.min`, 'min must be a number');
        }

        if (validation.max !== undefined && typeof validation.max !== 'number') {
            this.addError(`${path}.max`, 'max must be a number');
        }

        if (validation.min !== undefined && validation.max !== undefined && validation.min > validation.max) {
            this.addError(`${path}.max`, 'max cannot be less than min');
        }

        if (validation.pattern !== undefined && typeof validation.pattern !== 'string') {
            this.addError(`${path}.pattern`, 'pattern must be a string');
        }

        const booleanFields = ['required', 'email', 'url'];
        booleanFields.forEach(field => {
            if (validation[field] !== undefined && typeof validation[field] !== 'boolean') {
                this.addError(`${path}.${field}`, `${field} must be a boolean`);
            }
        });
    }

    private validateColumnUI(ui: any, path: string): void {
        const validInputTypes = [
            'text', 'email', 'password', 'number', 'tel', 'url', 'textarea',
            'select', 'multiselect', 'checkbox', 'radio', 'date', 'datetime',
            'time', 'file', 'image'
        ];

        if (ui.inputType && !validInputTypes.includes(ui.inputType)) {
            this.addError(`${path}.inputType`, `Invalid input type. Must be one of: ${validInputTypes.join(', ')}`);
        }

        if (ui.width !== undefined && (typeof ui.width !== 'number' || ui.width <= 0)) {
            this.addError(`${path}.width`, 'width must be a positive number');
        }

        if (ui.order !== undefined && (typeof ui.order !== 'number' || ui.order < 0)) {
            this.addError(`${path}.order`, 'order must be a non-negative number');
        }

        const booleanFields = ['hidden', 'readonly', 'sortable', 'filterable', 'searchable'];
        booleanFields.forEach(field => {
            if (ui[field] !== undefined && typeof ui[field] !== 'boolean') {
                this.addError(`${path}.${field}`, `${field} must be a boolean`);
            }
        });
    }

    private validateFeatures(features: any, path: string): void {
        const booleanFields = [
            'softDelete', 'bulkOperations', 'statusFilter', 'fileUpload', 'audit',
            'search', 'export', 'import', 'versioning', 'caching', 'notifications'
        ];

        booleanFields.forEach(field => {
            if (features[field] !== undefined && typeof features[field] !== 'boolean') {
                this.addError(`${path}.${field}`, `${field} must be a boolean`);
            }
        });
    }

    private validateUIOptions(uiOptions: any, path: string): void {
        const validTableStyles = ['table', 'card', 'grid'];
        if (uiOptions.tableStyle && !validTableStyles.includes(uiOptions.tableStyle)) {
            this.addError(`${path}.tableStyle`, `Invalid table style. Must be one of: ${validTableStyles.join(', ')}`);
        }

        const validAddEditModes = ['dialog', 'page', 'drawer'];
        if (uiOptions.addEditMode && !validAddEditModes.includes(uiOptions.addEditMode)) {
            this.addError(`${path}.addEditMode`, `Invalid add/edit mode. Must be one of: ${validAddEditModes.join(', ')}`);
        }

        const validThemes = ['light', 'dark', 'auto'];
        if (uiOptions.theme && !validThemes.includes(uiOptions.theme)) {
            this.addError(`${path}.theme`, `Invalid theme. Must be one of: ${validThemes.join(', ')}`);
        }

        const validLayouts = ['sidebar', 'top', 'compact'];
        if (uiOptions.layout && !validLayouts.includes(uiOptions.layout)) {
            this.addError(`${path}.layout`, `Invalid layout. Must be one of: ${validLayouts.join(', ')}`);
        }

        if (uiOptions.pageSize !== undefined && (typeof uiOptions.pageSize !== 'number' || uiOptions.pageSize <= 0)) {
            this.addError(`${path}.pageSize`, 'pageSize must be a positive number');
        }

        const booleanFields = [
            'enableSearch', 'enableFilters', 'enableExport', 'enableBulkActions',
            'enablePagination', 'sortable', 'resizable'
        ];

        booleanFields.forEach(field => {
            if (uiOptions[field] !== undefined && typeof uiOptions[field] !== 'boolean') {
                this.addError(`${path}.${field}`, `${field} must be a boolean`);
            }
        });
    }

    private validateRelationships(relationships: any, path: string): void {
        if (relationships.belongsTo && Array.isArray(relationships.belongsTo)) {
            relationships.belongsTo.forEach((rel: any, index: number) => {
                this.validateBelongsToRelationship(rel, `${path}.belongsTo[${index}]`);
            });
        }

        if (relationships.hasMany && Array.isArray(relationships.hasMany)) {
            relationships.hasMany.forEach((rel: any, index: number) => {
                this.validateHasManyRelationship(rel, `${path}.hasMany[${index}]`);
            });
        }

        if (relationships.manyToMany && Array.isArray(relationships.manyToMany)) {
            relationships.manyToMany.forEach((rel: any, index: number) => {
                this.validateManyToManyRelationship(rel, `${path}.manyToMany[${index}]`);
            });
        }
    }

    private validateBelongsToRelationship(rel: any, path: string): void {
        if (!rel.name) {
            this.addError(`${path}.name`, 'Relationship name is required');
        }

        if (!rel.entity) {
            this.addError(`${path}.entity`, 'Related entity is required');
        }

        if (!rel.foreignKey) {
            this.addError(`${path}.foreignKey`, 'Foreign key is required');
        }

        const validActions = ['CASCADE', 'SET NULL', 'RESTRICT'];
        if (rel.onDelete && !validActions.includes(rel.onDelete)) {
            this.addError(`${path}.onDelete`, `Invalid onDelete action. Must be one of: ${validActions.join(', ')}`);
        }

        if (rel.onUpdate && !validActions.includes(rel.onUpdate)) {
            this.addError(`${path}.onUpdate`, `Invalid onUpdate action. Must be one of: ${validActions.join(', ')}`);
        }
    }

    private validateHasManyRelationship(rel: any, path: string): void {
        if (!rel.name) {
            this.addError(`${path}.name`, 'Relationship name is required');
        }

        if (!rel.entity) {
            this.addError(`${path}.entity`, 'Related entity is required');
        }

        if (!rel.foreignKey) {
            this.addError(`${path}.foreignKey`, 'Foreign key is required');
        }

        if (rel.cascade !== undefined && typeof rel.cascade !== 'boolean') {
            this.addError(`${path}.cascade`, 'cascade must be a boolean');
        }
    }

    private validateManyToManyRelationship(rel: any, path: string): void {
        if (!rel.name) {
            this.addError(`${path}.name`, 'Relationship name is required');
        }

        if (!rel.entity) {
            this.addError(`${path}.entity`, 'Related entity is required');
        }

        if (!rel.pivotTable) {
            this.addError(`${path}.pivotTable`, 'Pivot table is required');
        }
    }

    private isValidVersion(version: string): boolean {
        const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$/;
        return versionRegex.test(version);
    }

    private isValidIdentifier(name: string): boolean {
        const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        return identifierRegex.test(name);
    }

    private addError(path: string, message: string): void {
        this.errors.push({ path, message, severity: 'error' });
    }

    private addWarning(path: string, message: string): void {
        this.warnings.push({ path, message, severity: 'warning' });
    }
}
