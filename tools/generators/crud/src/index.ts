#!/usr/bin/env node
/**
 * CRUD Generator CLI Entry Point
 */

import getPort from 'get-port';
import open from 'open';
import { startServer } from './server/index.js';

const DEFAULT_PORT = 4876;

async function main() {
    // Find available port
    const port = await getPort({ port: DEFAULT_PORT });

    // Start server
    const server = await startServer(port);

    // Open browser
    await open(`http://localhost:${port}`);

    // Handle graceful shutdown
    const shutdown = async () => {
        console.log('\nShutting down...');
        await server.close();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

main().catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
});
