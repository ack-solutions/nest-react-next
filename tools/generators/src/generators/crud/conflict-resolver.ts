import { Tree } from '@nx/devkit';
import { existsSync } from 'fs';
import { join } from 'path';
import { prompt } from 'enquirer';

export type ConflictAction = 'skip' | 'update' | 'rename' | 'ask';

export interface ConflictResolutionOptions {
    defaultAction: ConflictAction;
    interactive: boolean;
    skipExisting: boolean;
    forceUpdate: boolean;
    createBackup: boolean;
}

export interface EntityConflict {
    entityName: string;
    conflictingFiles: ConflictingFile[];
    action?: ConflictAction;
}

export interface ConflictingFile {
    path: string;
    type: 'entity' | 'service' | 'controller' | 'module' | 'dto' | 'types' | 'react-component' | 'react-hook' | 'react-service';
    exists: boolean;
    canOverwrite: boolean;
}

export interface ConflictResolutionResult {
    entityName: string;
    action: ConflictAction;
    skipGeneration: boolean;
    createBackup: boolean;
    backupSuffix?: string;
}

export class ConflictResolver {
    private tree: Tree;
    private options: ConflictResolutionOptions;

    constructor(tree: Tree, options: Partial<ConflictResolutionOptions> = {}) {
        this.tree = tree;
        this.options = {
            defaultAction: 'ask',
            interactive: true,
            skipExisting: false,
            forceUpdate: false,
            createBackup: false,
            ...options
        };
    }

    async resolveConflicts(entityNames: string[]): Promise<ConflictResolutionResult[]> {
        const conflicts = await this.detectConflicts(entityNames);
        const results: ConflictResolutionResult[] = [];

        for (const conflict of conflicts) {
            const result = await this.resolveEntityConflict(conflict);
            results.push(result);
        }

        return results;
    }

    private async detectConflicts(entityNames: string[]): Promise<EntityConflict[]> {
        const conflicts: EntityConflict[] = [];

        for (const entityName of entityNames) {
            const conflictingFiles = await this.detectEntityConflicts(entityName);

            if (conflictingFiles.length > 0) {
                conflicts.push({
                    entityName,
                    conflictingFiles,
                });
            }
        }

        return conflicts;
    }

    private async detectEntityConflicts(entityName: string): Promise<ConflictingFile[]> {
        const conflicts: ConflictingFile[] = [];
        const fileName = this.toKebabCase(entityName);

        // API files
        const apiPaths = [
            {
                path: `apps/api/src/app/modules/${fileName}/${fileName}.entity.ts`,
                type: 'entity' as const,
                canOverwrite: true
            },
            {
                path: `apps/api/src/app/modules/${fileName}/${fileName}.service.ts`,
                type: 'service' as const,
                canOverwrite: true
            },
            {
                path: `apps/api/src/app/modules/${fileName}/${fileName}.controller.ts`,
                type: 'controller' as const,
                canOverwrite: true
            },
            {
                path: `apps/api/src/app/modules/${fileName}/${fileName}.module.ts`,
                type: 'module' as const,
                canOverwrite: true
            },
            {
                path: `apps/api/src/app/modules/${fileName}/dto/${fileName}.dto.ts`,
                type: 'dto' as const,
                canOverwrite: true
            }
        ];

        // Types files
        const typePaths = [
            {
                path: `libs/types/src/lib/${fileName}.ts`,
                type: 'types' as const,
                canOverwrite: true
            }
        ];

        // React files
        const reactPaths = [
            {
                path: `apps/admin/src/app/pages/${fileName}/${fileName}-list-page.tsx`,
                type: 'react-component' as const,
                canOverwrite: true
            },
            {
                path: `apps/admin/src/app/sections/${fileName}/${fileName}-list-table.tsx`,
                type: 'react-component' as const,
                canOverwrite: true
            },
            {
                path: `apps/admin/src/app/sections/${fileName}/add-edit-${fileName}-dialog.tsx`,
                type: 'react-component' as const,
                canOverwrite: true
            },
            {
                path: `libs/react-core/src/lib/query-hooks/use-${fileName}.ts`,
                type: 'react-hook' as const,
                canOverwrite: true
            },
            {
                path: `libs/react-core/src/lib/services/${fileName}.service.ts`,
                type: 'react-service' as const,
                canOverwrite: true
            }
        ];

        const allPaths = [...apiPaths, ...typePaths, ...reactPaths];

        for (const pathInfo of allPaths) {
            const exists = this.tree.exists(pathInfo.path) || existsSync(pathInfo.path);

            if (exists) {
                conflicts.push({
                    path: pathInfo.path,
                    type: pathInfo.type,
                    exists: true,
                    canOverwrite: pathInfo.canOverwrite
                });
            }
        }

        return conflicts;
    }

    private async resolveEntityConflict(conflict: EntityConflict): Promise<ConflictResolutionResult> {
        // If no interactive mode or force options are set, use default behavior
        if (!this.options.interactive) {
            return this.resolveNonInteractive(conflict);
        }

        // If skip existing is enabled, skip all conflicts
        if (this.options.skipExisting) {
            return {
                entityName: conflict.entityName,
                action: 'skip',
                skipGeneration: true,
                createBackup: false
            };
        }

        // If force update is enabled, update all conflicts
        if (this.options.forceUpdate) {
            return {
                entityName: conflict.entityName,
                action: 'update',
                skipGeneration: false,
                createBackup: this.options.createBackup,
                backupSuffix: this.options.createBackup ? this.generateBackupSuffix() : undefined
            };
        }

        // Interactive resolution
        return await this.resolveInteractive(conflict);
    }

    private resolveNonInteractive(conflict: EntityConflict): ConflictResolutionResult {
        switch (this.options.defaultAction) {
            case 'skip':
                return {
                    entityName: conflict.entityName,
                    action: 'skip',
                    skipGeneration: true,
                    createBackup: false
                };
            case 'update':
                return {
                    entityName: conflict.entityName,
                    action: 'update',
                    skipGeneration: false,
                    createBackup: this.options.createBackup,
                    backupSuffix: this.options.createBackup ? this.generateBackupSuffix() : undefined
                };
            case 'rename':
                return {
                    entityName: conflict.entityName,
                    action: 'rename',
                    skipGeneration: false,
                    createBackup: false,
                    backupSuffix: this.generateBackupSuffix()
                };
            default:
                // Default to skip for safety
                return {
                    entityName: conflict.entityName,
                    action: 'skip',
                    skipGeneration: true,
                    createBackup: false
                };
        }
    }

    private async resolveInteractive(conflict: EntityConflict): Promise<ConflictResolutionResult> {
        console.log(`\n⚠️  Conflict detected for entity: ${conflict.entityName}`);
        console.log(`   The following files already exist:`);

        conflict.conflictingFiles.forEach(file => {
            console.log(`   - ${file.path}`);
        });

        const choices = [
            { name: 'update', message: 'Update (overwrite existing files)' },
            { name: 'skip', message: 'Skip (keep existing files, don\'t generate)' },
            { name: 'backup', message: 'Update with backup (create .backup files)' },
            { name: 'rename', message: 'Rename (generate with .new suffix)' }
        ];

        const response = await prompt<{ action: string }>({
            type: 'select',
            name: 'action',
            message: `How would you like to handle the conflict for ${conflict.entityName}?`,
            choices
        });

        switch (response.action) {
            case 'update':
                return {
                    entityName: conflict.entityName,
                    action: 'update',
                    skipGeneration: false,
                    createBackup: false
                };
            case 'skip':
                return {
                    entityName: conflict.entityName,
                    action: 'skip',
                    skipGeneration: true,
                    createBackup: false
                };
            case 'backup':
                return {
                    entityName: conflict.entityName,
                    action: 'update',
                    skipGeneration: false,
                    createBackup: true,
                    backupSuffix: this.generateBackupSuffix()
                };
            case 'rename':
                return {
                    entityName: conflict.entityName,
                    action: 'rename',
                    skipGeneration: false,
                    createBackup: false,
                    backupSuffix: '.new'
                };
            default:
                return {
                    entityName: conflict.entityName,
                    action: 'skip',
                    skipGeneration: true,
                    createBackup: false
                };
        }
    }

    async resolveGlobalConflicts(conflicts: EntityConflict[]): Promise<ConflictResolutionResult[]> {
        if (conflicts.length === 0) {
            return [];
        }

        if (!this.options.interactive) {
            return conflicts.map(conflict => this.resolveNonInteractive(conflict));
        }

        console.log(`\n⚠️  Found conflicts for ${conflicts.length} entities:`);
        conflicts.forEach(conflict => {
            console.log(`   - ${conflict.entityName} (${conflict.conflictingFiles.length} files)`);
        });

        const choices = [
            { name: 'individual', message: 'Handle each entity individually' },
            { name: 'update-all', message: 'Update all (overwrite all existing files)' },
            { name: 'skip-all', message: 'Skip all (keep all existing files)' },
            { name: 'backup-all', message: 'Update all with backup (create .backup files)' }
        ];

        const response = await prompt<{ action: string }>({
            type: 'select',
            name: 'action',
            message: 'How would you like to handle all conflicts?',
            choices
        });

        switch (response.action) {
            case 'individual':
                const results: ConflictResolutionResult[] = [];
                for (const conflict of conflicts) {
                    const result = await this.resolveInteractive(conflict);
                    results.push(result);
                }
                return results;

            case 'update-all':
                return conflicts.map(conflict => ({
                    entityName: conflict.entityName,
                    action: 'update' as ConflictAction,
                    skipGeneration: false,
                    createBackup: false
                }));

            case 'skip-all':
                return conflicts.map(conflict => ({
                    entityName: conflict.entityName,
                    action: 'skip' as ConflictAction,
                    skipGeneration: true,
                    createBackup: false
                }));

            case 'backup-all':
                const backupSuffix = this.generateBackupSuffix();
                return conflicts.map(conflict => ({
                    entityName: conflict.entityName,
                    action: 'update' as ConflictAction,
                    skipGeneration: false,
                    createBackup: true,
                    backupSuffix
                }));

            default:
                return conflicts.map(conflict => ({
                    entityName: conflict.entityName,
                    action: 'skip' as ConflictAction,
                    skipGeneration: true,
                    createBackup: false
                }));
        }
    }

    createBackupFiles(entityName: string, backupSuffix: string): void {
        const fileName = this.toKebabCase(entityName);
        const filesToBackup = [
            `apps/api/src/app/modules/${fileName}/${fileName}.entity.ts`,
            `apps/api/src/app/modules/${fileName}/${fileName}.service.ts`,
            `apps/api/src/app/modules/${fileName}/${fileName}.controller.ts`,
            `apps/api/src/app/modules/${fileName}/${fileName}.module.ts`,
            `apps/api/src/app/modules/${fileName}/dto/${fileName}.dto.ts`,
            `libs/types/src/lib/${fileName}.ts`,
            `apps/admin/src/app/pages/${fileName}/${fileName}-list-page.tsx`,
            `apps/admin/src/app/sections/${fileName}/${fileName}-list-table.tsx`,
            `apps/admin/src/app/sections/${fileName}/add-edit-${fileName}-dialog.tsx`,
            `libs/react-core/src/lib/query-hooks/use-${fileName}.ts`,
            `libs/react-core/src/lib/services/${fileName}.service.ts`
        ];

        filesToBackup.forEach(filePath => {
            if (this.tree.exists(filePath)) {
                const content = this.tree.read(filePath, 'utf-8');
                const backupPath = `${filePath}${backupSuffix}`;
                this.tree.write(backupPath, content);
                console.log(`   📋 Created backup: ${backupPath}`);
            }
        });
    }

    private generateBackupSuffix(): string {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        return `.backup-${timestamp}`;
    }

    private toKebabCase(str: string): string {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    printConflictSummary(results: ConflictResolutionResult[]): void {
        const updated = results.filter(r => r.action === 'update' && !r.skipGeneration);
        const skipped = results.filter(r => r.skipGeneration);
        const backed = results.filter(r => r.createBackup);
        const renamed = results.filter(r => r.action === 'rename');

        console.log('\n📊 Conflict Resolution Summary:');

        if (updated.length > 0) {
            console.log(`   ✅ Updated: ${updated.length} entities`);
            updated.forEach(r => console.log(`      - ${r.entityName}`));
        }

        if (skipped.length > 0) {
            console.log(`   ⏭️  Skipped: ${skipped.length} entities`);
            skipped.forEach(r => console.log(`      - ${r.entityName}`));
        }

        if (backed.length > 0) {
            console.log(`   📋 Backed up: ${backed.length} entities`);
            backed.forEach(r => console.log(`      - ${r.entityName}`));
        }

        if (renamed.length > 0) {
            console.log(`   🔄 Renamed: ${renamed.length} entities`);
            renamed.forEach(r => console.log(`      - ${r.entityName} (with ${r.backupSuffix} suffix)`));
        }
    }
}
