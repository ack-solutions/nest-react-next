#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONFIG_DIR = path.join(ROOT, 'config');
const TARGET_FILES = new Set(['app.yml', 'app.yaml']);

let isRunning = false;
let rerunRequested = false;

function runGenerator() {
    if (isRunning) {
        rerunRequested = true;
        return;
    }

    isRunning = true;
    const child = spawn('node', ['scripts/generate-config.mjs'], {
        cwd: ROOT,
        stdio: 'inherit',
    });

    child.on('exit', code => {
        isRunning = false;
        if (code !== 0) {
            console.error('[config:watch] generate-config exited with code', code);
        }
        if (rerunRequested) {
            rerunRequested = false;
            runGenerator();
        }
    });
}

function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}

function watch() {
    ensureConfigDir();
    console.log('[config:watch] Monitoring', path.relative(ROOT, CONFIG_DIR));
    runGenerator();

    try {
        const watcher = fs.watch(CONFIG_DIR, { persistent: true }, (eventType, filename) => {
            if (!filename) {
                runGenerator();
                return;
            }
            const normalised = filename.toString().toLowerCase();
            if (TARGET_FILES.has(normalised)) {
                console.log(`[config:watch] Detected ${eventType} on ${filename}`);
                runGenerator();
            }
        });

        watcher.on('error', error => {
            console.warn('[config:watch] Native watcher failed:', error.message, '- falling back to polling.');
            watcher.close();
            watchWithPolling();
        });
    } catch (error) {
        console.warn('[config:watch] Unable to watch directory:', error.message, '- falling back to polling.');
        watchWithPolling();
    }
}

watch();

function watchWithPolling() {
    const files = Array.from(TARGET_FILES).map(file => path.join(CONFIG_DIR, file));
    files.forEach(file => {
        fs.watchFile(file, { interval: 1000 }, (curr, prev) => {
            if (curr.mtimeMs === prev.mtimeMs && curr.size === prev.size) {
                return;
            }
            console.log(`[config:watch] Detected change in ${path.basename(file)}`);
            runGenerator();
        });
    });
    console.log('[config:watch] Using polling watcher (1s interval).');
}

process.on('SIGINT', () => {
    console.log('\n[config:watch] Stopping watcher.');
    process.exit(0);
});
