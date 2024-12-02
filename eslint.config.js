const nx = require('@nx/eslint-plugin');

module.exports = [
    {
        files: ['**/*.json'],
        // Override or add rules here
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off',
        },
        languageOptions: { parser: require('jsonc-eslint-parser') },
    },

    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: [
            '**/dist',
            '.yarn',
            '.vscode',
            '.nx',
            '.github',
            'tmp',
            'node_modules',
            '**/.next',
        ],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        '^@api/',
                        '^@web/',
                        '^@admin/',
                        '^.*/eslint(\\.base)?\\.config\\.[cm]?js$'
                    ],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        // Override or add rules here
        rules: {
            "indent": ["error", 4],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type': 'off'
        },
    }
]
