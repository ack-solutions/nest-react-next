/**
 * Template Engine using EJS
 */

import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates directory (relative to built output or source)
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

/**
 * Load and render a template file
 */
export async function renderTemplate(
    templatePath: string,
    context: Record<string, any>
): Promise<string> {
    const fullPath = path.join(TEMPLATES_DIR, templatePath);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Template not found: ${templatePath}`);
    }

    const template = fs.readFileSync(fullPath, 'utf-8');

    return ejs.render(template, context, {
        filename: fullPath, // Enables includes
        async: false,
    });
}

/**
 * Check if a template exists
 */
export function templateExists(templatePath: string): boolean {
    const fullPath = path.join(TEMPLATES_DIR, templatePath);
    return fs.existsSync(fullPath);
}

/**
 * Get list of all template files
 */
export function listTemplates(): string[] {
    const templates: string[] = [];

    function walkDir(dir: string, prefix = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const relativePath = path.join(prefix, entry.name);
            if (entry.isDirectory()) {
                walkDir(path.join(dir, entry.name), relativePath);
            } else if (entry.name.endsWith('.ejs')) {
                templates.push(relativePath);
            }
        }
    }

    if (fs.existsSync(TEMPLATES_DIR)) {
        walkDir(TEMPLATES_DIR);
    }

    return templates;
}
