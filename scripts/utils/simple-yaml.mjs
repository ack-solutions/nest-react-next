import fs from 'node:fs';

const ENV_PATTERN = /\$\{([A-Z0-9_]+)(?::-(.*?))?\}/gi;

export function parseSimpleYaml(content) {
    const root = {};
    const stack = [{ indent: -1, value: root }];
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
        const originalLine = lines[i];
        const withoutComment = originalLine.replace(/\s+#.*$/, '');
        const trimmedLine = withoutComment.trim();

        if (!trimmedLine || trimmedLine.startsWith('#')) {
            continue;
        }

        const indentMatch = withoutComment.match(/^[ \t]*/);
        const indent = indentMatch ? indentMatch[0].replace(/\t/g, '    ').length : 0;

        const separatorIndex = trimmedLine.indexOf(':');
        if (separatorIndex === -1) {
            continue;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        const valuePortion = trimmedLine.slice(separatorIndex + 1).trim();

        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
            stack.pop();
        }

        const parent = stack[stack.length - 1].value;

        if (valuePortion === '') {
            parent[key] = {};
            stack.push({ indent, value: parent[key] });
        } else {
            parent[key] = parseScalar(valuePortion);
        }
    }

    return root;
}

function parseScalar(value) {
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
        return value.slice(1, -1);
    }
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!Number.isNaN(Number(value)) && value.trim() !== '') {
        return Number(value);
    }
    return value;
}

export function coerceStringValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (value !== '' && !Number.isNaN(Number(value))) {
        return Number(value);
    }
    return value;
}

export function resolvePlaceholders(entity) {
    if (typeof entity === 'string') {
        const replaced = entity.replace(ENV_PATTERN, (_, key, fallback) => {
            const envValue = process.env[key];
            if (envValue !== undefined && envValue !== '') {
                return envValue;
            }
            return fallback ?? '';
        });
        return coerceStringValue(replaced);
    }

    if (Array.isArray(entity)) {
        return entity.map(resolvePlaceholders);
    }

    if (entity && typeof entity === 'object') {
        return Object.fromEntries(
            Object.entries(entity).map(([key, value]) => [key, resolvePlaceholders(value)])
        );
    }

    return entity;
}

export function stringifySimpleYaml(object, indent = 0) {
    const pad = level => ' '.repeat(level * 2);

    const lines = [];
    const append = line => lines.push(line);

    const walk = (value, level, key) => {
        if (value === null || value === undefined) {
            append(`${pad(level)}${key}:`);
            return;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            append(`${pad(level)}${key}:`);
            Object.entries(value).forEach(([childKey, childValue]) => {
                walk(childValue, level + 1, childKey);
            });
            return;
        }

        append(`${pad(level)}${key}: ${formatScalar(value)}`);
    };

    Object.entries(object || {}).forEach(([key, value]) => {
        walk(value, indent, key);
    });

    return `${lines.join('\n')}\n`;
}

function formatScalar(value) {
    if (typeof value === 'string') {
        if (value.includes(':') || value.includes('#') || value.includes('\n') || value.includes("'")) {
            return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) ? String(value) : 'null';
    }

    return `${value}`;
}

export function readYamlFile(path) {
    if (!fs.existsSync(path)) {
        return {};
    }
    const content = fs.readFileSync(path, 'utf8');
    return parseSimpleYaml(content);
}
