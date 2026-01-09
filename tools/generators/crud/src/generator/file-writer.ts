/**
 * File Writer with conflict resolution
 */

import fs from 'fs';
import path from 'path';
import type { GeneratedFile, GeneratorOptions } from '../types/index.js';

/**
 * Write a file with conflict handling
 */
export function writeFile(
    rootDir: string,
    filePath: string,
    content: string,
    options: GeneratorOptions = {}
): GeneratedFile {
    const fullPath = path.join(rootDir, filePath);
    const dir = path.dirname(fullPath);

    // Dry run - return what would happen
    if (options.dryRun) {
        if (fs.existsSync(fullPath)) {
            return { path: filePath, content, action: 'would-create', reason: 'would overwrite' };
        }
        return { path: filePath, content, action: 'would-create' };
    }

    // Check if file exists
    if (fs.existsSync(fullPath) && !options.force) {
        return { path: filePath, content, action: 'skipped', reason: 'file exists' };
    }

    // Create directory if needed
    fs.mkdirSync(dir, { recursive: true });

    // Write the file
    fs.writeFileSync(fullPath, content, 'utf-8');

    return { path: filePath, content, action: 'created' };
}

/**
 * Append a line to a file if not already present
 */
export function appendLineIfMissing(
    rootDir: string,
    filePath: string,
    line: string,
    options: GeneratorOptions = {}
): GeneratedFile {
    const fullPath = path.join(rootDir, filePath);

    if (options.dryRun) {
        return { path: filePath, content: line, action: 'would-update' };
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, line + '\n', 'utf-8');
        return { path: filePath, content: line, action: 'created' };
    }

    // Check if line already exists
    const content = fs.readFileSync(fullPath, 'utf-8');
    if (content.includes(line)) {
        return { path: filePath, content: line, action: 'unchanged' };
    }

    // Append the line
    fs.appendFileSync(fullPath, '\n' + line);
    return { path: filePath, content: line, action: 'updated' };
}

/**
 * Check if a file exists
 */
export function fileExists(rootDir: string, filePath: string): boolean {
    return fs.existsSync(path.join(rootDir, filePath));
}
