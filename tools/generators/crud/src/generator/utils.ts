/**
 * Utility functions for CRUD generator
 */

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
    return str
        .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
        .replace(/^(.)/, (c) => c.toUpperCase());
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase();
}

/**
 * Convert string to snake_case
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase();
}

/**
 * Convert word to plural form
 */
export function toPlural(word: string): string {
    if (!word) return word;

    // Irregular plurals
    const irregulars: Record<string, string> = {
        child: 'children',
        person: 'people',
        man: 'men',
        woman: 'women',
        tooth: 'teeth',
        foot: 'feet',
        mouse: 'mice',
        goose: 'geese',
    };

    const lower = word.toLowerCase();
    if (irregulars[lower]) {
        return irregulars[lower];
    }

    // Words ending in consonant + y
    if (/[^aeiou]y$/i.test(word)) {
        return word.replace(/y$/i, 'ies');
    }

    // Words ending in s, x, z, ch, sh
    if (/(s|x|z|ch|sh)$/i.test(word)) {
        return `${word}es`;
    }

    // Words ending in f or fe
    if (/f$/i.test(word)) {
        return word.replace(/f$/i, 'ves');
    }
    if (/fe$/i.test(word)) {
        return word.replace(/fe$/i, 'ves');
    }

    return `${word}s`;
}

/**
 * Get TypeScript type from database column type
 */
export function getTypeScriptType(dbType: string, enumTypeName?: string): string {
    switch (dbType) {
        case 'int':
        case 'float':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'enum':
            return enumTypeName || 'string';
        case 'json':
            return 'Record<string, any>';
        case 'date':
        case 'datetime':
            return 'Date';
        case 'uuid':
        case 'string':
        case 'text':
        default:
            return 'string';
    }
}

/**
 * Build TypeORM @Column decorator arguments
 */
export function buildColumnDecoratorArgs(column: {
    nullable?: boolean;
    unique?: boolean;
    dbType: string;
    enumTypeName?: string;
    length?: number;
    default?: string;
}): string {
    const args: string[] = [];

    if (column.nullable) args.push('nullable: true');
    if (column.unique) args.push('unique: true');

    if (column.dbType === 'enum' && column.enumTypeName) {
        args.push(`type: 'enum'`);
        args.push(`enum: ${column.enumTypeName}`);
    }

    if (column.dbType === 'text') {
        args.push(`type: 'text'`);
    }

    if (column.length && column.dbType === 'string') {
        args.push(`length: ${column.length}`);
    }

    if (column.default !== undefined) {
        args.push(`default: ${column.default}`);
    }

    return args.length ? `{ ${args.join(', ')} }` : '';
}
