import fs from 'fs/promises';
import path from 'path';
import { GeneratorMeta, GeneratorOptions, GeneratedFile } from '../types/index.js';

async function updateFile(
    filePath: string,
    content: string,
    options: GeneratorOptions
): Promise<GeneratedFile | null> {
    if (options.dryRun) {
        return {
            path: filePath,
            content,
            action: 'would-update'
        };
    }
    await fs.writeFile(filePath, content, 'utf-8');
    return {
        path: filePath,
        content,
        action: 'updated'
    };
}

/**
 * Inject Module into app.module.ts
 */
export async function injectAppModule(rootDir: string, meta: GeneratorMeta, options: GeneratorOptions): Promise<GeneratedFile[]> {
    const filePath = path.join(rootDir, 'apps/api/src/app/app.module.ts');
    try {
        let content = await fs.readFile(filePath, 'utf-8');
        const originalContent = content;

        // 1. Add Import
        const importLine = `import { ${meta.entityPascal}Module } from './modules/${meta.entityFile}/${meta.entityFile}.module';`;
        if (!content.includes(importLine)) {
            const lastImportIndex = content.lastIndexOf('import ');
            const endOfLastImport = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLastImport + 1) + importLine + '\n' + content.slice(endOfLastImport + 1);
        }

        // 2. Add to imports array
        const moduleRegex = /@Module\s*\(\s*{[\s\S]*?imports:\s*\[([\s\S]*?)\]/;
        const match = content.match(moduleRegex);

        if (match) {
            const currentImports = match[1];
            if (!currentImports.includes(`${meta.entityPascal}Module`)) {
                // Find closing bracket
                const importsStart = content.lastIndexOf('imports: [');
                if (importsStart !== -1) {
                    let depth = 1;
                    let i = importsStart + 10;
                    while (depth > 0 && i < content.length) {
                        if (content[i] === '[') depth++;
                        if (content[i] === ']') depth--;
                        i++;
                    }
                    const importsEnd = i - 1;
                    const beforeEnd = content.slice(0, importsEnd);
                    const lastChar = beforeEnd.trim().slice(-1);
                    const prefix = lastChar === ',' ? '' : ',';
                    content = beforeEnd + `${prefix}\n        ${meta.entityPascal}Module,` + content.slice(importsEnd);
                }
            }
        }

        if (content !== originalContent) {
            const result = await updateFile(filePath, content, options);
            return result ? [result] : [];
        }
    } catch (e) {
        console.warn('Failed to update app.module.ts', e);
    }
    return [];
}

/**
 * Inject Export into packages/types/src/index.ts
 */
export async function injectTypesExport(rootDir: string, meta: GeneratorMeta, options: GeneratorOptions): Promise<GeneratedFile[]> {
    const basePath = 'packages/types/src';

    const filePath = path.join(rootDir, basePath, 'index.ts');
    try {
        let content = '';
        try {
            content = await fs.readFile(filePath, 'utf-8');
        } catch {
            content = '';
        }

        const exportLine = `export * from './lib/${meta.entityFile}';`;

        if (!content.includes(exportLine)) {
            content += content.endsWith('\n') ? `${exportLine}\n` : `\n${exportLine}\n`;
            const result = await updateFile(filePath, content, options);
            return result ? [result] : [];
        }
    } catch (e) {
        console.warn(`Failed to update ${basePath}/index.ts`, e);
    }
    return [];
}

/**
 * Inject Admin Navigation
 */
export async function injectAdminNavigation(rootDir: string, meta: GeneratorMeta, options: GeneratorOptions): Promise<GeneratedFile[]> {
    const pathsFile = path.join(rootDir, 'apps/admin/src/app/routes/paths.ts');
    const navFile = path.join(rootDir, 'apps/admin/src/app/layout/dashboard/navigation/navigation-config.tsx');
    const results: GeneratedFile[] = [];

    // 1. Update paths.ts
    try {
        let content = await fs.readFile(pathsFile, 'utf-8');
        const originalContent = content;

        if (!content.includes(`${meta.entityCamel}:`)) {
            const pathEntryTemplate = `    ${meta.entityCamel}: {
        root: path(ROOTS_DASHBOARD, '/${meta.pluralKebab}'),
        add: path(ROOTS_DASHBOARD, '/${meta.pluralKebab}/create'),
        edit: (id: string) => path(ROOTS_DASHBOARD, \`/${meta.pluralKebab}/edit/\${id}\`),
        view: (id: string) => path(ROOTS_DASHBOARD, \`/${meta.pluralKebab}/view/\${id}\`),
    },`;

            const dashboardRegex = /export const PATH_DASHBOARD = {([\s\S]*?)};/;
            const match = content.match(dashboardRegex);
            if (match) {
                const endBodyRelative = match[0].lastIndexOf('}');
                const endBodyAbsolute = match.index! + endBodyRelative;

                const before = content.slice(0, endBodyAbsolute);
                const after = content.slice(endBodyAbsolute);

                content = before + '\n' + pathEntryTemplate + '\n' + after;
            }
        }

        if (content !== originalContent) {
            const result = await updateFile(pathsFile, content, options);
            if (result) results.push(result);
        }
    } catch (e) {
        console.warn('Failed to update paths.ts', e);
    }

    // 2. Update navigation-config.tsx
    try {
        let content = await fs.readFile(navFile, 'utf-8');
        const originalContent = content;

        if (!content.includes(`id: '${meta.entityFile}'`)) {
            const navItem = `
    {
        id: '${meta.entityFile}',
        title: '${meta.entityPascal}',
        path: PATH_DASHBOARD.${meta.entityCamel}.root,
        icon: <Icon icon={IconEnum.File} />,
        group: 'Overview',
        activePaths: [PATH_DASHBOARD.${meta.entityCamel}.root],
    },`;

            const navRegex = /export const NAVIGATION_ITEMS: NavigationItem\[\] = \[([\s\S]*?)\];/;
            const match = content.match(navRegex);
            if (match) {
                const endArrayRelative = match[0].lastIndexOf(']');
                const endArrayAbsolute = match.index! + endArrayRelative;

                content = content.slice(0, endArrayAbsolute) + navItem + content.slice(endArrayAbsolute);
            }
        }

        if (content !== originalContent) {
            const result = await updateFile(navFile, content, options);
            if (result) results.push(result);
        }
    } catch (e) {
        console.warn('Failed to update navigation-config.tsx', e);
    }

    return results;
}
