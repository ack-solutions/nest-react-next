import { formatFiles, Tree, names } from '@nx/devkit';
import { execSync } from 'child_process';
import { prompt } from 'enquirer';

import { ApiGenerator } from './api.generator';
import { ReactGenerator } from './react.generator';
import { PluginGeneratorSchema, ProcessedSchema, ProcessedColumn, Column, ColumnType } from './schema';
import { TypesGenerator } from './types.generator';


async function takeEntityColumns(): Promise<Column[]> {
    const columns: Column[] = [];
    let addMoreColumns = true;

    while (addMoreColumns) {
        const columnPrompt = await prompt<{
            columnName: string;
            columnType: string;
            enumValues: string[];
            nullable: string;
        }>([
            {
                type: 'input',
                name: 'columnName',
                message: 'Enter column name:',
            },
            {
                type: 'select',
                name: 'columnType',
                message: 'Select column type:',
                choices: [
                    'string',
                    'number',
                    'boolean',
                    'date',
                    'enum',
                    'text',
                    'uuid',
                    'file',
                ],
            },
        ]);

        if (columnPrompt.columnType === 'enum') {
            columnPrompt.enumValues = await askForEnumValues();
        }

        if (columnPrompt.columnName && columnPrompt.columnName !== '') {
            columns.push({
                name: columnPrompt.columnName,
                normalizeName: names(columnPrompt.columnName),
                type: columnPrompt.columnType as ColumnType,
                nullable: columnPrompt.nullable === 'yes',
                enumValues: columnPrompt.enumValues,
            });
        }

        // If the user selects 'no', stop asking for more columns
        const { moreValues } = await prompt<{ moreValues: string }>({
            type: 'select',
            name: 'moreValues',
            message: 'Do you want to add another column?',
            choices: ['yes', 'no'],
        });
        addMoreColumns = moreValues === 'yes';
    }

    return columns;
}

async function askForEnumValues(): Promise<string[]> {
    const { enumValues } = await prompt<{ enumValues: string }>({
        type: 'input',
        name: 'enumValues',
        message: 'Enter enum values (comma-separated):',
        validate: (input) => input ? true : 'Enum values cannot be empty.',
    });

    return `${enumValues}`.split(',').map((val) => val.trim());
}

function setDefaults(options: PluginGeneratorSchema): ProcessedSchema {
    const { className, propertyName, fileName } = names(options.name);

    return {
        ...options,
        crudType: 'ackplus', // Always use ackplus now
        className,
        propertyName,
        fileName,
        generateTypes: options.generateTypes ?? true,
        columns: processColumns(options.columns || []),
        features: {
            softDelete: true, // Default to true, but configurable
            ...options.features,
        },
    };
}

function processColumns(columns: any[]): ProcessedColumn[] {
    return columns.map((column) => {
        const normalizeName = {
            className: toPascalCase(column.name),
            propertyName: toCamelCase(column.name),
            fileName: toKebabCase(column.name),
        };

        let tsType = mapTypeToTypeScript(column.type, column.enum);
        const swaggerType = mapTypeToSwagger(column.type);
        const validationDecorators = generateValidationDecorators(column);
        const columnOptionsString = generateColumnOptions(column);

        // Override tsType for enum to use proper enum type reference
        if (column.type === 'enum' && column.enum) {
            tsType = `${toPascalCase(options.name)}${toPascalCase(column.name)}Enum`;
        }

        return {
            ...column,
            normalizeName,
            tsType,
            swaggerType,
            validationDecorators,
            columnOptionsString,
            enumValues: column.enum,
        };
    });
}

function mapTypeToTypeScript(type: string, enumValues?: string[]): string {
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
            return 'string'; // Will be overridden in processColumns for proper enum type
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

function mapTypeToSwagger(type: string): string {
    switch (type) {
        case 'string':
        case 'text':
        case 'uuid':
        case 'file':
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
        case 'time':
        case 'date-time':
            return 'String';
        case 'enum':
            return 'enum'; // Return "enum" for proper enum handling
        case 'json':
            return 'Object';
        default:
            return 'String';
    }
}

function generateValidationDecorators(column: any): string[] {
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
                decorators.push(`@IsEnum([${column.enum.map(v => `"${v}"`).join(', ')}])`);
            }
            break;
        default:
            break;
    }

    return decorators;
}

function generateColumnOptions(column: any): string {
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
        options.push('length: 500'); // Default length for file paths
    }

    return options.length > 0 ? `{ ${options.join(', ')} }` : '{}';
}

function toPascalCase(str: string): string {
    return str.replace(/(^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toUpperCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function toCamelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function toKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export default async function (tree: Tree, options: PluginGeneratorSchema) {
    // Handle interactive column input if needed
    if (options.addColumns && (!options.columns || options.columns.length === 0)) {
        console.log('📝 Setting up entity columns...');
        const columns = await takeEntityColumns();
        options.columns = columns;
    }

    const processedOptions = setDefaults(options);

    // Always use ackplus now
    processedOptions.crudType = 'ackplus';

    console.log('🚀 Generating CRUD files...');
    console.log(`📁 Entity: ${processedOptions.name}`);
    console.log('🔧 Type: @ackplus/nest-crud');
    console.log(`📊 Features: ${Object.entries(processedOptions.features).filter(([_, enabled]) => enabled).map(([key]) => key).join(', ')}`);
    console.log(`📋 Columns: ${processedOptions.columns.map(col => `${col.name} (${col.type})`).join(', ')}`);

    // Generate API files
    if (processedOptions.generateApi) {
        console.log('🔄 Generating API files...');
        await new ApiGenerator(tree, processedOptions).run();
    }

    // Generate React files
    if (processedOptions.generateReact) {
        console.log('🔄 Generating React files...');
        await new ReactGenerator(tree, processedOptions).run();
    }

    // Generate Types files
    if (processedOptions.generateTypes) {
        console.log('🔄 Generating Types files...');
        await new TypesGenerator(tree, processedOptions).run();
    }

    // Format all generated files
    await formatFiles(tree);

    // Run ESLint auto-fix to clean up imports and formatting
    console.log('🔧 Running ESLint auto-fix...');
    try {
        execSync('npx eslint --fix apps/api/src/app/modules/ libs/react-shared/src/ libs/types/src/ apps/admin/src/app/', {
            stdio: 'pipe',
            cwd: process.cwd(),
        });
        console.log('✅ ESLint auto-fix completed');
    } catch (_error) {
        console.warn('⚠️  ESLint auto-fix had some issues, but generation completed');
    }

    console.log('✅ CRUD generation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Add the module to your app.module.ts imports');
    console.log('2. Run database migrations if needed');
    console.log('3. Update navigation/routes if generating React components');
    console.log('4. Configure permissions if using role-based access');
}
