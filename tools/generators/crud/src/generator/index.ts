/**
 * Main CRUD Generator
 */

import path from 'path';
import type {
    ColumnConfig,
    GeneratorConfig,
    GeneratorMeta,
    GeneratorOptions,
    GeneratedFile,
    NormalizedColumn,
} from '../types/index.js';
import {
    toPascalCase,
    toCamelCase,
    toKebabCase,
    toPlural,
    getTypeScriptType,
    buildColumnDecoratorArgs,
} from './utils.js';
import { renderTemplate } from './template-engine.js';
import { writeFile, appendLineIfMissing } from './file-writer.js';
import { injectAppModule, injectTypesExport, injectAdminNavigation } from './injector.js';

/**
 * Column presets for quick-add functionality
 */
export const COLUMN_PRESETS = [
    { id: 'id', label: 'ID', column: { name: 'id', dbType: 'uuid' as const, nullable: false, unique: true } },
    { id: 'createdAt', label: 'Created At', column: { name: 'createdAt', dbType: 'datetime' as const, nullable: false } },
    { id: 'updatedAt', label: 'Updated At', column: { name: 'updatedAt', dbType: 'datetime' as const, nullable: false } },
    { id: 'deletedAt', label: 'Deleted At', column: { name: 'deletedAt', dbType: 'datetime' as const, nullable: true } },
    { id: 'name', label: 'Name', column: { name: 'name', dbType: 'string' as const, nullable: false } },
    { id: 'title', label: 'Title', column: { name: 'title', dbType: 'string' as const, nullable: false } },
    { id: 'description', label: 'Description', column: { name: 'description', dbType: 'text' as const, nullable: true } },
    { id: 'email', label: 'Email', column: { name: 'email', dbType: 'string' as const, nullable: false, unique: true } },
    { id: 'slug', label: 'Slug', column: { name: 'slug', dbType: 'string' as const, nullable: false, unique: true } },
    { id: 'isActive', label: 'Is Active', column: { name: 'isActive', dbType: 'boolean' as const, nullable: false } },
    { id: 'order', label: 'Order', column: { name: 'order', dbType: 'int' as const, nullable: false } },
    { id: 'status', label: 'Status', column: { name: 'status', dbType: 'enum' as const, nullable: false, enumValues: ['active', 'inactive', 'pending'] } },
    { id: 'metadata', label: 'Metadata', column: { name: 'metadata', dbType: 'json' as const, nullable: true } },
];

export const COLUMN_TYPES = ['string', 'text', 'int', 'float', 'boolean', 'date', 'datetime', 'json', 'enum', 'uuid'];

/**
 * Normalize columns with computed properties
 */
function normalizeColumns(columns: ColumnConfig[], swagger = false): NormalizedColumn[] {
    return columns.map((col) => {
        const enumTypeName = col.dbType === 'enum' ? `${toPascalCase(col.name)}Enum` : undefined;
        const tsType = getTypeScriptType(col.dbType, enumTypeName);
        let swaggerDecorator = '';

        if (swagger) {
            const props: string[] = [];
            if (col.nullable) props.push('required: false');
            if (col.dbType === 'enum' && enumTypeName) {
                props.push(`enum: ${enumTypeName}`);
                props.push(`enumName: '${enumTypeName}'`);
            }
            swaggerDecorator = `@ApiProperty(${props.length ? `{ ${props.join(', ')} }` : ''})`;
        }

        return {
            ...col,
            propertyName: toCamelCase(col.name),
            tsType,
            optional: col.nullable || false,
            enumTypeName,
            decoratorArgs: buildColumnDecoratorArgs({
                ...col,
                enumTypeName,
            }),
            swaggerDecorator,
            label: col.label || toPascalCase(col.name).replace(/([A-Z])/g, ' $1').trim(),
        };
    });
}

/**
 * Build generator metadata from config
 */
function buildMeta(config: GeneratorConfig): GeneratorMeta {
    const entityPascal = toPascalCase(config.entityName);
    const entityCamel = toCamelCase(config.entityName);
    const entityFile = toKebabCase(config.entityName);
    const pluralKebab = toPlural(entityFile);
    const columns = normalizeColumns(config.columns || [], config.swagger);

    return {
        entityPascal,
        entityCamel,
        entityFile,
        pluralKebab,
        tableName: pluralKebab,
        route: config.route || entityFile,
        columns,
        enumColumns: columns.filter((c) => c.dbType === 'enum' && c.enumValues?.length),
        implementationType: config.implementationType || 'nest-crud',
        viewType: config.viewType || 'page',
        swagger: config.swagger || false,
    };
}

/**
 * Generate CRUD files
 */
export async function generateCrud(
    rootDir: string,
    config: GeneratorConfig,
    options: GeneratorOptions = {}
): Promise<GeneratedFile[]> {
    const results: GeneratedFile[] = [];
    const meta = buildMeta(config);
    const outputApps = config.outputApps || { api: true, admin: true, web: false };

    // API Files
    if (outputApps.api) {
        const apiBaseDir = `apps/api/src/app/modules/${meta.entityFile}`;

        // Type interface
        const typeContent = await renderTemplate('types/interface.ts.ejs', meta);
        results.push(writeFile(rootDir, `packages/types/src/lib/${meta.entityFile}.ts`, typeContent, options));

        // Entity
        const entityContent = await renderTemplate('api/entity.ts.ejs', meta);
        results.push(writeFile(rootDir, `${apiBaseDir}/${meta.entityFile}.entity.ts`, entityContent, options));

        // Service
        const serviceContent = await renderTemplate('api/service.ts.ejs', meta);
        results.push(writeFile(rootDir, `${apiBaseDir}/${meta.entityFile}.service.ts`, serviceContent, options));

        // Controller
        const controllerContent = await renderTemplate('api/controller.ts.ejs', meta);
        results.push(writeFile(rootDir, `${apiBaseDir}/${meta.entityFile}.controller.ts`, controllerContent, options));

        // Module
        const moduleContent = await renderTemplate('api/module.ts.ejs', meta);
        results.push(writeFile(rootDir, `${apiBaseDir}/${meta.entityFile}.module.ts`, moduleContent, options));

        // DTOs
        const createDtoContent = await renderTemplate('api/create-dto.ts.ejs', meta);
        results.push(writeFile(rootDir, `${apiBaseDir}/dto/create-${meta.entityFile}.dto.ts`, createDtoContent, options));

        const updateDtoContent = await renderTemplate('api/update-dto.ts.ejs', meta);
        results.push(writeFile(rootDir, `${apiBaseDir}/dto/update-${meta.entityFile}.dto.ts`, updateDtoContent, options));

        // Update exports
        results.push(appendLineIfMissing(rootDir, 'packages/types/src/index.ts', `export * from './lib/${meta.entityFile}';`, options));
    }

    // React Files
    if (outputApps.admin || outputApps.web) {
        const reactServiceContent = await renderTemplate('react/service.ts.ejs', meta);
        results.push(writeFile(rootDir, `packages/react-shared/src/services/${meta.entityFile}.service.ts`, reactServiceContent, options));

        const hooksContent = await renderTemplate('react/hooks.ts.ejs', meta);
        results.push(writeFile(rootDir, `packages/react-shared/src/query-hooks/use-${meta.entityFile}.ts`, hooksContent, options));

        results.push(appendLineIfMissing(rootDir, 'packages/react-shared/src/services/index.ts', `export * from './${meta.entityFile}.service';`, options));
        results.push(appendLineIfMissing(rootDir, 'packages/react-shared/src/query-hooks/index.ts', `export * from './use-${meta.entityFile}';`, options));
    }

    // Admin Files
    if (outputApps.admin) {
        const formTemplate = meta.viewType === 'drawer' ? 'react/form-drawer.tsx.ejs' :
            meta.viewType === 'dialog' ? 'react/form-dialog.tsx.ejs' :
                'react/form-page.tsx.ejs';

        const dialogContent = await renderTemplate(formTemplate, meta);
        results.push(writeFile(rootDir, `apps/admin/src/app/sections/${meta.pluralKebab}/add-edit-${meta.entityFile}-form.tsx`, dialogContent, options));

        const listContent = await renderTemplate('react/list-page.tsx.ejs', meta);
        results.push(writeFile(rootDir, `apps/admin/src/app/pages/${meta.pluralKebab}/${meta.entityFile}-list.tsx`, listContent, options));
    }

    // Injections
    if (outputApps.api) {
        results.push(...await injectAppModule(rootDir, meta, options));
        results.push(...await injectTypesExport(rootDir, meta, options));
    }

    if (outputApps.admin) {
        results.push(...await injectAdminNavigation(rootDir, meta, options));
    }

    return results;
}

export { buildMeta, normalizeColumns };
