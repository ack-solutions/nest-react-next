import { formatFiles, Tree } from '@nx/devkit';
import { BulkCrudGenerator } from './bulk-generator';
import { BulkGenerationOptions } from './bulk-config';

export interface BulkGeneratorSchema {
    configFile?: string;
    entities?: string[];
    skipExisting?: boolean;
    dryRun?: boolean;
    verbose?: boolean;
    force?: boolean;
    interactive?: boolean;
    conflictResolution?: 'ask' | 'skip' | 'update' | 'backup';
    createBackup?: boolean;
}

export default async function (tree: Tree, options: BulkGeneratorSchema) {
    const bulkOptions: BulkGenerationOptions = {
        configFile: options.configFile || 'crud.config.json',
        entities: options.entities || [],
        skipExisting: options.skipExisting || false,
        dryRun: options.dryRun || false,
        verbose: options.verbose || false,
        force: options.force || false,
        interactive: options.interactive !== false, // Default to true unless explicitly set to false
        conflictResolution: options.conflictResolution || 'ask',
        createBackup: options.createBackup || false,
    };

    console.info('🚀 Starting bulk CRUD generation...');
    console.info(`📄 Config file: ${bulkOptions.configFile}`);

    if (bulkOptions.entities && bulkOptions.entities.length > 0) {
        console.info(`🎯 Generating specific entities: ${bulkOptions.entities.join(', ')}`);
    }

    if (bulkOptions.dryRun) {
        console.info('🔍 Running in dry-run mode');
    }

    await BulkCrudGenerator.generate(tree, bulkOptions);

    if (!bulkOptions.dryRun) {
        await formatFiles(tree);
    }
}
