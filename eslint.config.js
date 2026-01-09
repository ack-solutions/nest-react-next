const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const stylisticPlugin = require('@stylistic/eslint-plugin');
const stylisticJsPlugin = require('@stylistic/eslint-plugin-js');
const importPlugin = require('eslint-plugin-import');

// Load custom base config
const eslintConfig = require('./eslint-config/base-config');

module.exports = tseslint.config(
    {
        ignores: [
            'node_modules/',
            'dist/',
            'tmp/',
            '.github',
            '.vscode',
            '**/.next/**',
            'apps/portal/src/assets',
            '**/vite.config.*.timestamp*',
            '**/vitest.config.*.timestamp*',
            'tools/generators/**/templates/**',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            import: importPlugin,
            '@stylistic': stylisticPlugin,
            '@stylistic/js': stylisticJsPlugin,
        },

        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

        // Override or add rules here
        rules: {
            ...eslintConfig,
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['libs/*', 'apps/*'], // Disallow imports starting with 'packages'
                },
            ],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'no-empty-function': 'off',
        },
    },
    {
        files: ['*.json', '**/*.json'],
        rules: { '@typescript-eslint/no-unused-expressions': 'off' },
    }
);
