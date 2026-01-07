/**
 * Fastify Server for CRUD Generator UI
 */

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServer() {
    const fastify = Fastify({ logger: false });

    // Enable CORS
    await fastify.register(fastifyCors, { origin: true });

    // Serve static UI
    await fastify.register(fastifyStatic, {
        root: path.join(__dirname, '../ui'),
        prefix: '/',
    });

    // Register API routes
    registerRoutes(fastify);

    return fastify;
}

export async function startServer(port: number) {
    const server = await createServer();

    try {
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`\n  CRUD Generator UI`);
        console.log(`  http://localhost:${port}\n`);
        return server;
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
