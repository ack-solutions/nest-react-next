import { Tree, formatFiles } from '@nx/devkit';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

import { ApiGenerator } from './api.generator';
import {
    CrudBulkConfig,
    EntityConfig,
    ProcessedBulkConfig,
    ProcessedEntityConfig,
    BulkGenerationOptions,
} from './bulk-config';
import { ConflictResolver, ConflictResolutionOptions, ConflictResolutionResult } from './conflict-resolver';
import { ReactGenerator } from './react.generator';
import {
    PluginGeneratorSchema,
    Column,
    ProcessedColumn,
} from './schema';
import { TypesGenerator } from './types.generator';


export class BulkCrudGenerator {

    private config: ProcessedBulkConfig;
    private options: BulkGenerationOptions;
    private conflictResolver: ConflictResolver;

    constructor(
        private tree: Tree,
        options: BulkGenerationOptions = {},
    ) {
        this.options = {
            configFile: 'crud.config.json',
            skipExisting: false,
            dryRun: false,
            verbose: false,
            force: false,
            interactive: true,
            conflictResolution: 'ask',
            createBackup: false,
            ...options,
        };

        // Initialize conflict resolver
        const conflictOptions: ConflictResolutionOptions = {
            defaultAction: this.mapConflictResolutionToAction(this.options.conflictResolution || 'ask'),
            interactive: this.options.interactive !== false && !this.options.dryRun,
            skipExisting: this.options.skipExisting || this.options.conflictResolution === 'skip',
            forceUpdate: this.options.force || this.options.conflictResolution === 'update',
            createBackup: this.options.createBackup || this.options.conflictResolution === 'backup',
        };

        this.conflictResolver = new ConflictResolver(this.tree, conflictOptions);
    }

    async generate(): Promise<void> {
        console.info('🚀 Starting bulk CRUD generation...');

        // Load and validate config
        this.loadConfig();

        // Process entities
        this.processEntities();

        // Filter entities if specified
        const entitiesToGenerate = this.filterEntities();

        if (entitiesToGenerate.length === 0) {
            console.info('❌ No entities to generate');
            return;
        }

        console.info(`📋 Generating ${entitiesToGenerate.length} entities:`);
        entitiesToGenerate.forEach((entity, index) => {
            console.info(`  ${index + 1}. ${entity.name} (${entity.crudType})`);
        });

        if (this.options.dryRun) {
            console.info('🔍 Dry run mode - no files will be generated');
            return;
        }

        // Check for conflicts and resolve them
        const entityNames = entitiesToGenerate.map(e => e.name);
        const conflictResults = await this.conflictResolver.resolveConflicts(entityNames);

        // Filter out entities that should be skipped
        const entitiesToProcess = entitiesToGenerate.filter(entity => {
            const result = conflictResults.find(r => r.entityName === entity.name);
            return !result?.skipGeneration;
        });

        if (entitiesToProcess.length === 0) {
            console.info('⏭️  All entities were skipped due to conflicts');
            return;
        }

        // Print conflict resolution summary
        if (conflictResults.length > 0) {
            this.conflictResolver.printConflictSummary(conflictResults);
        }

        // Generate each entity
        for (const entity of entitiesToProcess) {
            const conflictResult = conflictResults.find(r => r.entityName === entity.name);
            await this.generateEntity(entity, conflictResult);
        }

        // Format all files
        await formatFiles(this.tree);

        // Fix HTML entities in generated files (after formatting)
        console.info('🔧 Fixing HTML entities in generated files...');
        this.fixHtmlEntitiesInGeneratedFiles();

        // Run ESLint auto-fix to clean up imports and formatting
        console.info('🔧 Running ESLint auto-fix...');
        try {
            execSync('npx eslint --fix apps/api/src/app/modules/ libs/react-shared/src/ libs/types/src/ apps/admin/src/app/', {
                stdio: 'pipe',
                cwd: process.cwd(),
            });
            console.info('✅ ESLint auto-fix completed');
        } catch (_error) {
            console.warn('⚠️  ESLint auto-fix had some issues, but generation completed');
        }

        console.info('✅ Bulk CRUD generation completed successfully!');
        this.printSummary(entitiesToProcess, conflictResults);
    }

    private loadConfig(): void {
        const configPath = this.options.configFile!;

        if (!existsSync(configPath)) {
            throw new Error(`Config file not found: ${configPath}`);
        }

        try {
            const configContent = readFileSync(configPath, 'utf-8');
            const rawConfig: CrudBulkConfig = JSON.parse(configContent);

            this.validateConfig(rawConfig);
            this.config = rawConfig as ProcessedBulkConfig;

            if (this.options.verbose) {
                console.info('📄 Config loaded successfully');
                console.info(`   Entities: ${this.config.entities.length}`);
            }
        } catch (error) {
            throw new Error(`Failed to load config file: ${error.message}`);
        }
    }

    private validateConfig(config: CrudBulkConfig): void {
        if (!config.entities || config.entities.length === 0) {
            throw new Error('At least one entity must be defined');
        }

        // Validate each entity
        config.entities.forEach((entity, index) => {
            if (!entity.name) {
                throw new Error(`Entity at index ${index} must have a name`);
            }

            if (!entity.columns || entity.columns.length === 0) {
                throw new Error(`Entity '${entity.name}' must have at least one column`);
            }

            // Validate column names are unique
            const columnNames = entity.columns.map(col => col.name);
            const duplicates = columnNames.filter((name, i) => columnNames.indexOf(name) !== i);
            if (duplicates.length > 0) {
                throw new Error(`Entity '${entity.name}' has duplicate column names: ${duplicates.join(', ')}`);
            }
        });

        // Validate entity names are unique
        const entityNames = config.entities.map(entity => entity.name);
        const duplicateEntities = entityNames.filter((name, i) => entityNames.indexOf(name) !== i);
        if (duplicateEntities.length > 0) {
            throw new Error(`Duplicate entity names found: ${duplicateEntities.join(', ')}`);
        }
    }

    private processEntities(): void {
        this.config.processedEntities = this.config.entities.map(entity => this.processEntity(entity));
    }

    private processEntity(entity: EntityConfig): ProcessedEntityConfig {
        const className = this.toPascalCase(entity.name);
        const propertyName = this.toCamelCase(entity.name);
        const fileName = this.toKebabCase(entity.name);

        // Set defaults since we removed the defaults section from config
        const mergedEntity: EntityConfig = {
            ...entity,
            crudType: 'ackplus', // Always use ackplus now
            generateApi: entity.generateApi ?? true,
            generateReact: entity.generateReact ?? true,
            generateTypes: entity.generateTypes ?? true,
            features: {
                softDelete: true, // Default to true, but configurable
                ...entity.features,
            },
        };

        // Process columns
        const processedColumns = entity.columns.map(column => this.processColumn(column));

        return {
            ...mergedEntity,
            className,
            propertyName,
            fileName,
            processedColumns,
            // Ensure required properties are set
            crudType: 'ackplus',
            generateApi: mergedEntity.generateApi,
            generateReact: mergedEntity.generateReact,
            generateTypes: mergedEntity.generateTypes,
            features: {
                softDelete: mergedEntity.features?.softDelete ?? true,
            },
        };
    }

    private processColumn(column: Column): ProcessedColumn {
        const normalizeName = {
            className: this.toPascalCase(column.name),
            propertyName: this.toCamelCase(column.name),
            fileName: this.toKebabCase(column.name),
        };

        const tsType = this.mapTypeToTypeScript(column.type, column.enum);
        const swaggerType = this.mapTypeToSwagger(column.type);
        const validationDecorators = this.generateValidationDecorators(column);
        const columnOptionsString = this.generateColumnOptions(column);

        return {
            ...column,
            normalizeName,
            tsType,
            swaggerType,
            validationDecorators,
            columnOptionsString,
            enumValues: column.enum,
        };
    }

    private filterEntities(): ProcessedEntityConfig[] {
        if (!this.options.entities || this.options.entities.length === 0) {
            return this.config.processedEntities;
        }

        return this.config.processedEntities.filter(entity => this.options.entities!.includes(entity.name));
    }

    private async generateEntity(entity: ProcessedEntityConfig, conflictResult?: ConflictResolutionResult): Promise<void> {
        console.info(`🔧 Generating ${entity.name}...`);

        // Create backup if requested
        if (conflictResult?.createBackup && conflictResult.backupSuffix) {
            console.info(`  📋 Creating backup files for ${entity.name}...`);
            this.conflictResolver.createBackupFiles(entity.name, conflictResult.backupSuffix);
        }

        // Convert to legacy schema format
        const legacySchema = this.convertToLegacySchema(entity);

        try {
            // Generate Types
            if (entity.generateTypes) {
                if (this.options.verbose) console.info(`  📝 Generating types for ${entity.name}...`);
                const typesGenerator = new TypesGenerator(this.tree, legacySchema);
                await typesGenerator.run();
            }

            // Generate API
            if (entity.generateApi) {
                if (this.options.verbose) console.info(`  🔧 Generating API for ${entity.name}...`);
                const apiGenerator = new ApiGenerator(this.tree, legacySchema);
                await apiGenerator.run();
            }

            // Generate React Components
            if (entity.generateReact) {
                if (this.options.verbose) console.info(`  ⚛️  Generating React components for ${entity.name}...`);
                const reactGenerator = new ReactGenerator(this.tree, legacySchema);
                await reactGenerator.run();
            }

            console.info(`  ✅ ${entity.name} generated successfully`);
        } catch (error) {
            console.error(`  ❌ Failed to generate ${entity.name}: ${error.message}`);
            if (!this.options.force) {
                throw error;
            }
        }
    }

    private convertToLegacySchema(entity: ProcessedEntityConfig): PluginGeneratorSchema {
        return {
            name: entity.name,
            crudType: 'ackplus', // Always use ackplus now
            generateApi: entity.generateApi,
            generateReact: entity.generateReact,
            generateTypes: entity.generateTypes,
            addColumns: entity.columns.length > 0,
            columns: entity.processedColumns.map(col => ({
                name: col.name,
                normalizeName: col.normalizeName,
                type: col.type,
                nullable: col.nullable,
                enumValues: col.enumValues,
                unique: col.unique,
                tsType: col.tsType,
                swaggerType: col.swaggerType,
                validationDecorators: col.validationDecorators,
                columnOptionsString: col.columnOptionsString,
            })),
            features: entity.features,
        };
    }

    private printSummary(entities: ProcessedEntityConfig[], conflictResults?: ConflictResolutionResult[]): void {
        console.info('\n📊 Generation Summary:');
        console.info(`  Total entities processed: ${entities.length}`);
        console.info(`  API modules: ${entities.filter(e => e.generateApi).length}`);
        console.info(`  React components: ${entities.filter(e => e.generateReact).length}`);
        console.info(`  TypeScript types: ${entities.filter(e => e.generateTypes).length}`);

        const crudTypes = entities.reduce((acc, entity) => {
            acc[entity.crudType] = (acc[entity.crudType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.info('  CRUD types:');
        Object.entries(crudTypes).forEach(([type, count]) => {
            console.info(`    ${type}: ${count}`);
        });

        // Show conflict resolution summary if there were conflicts
        if (conflictResults && conflictResults.length > 0) {
            const skipped = conflictResults.filter(r => r.skipGeneration);
            const updated = conflictResults.filter(r => !r.skipGeneration && r.action === 'update');
            const backed = conflictResults.filter(r => r.createBackup);

            console.info('\n🔄 Conflict Resolution:');
            if (updated.length > 0) {
                console.info(`  Updated: ${updated.length} entities`);
            }
            if (backed.length > 0) {
                console.info(`  Backed up: ${backed.length} entities`);
            }
            if (skipped.length > 0) {
                console.info(`  Skipped: ${skipped.length} entities`);
            }
        }

        console.info('\n📋 Next steps:');
        console.info('1. Review generated files');
        console.info('2. Update imports in your modules');
        console.info('3. Run tests to ensure everything works');
        console.info('4. Update navigation/routing as needed');
    }

    // Utility methods
    private mapConflictResolutionToAction(resolution: string): 'ask' | 'skip' | 'update' {
        switch (resolution) {
            case 'skip':
                return 'skip';
            case 'update':
            case 'backup':
                return 'update';
            case 'ask':
            default:
                return 'ask';
        }
    }

    private toPascalCase(str: string): string {
        return str.replace(/(^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    private toCamelCase(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    private toKebabCase(str: string): string {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    private mapTypeToTypeScript(type: string, enumValues?: string[]): string {
        switch (type) {
            case 'string':
            case 'text':
                return 'string';
            case 'number':
            case 'integer':
            case 'bigint':
            case 'float':
            case 'decimal':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'date':
            case 'time':
            case 'date-time':
                return 'Date';
            case 'enum':
                // Use double quotes to prevent HTML encoding issues
                return enumValues ? enumValues.map(val => `"${val}"`).join(' | ') : 'string';
            case 'json':
                return 'any';
            case 'uuid':
                return 'string';
            case 'file':
                return 'string'; // File paths are stored as strings
            default:
                return 'string';
        }
    }

    private mapTypeToSwagger(type: string): string {
        switch (type) {
            case 'string':
            case 'text':
            case 'uuid':
                return 'String';
            case 'number':
            case 'integer':
            case 'bigint':
            case 'float':
            case 'decimal':
                return 'Number';
            case 'boolean':
                return 'Boolean';
            case 'date':
                return 'String';
            case 'time':
                return 'String';
            case 'date-time':
                return 'String';
            case 'enum':
                return 'enum';
            case 'json':
                return 'Object';
            default:
                return 'String';
        }
    }

    private generateValidationDecorators(column: Column): string[] {
        const decorators: string[] = [];

        // Simple type-based validation only
        switch (column.type) {
            case 'string':
            case 'text':
            case 'file':
                decorators.push('@IsString()');
                break;
            case 'number':
                decorators.push('@IsNumber()');
                break;
            case 'boolean':
                decorators.push('@IsBoolean()');
                break;
            case 'date':
                decorators.push('@IsDate()');
                break;
            case 'uuid':
                decorators.push('@IsUUID()');
                break;
            case 'enum':
                if (column.enum) {
                    // Use double quotes to prevent HTML encoding issues
                    decorators.push(`@IsEnum([${column.enum.map(v => `"${v}"`).join(', ')}])`);
                }
                break;
            default:
                break;
        }

        return decorators;
    }

    private generateColumnOptions(column: Column): string {
        const options: string[] = [];

        if (column.nullable) {
            options.push('nullable: true');
        }

        if (column.unique) {
            options.push('unique: true');
        }

        // Simple type-based options
        if (column.type === 'enum' && column.enum) {
            options.push('type: "enum"');
            options.push(`enum: [${column.enum.map(v => `"${v}"`).join(', ')}]`);
        } else if (column.type === 'text') {
            options.push('type: "text"');
        } else if (column.type === 'file') {
            options.push('type: "varchar"');
            options.push('length: 500');
        }

        return options.length > 0 ? `{ ${options.join(', ')} }` : '{}';
    }

    private fixHtmlEntitiesInGeneratedFiles(): void {
        // Get all generated files that might contain HTML entities
        const filesToFix = this.tree.listChanges()
            .filter(change => change.type === 'CREATE' || change.type === 'UPDATE')
            .map(change => change.path)
            .filter(path => path.endsWith('.ts') || path.endsWith('.tsx'));

        console.info(`  📋 Checking ${filesToFix.length} files for HTML entities...`);

        filesToFix.forEach(filePath => {
            if (this.tree.exists(filePath)) {
                const content = this.tree.read(filePath, 'utf-8');
                if (content) {
                    const fixedContent = this.decodeHtmlEntities(content);
                    if (fixedContent !== content) {
                        this.tree.write(filePath, fixedContent);
                        console.info(`  ✅ Fixed HTML entities in ${filePath}`);
                    } else {
                        console.info(`  ⏭️  No HTML entities found in ${filePath}`);
                    }
                }
            }
        });
    }

    private decodeHtmlEntities(str: string): string {
        return str
            .replace(/&#34;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }

    static async generate(tree: Tree, options: BulkGenerationOptions = {}): Promise<void> {
        const generator = new BulkCrudGenerator(tree, options);
        await generator.generate();
    }

}
