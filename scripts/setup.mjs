#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { DEFAULT_TEMPLATE } from './config/default-template.mjs';
import { coerceStringValue, readYamlFile, stringifySimpleYaml } from './utils/simple-yaml.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'config', 'app.yml');

const HEADER = `# Application-wide configuration. Update this file for project-specific branding\n# and environment defaults. Values support \${ENV_VAR:-fallback} syntax.\n`;

const QUESTION_SECTIONS = [
    {
        title: 'Application',
        questions: [
            {
                key: 'app.name',
                label: 'Application name',
                type: 'string',
            },
            {
                key: 'app.description',
                label: 'Application description',
                type: 'string',
            },
        ],
    },
    {
        title: 'Branding',
        questions: [
            {
                key: 'branding.primaryColor',
                label: 'Primary brand color',
                type: 'string',
            },
            {
                key: 'branding.secondaryColor',
                label: 'Secondary brand color',
                type: 'string',
            },
            {
                key: 'branding.logo',
                label: 'Logo path (relative to public assets)',
                type: 'string',
            },
        ],
    },
    {
        title: 'URLs',
        questions: [
            {
                key: 'urls.api',
                label: 'API base URL',
                type: 'url',
            },
            {
                key: 'urls.admin',
                label: 'Admin app URL',
                type: 'url',
            },
            {
                key: 'urls.web',
                label: 'Web app URL',
                type: 'url',
            },
            {
                key: 'urls.cdn',
                label: 'CDN base URL (optional)',
                type: 'url',
                optional: true,
            },
        ],
    },
    {
        title: 'Features',
        questions: [
            {
                key: 'features.enableSignup',
                label: 'Allow self-service user sign-up',
                type: 'boolean',
            },
        ],
    },
];

const ENVIRONMENT_CHECKS = [
    {
        label: 'Node.js >= 20.8',
        required: true,
        run: () => {
            const current = process.versions.node;
            const ok = isVersionAtLeast(current, '20.8.0');
            return {
                ok,
                details: `Detected ${current}`,
                recommendation: ok ? undefined : 'Install Node.js 20.8 or newer.',
            };
        },
    },
    {
        label: 'pnpm >= 9 (package manager declaration)',
        required: true,
        run: () => {
            try {
                const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
                const declared = manifest.packageManager;
                if (!declared || typeof declared !== 'string' || !declared.startsWith('pnpm@')) {
                    return {
                        ok: false,
                        details: declared ? `Declared ${declared}` : 'No packageManager field found.',
                        recommendation: 'Set "packageManager": "pnpm@<version>" in package.json.',
                    };
                }
                const version = declared.split('@')[1] ?? '';
                const ok = isVersionAtLeast(version, '9.0.0');
                return {
                    ok,
                    details: `Declared ${declared}`,
                    recommendation: ok ? undefined : 'Update packageManager field to pnpm@9 or newer.',
                };
            } catch (error) {
                return {
                    ok: false,
                    details: `Unable to read package.json: ${error.message}`,
                    recommendation: 'Verify repository integrity before rerunning setup.',
                };
            }
        },
    },
    {
        label: 'pnpm executable available',
        required: false,
        run: () => {
            const result = spawnSync('pnpm', ['--version'], { encoding: 'utf8' });
            if (result.status === 0 && !result.error) {
                const version = result.stdout.trim();
                return { ok: true, details: version ? `Detected ${version}` : 'Detected pnpm' };
            }
            const errorMessage = result.error?.code === 'EPERM' ?
                'Corepack could not create cache directories (sandboxed environment).' :
                (result.error?.message || result.stderr.trim() || 'Unknown error invoking pnpm.');
            return {
                ok: false,
                details: errorMessage,
                recommendation: 'Install pnpm locally (https://pnpm.io/) or ensure COREPACK has write permissions.',
            };
        },
    },
    {
        label: 'Turbo CLI available',
        required: false,
        run: () => {
            const turboPackagePath = path.join(ROOT, 'node_modules', 'turbo', 'package.json');
            if (!fs.existsSync(turboPackagePath)) {
                return {
                    ok: false,
                    details: 'Turbo package not found in node_modules.',
                    recommendation: 'Install Turbo (pnpm add -D turbo) for full pipeline support.',
                };
            }
            try {
                const { version } = JSON.parse(fs.readFileSync(turboPackagePath, 'utf8'));
                return { ok: true, details: `Detected ${version ?? 'unknown version'}` };
            } catch (error) {
                return {
                    ok: false,
                    details: `Unable to read Turbo version: ${error.message}`,
                    recommendation: 'Reinstall dependencies with pnpm install.',
                };
            }
        },
    },
    {
        label: 'Node modules installed',
        required: false,
        run: () => {
            const hasNodeModules = fs.existsSync(path.join(ROOT, 'node_modules'));
            return {
                ok: hasNodeModules,
                details: hasNodeModules ? 'node_modules directory found.' : 'Install dependencies with pnpm install.',
                recommendation: hasNodeModules ? undefined : 'Run pnpm install before continuing.',
            };
        },
    },
    {
        label: 'Configuration directory writable',
        required: true,
        run: () => {
            const configDir = path.dirname(CONFIG_PATH);
            try {
                if (!fs.existsSync(configDir)) {
                    fs.mkdirSync(configDir, { recursive: true });
                }
                fs.accessSync(configDir, fs.constants.W_OK);
                return { ok: true, details: `Writable: ${configDir}` };
            } catch (error) {
                return {
                    ok: false,
                    details: error.message,
                    recommendation: `Ensure write permission to ${configDir}.`,
                };
            }
        },
    },
];

async function main() {
    console.log('=== Project Setup Assistant ===');

    const rl = createInterface({ input, output });
    setupSignalHandlers(rl);

    try {
        const checkResults = ENVIRONMENT_CHECKS.map(check => {
            try {
                return {
                    label: check.label,
                    required: check.required,
                    ...check.run(),
                };
            } catch (error) {
                return {
                    label: check.label,
                    required: check.required,
                    ok: false,
                    details: error.message,
                    recommendation: 'Resolve this check or rerun with --force after manual verification.',
                };
            }
        });

        const hasFailures = checkResults.some(result => !result.ok);
        const blockingFailures = checkResults.filter(result => !result.ok && result.required);

        console.log('\nEnvironment checks:');
        checkResults.forEach(result => {
            const status = result.ok ? '✔' : result.required ? '✖' : '⚠';
            console.log(`  ${status} ${result.label} (${result.details})`);
            if (!result.ok && result.recommendation) {
                console.log(`    → ${result.recommendation}`);
            }
        });

        if (blockingFailures.length > 0) {
            console.log('\nOne or more required checks failed. Resolve the issues above and re-run the setup.');
            const proceed = await askBoolean(rl, 'Proceed anyway?', false);
            if (!proceed) {
                process.exit(1);
            }
        } else if (hasFailures) {
            console.log('\nNon-blocking issues were detected.');
            const proceed = await askBoolean(rl, 'Continue with setup?', true);
            if (!proceed) {
                process.exit(1);
            }
        }

        console.log('\nConfiguration');
        const existingConfig = readYamlFile(CONFIG_PATH);
        const baseConfig = deepMerge(clone(DEFAULT_TEMPLATE), existingConfig);

        const updatedConfig = await promptForConfig(rl, baseConfig);

        if (!(await askBoolean(rl, '\nWrite configuration to config/app.yml?', true))) {
            console.log('Aborted without writing configuration.');
            process.exit(0);
        }

        writeConfig(updatedConfig);
        console.log(`\n✓ Configuration written to ${path.relative(ROOT, CONFIG_PATH)}`);

        const generateResult = spawnSync('node', ['scripts/generate-config.mjs'], {
            cwd: ROOT,
            stdio: 'inherit',
        });
        if (generateResult.status !== 0) {
            console.warn('⚠ Failed to regenerate TypeScript config from YAML. Run pnpm config:generate manually.');
        }

        console.log('\nSetup complete.');
    } finally {
        rl.close();
    }
}

async function promptForConfig(rl, config) {
    let currentConfig = clone(config);

    for (const section of QUESTION_SECTIONS) {
        console.log(`\n› ${section.title}`);
        for (const question of section.questions) {
            currentConfig = await askAndAssign(rl, currentConfig, question);
        }
    }

    return currentConfig;
}

async function askAndAssign(rl, config, question) {
    const { key, label, type, optional } = question;
    const templateValue = getNestedValue(DEFAULT_TEMPLATE, key);
    const currentValue = getNestedValue(config, key, templateValue);
    const displayValue = prepareDisplayValue(currentValue, type);

    let answer;
    if (type === 'boolean') {
        answer = await askBoolean(rl, `${label}`, Boolean(displayValue));
    } else {
        answer = await askString(rl, `${label}`, displayValue ?? '');
        if (!answer && optional) {
            answer = '';
        }

        if (type === 'url') {
            answer = normaliseUrl(answer);
        }
    }

    const shouldRetainPlaceholder =
        typeof currentValue === 'string' &&
        isEnvPlaceholder(currentValue) &&
        valuesMatch(answer, displayValue, type);

    const valueToPersist = shouldRetainPlaceholder ? currentValue : answer;

    const resultConfig = clone(config);
    setNestedValue(resultConfig, key, valueToPersist);
    return resultConfig;
}

function normaliseUrl(value) {
    if (!value) {
        return '';
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }

    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed.replace(/\/+$/, '');
    }

    if (trimmed.startsWith('/')) {
        return trimmed;
    }

    const scheme = trimmed.startsWith('localhost') || trimmed.startsWith('127.') || trimmed.startsWith('0.0.0.0') ? 'http' : 'https';
    return `${scheme}://${trimmed.replace(/^\/+/, '')}`.replace(/\/+$/, '');
}

async function askString(rl, prompt, defaultValue) {
    const suffix = defaultValue ? ` (${defaultValue})` : '';
    const response = (await rl.question(`  ${prompt}${suffix ? suffix : ''}: `)).trim();
    return response === '' ? defaultValue : response;
}

async function askBoolean(rl, prompt, defaultValue) {
    const hint = defaultValue ? '[Y/n]' : '[y/N]';
    while (true) {
        const response = (await rl.question(`  ${prompt} ${hint}: `)).trim().toLowerCase();
        if (response === '') {
            return defaultValue;
        }
        if (['y', 'yes'].includes(response)) {
            return true;
        }
        if (['n', 'no'].includes(response)) {
            return false;
        }
        console.log('    Please answer y or n.');
    }
}

function writeConfig(config) {
    const yamlBody = stringifySimpleYaml(orderConfigKeys(config));
    fs.writeFileSync(CONFIG_PATH, `${HEADER}${yamlBody}`);
}

const PLACEHOLDER_PATTERN = /^\$\{([A-Z0-9_]+)(?::-(.*))?\}$/i;

function isEnvPlaceholder(value) {
    return typeof value === 'string' && PLACEHOLDER_PATTERN.test(value);
}

function resolvePlaceholderValue(value) {
    if (!isEnvPlaceholder(value)) {
        return value;
    }
    const [, key, fallback] = value.match(PLACEHOLDER_PATTERN);
    const envValue = process.env[key];
    return envValue !== undefined && envValue !== '' ? envValue : (fallback ?? '');
}

function prepareDisplayValue(value, type) {
    const resolved = resolvePlaceholderValue(value);
    if (type === 'boolean') {
        if (typeof resolved === 'boolean') {
            return resolved;
        }
        if (typeof resolved === 'string') {
            const coerced = coerceStringValue(resolved);
            if (typeof coerced === 'boolean') {
                return coerced;
            }
        }
        return Boolean(resolved);
    }
    return resolved ?? '';
}

function valuesMatch(answer, displayValue, type) {
    if (type === 'boolean') {
        return Boolean(answer) === Boolean(displayValue);
    }
    return String(answer ?? '') === String(displayValue ?? '');
}

function orderConfigKeys(config) {
    const ordered = {};
    ['app', 'branding', 'urls', 'features'].forEach(key => {
        if (config[key] !== undefined) {
            ordered[key] = config[key];
        }
    });

    Object.keys(config).forEach(key => {
        if (!(key in ordered)) {
            ordered[key] = config[key];
        }
    });

    return ordered;
}

function deepMerge(target, source) {
    const output = clone(target);
    if (!source || typeof source !== 'object') {
        return output;
    }

    Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            output[key] = deepMerge(output[key] || {}, value);
        } else {
            output[key] = value;
        }
    });

    return output;
}

function clone(value) {
    return JSON.parse(JSON.stringify(value ?? {}));
}

function getNestedValue(object, pathExpression, fallback) {
    return pathExpression.split('.').reduce((accumulator, segment) => {
        if (accumulator && Object.prototype.hasOwnProperty.call(accumulator, segment)) {
            return accumulator[segment];
        }
        return undefined;
    }, object) ?? fallback;
}

function setNestedValue(object, pathExpression, value) {
    const segments = pathExpression.split('.');
    let cursor = object;
    for (let i = 0; i < segments.length - 1; i += 1) {
        const segment = segments[i];
        if (!cursor[segment] || typeof cursor[segment] !== 'object') {
            cursor[segment] = {};
        }
        cursor = cursor[segment];
    }
    cursor[segments[segments.length - 1]] = value;
}

function isVersionAtLeast(current, required) {
    const currentParts = current.split('.').map(Number);
    const requiredParts = required.split('.').map(Number);
    const length = Math.max(currentParts.length, requiredParts.length);

    for (let i = 0; i < length; i += 1) {
        const currentValue = currentParts[i] ?? 0;
        const requiredValue = requiredParts[i] ?? 0;
        if (currentValue > requiredValue) return true;
        if (currentValue < requiredValue) return false;
    }

    return true;
}

function setupSignalHandlers(rl) {
    const handleExit = () => {
        rl.close();
        process.exit(0);
    };
    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);
}

main().catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
});
