/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import { fileURLToPath } from 'url';

export default defineConfig({
    plugins: [
        react(),
        envCompatible({
            prefix: 'VITE_',
            mountedPath: 'process.env',
        }),
    ],
    resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
            '@libs/react-shared': fileURLToPath(new URL('../../libs/react-shared/src/index.ts', import.meta.url)),
            '@libs/utils': fileURLToPath(new URL('../../libs/utils/src/index.ts', import.meta.url)),
            '@libs/types': fileURLToPath(new URL('../../libs/types/src/index.ts', import.meta.url)),
            '@admin': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 4200,
        // Docker needs the dev server to listen on all interfaces.
        // For local development this is fine as well.
        host: '0.0.0.0',
        fs: { allow: ['..'] },
    },
    build: {
        outDir: '../../dist/apps/admin',
        emptyOutDir: true,
    },
    envPrefix: 'VITE_',
});
