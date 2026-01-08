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
            '@libs/react-shared': fileURLToPath(new URL('../../packages/react-shared/src/index.ts', import.meta.url)),
            '@libs/utils': fileURLToPath(new URL('../../packages/utils/src/index.ts', import.meta.url)),
            '@libs/types': fileURLToPath(new URL('../../packages/types/src/index.ts', import.meta.url)),
            '@admin': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 4200,
        host: 'localhost',
        fs: { allow: ['..'] },
    },
    build: {
        outDir: '../../dist/apps/admin',
        emptyOutDir: true,
    },
    envPrefix: 'VITE_',
});
