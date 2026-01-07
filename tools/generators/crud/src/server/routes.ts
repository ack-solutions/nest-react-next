/**
 * API Routes for CRUD Generator
 */

import type { FastifyInstance } from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCrud, COLUMN_PRESETS, COLUMN_TYPES } from '../generator/index.js';
import type { GeneratorConfig, GeneratorOptions } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory (4 levels up from src/server)
const ROOT_DIR = path.resolve(__dirname, '../../../../..');

export function registerRoutes(fastify: FastifyInstance) {
    // Get metadata (presets, column types)
    fastify.get('/api/meta', async () => {
        return {
            columnTypes: COLUMN_TYPES,
            presets: COLUMN_PRESETS,
        };
    });

    // Preview generated files (dry run)
    fastify.post<{ Body: { config: GeneratorConfig } }>('/api/preview', async (request) => {
        const { config } = request.body;
        const results = await generateCrud(ROOT_DIR, config, { dryRun: true });
        return results;
    });

    // Generate files
    fastify.post<{ Body: { config: GeneratorConfig; options?: GeneratorOptions } }>(
        '/api/generate',
        async (request) => {
            const { config, options = {} } = request.body;
            const results = await generateCrud(ROOT_DIR, config, options);
            return results;
        }
    );

    // Health check
    fastify.get('/api/health', async () => {
        return { status: 'ok' };
    });
}
