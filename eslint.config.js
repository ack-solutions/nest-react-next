const nx = require('@nx/eslint-plugin');
const stylisticPlugin = require('@stylistic/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const react = require('eslint-plugin-react');
const unusedImports = require('eslint-plugin-unused-imports');


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
        plugins: {
            react,
            "unused-imports": unusedImports,
            import: importPlugin,
            '@stylistic': stylisticPlugin,
        }
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
            // Enforce tab indent
            "indent": ["error", 4, {
                "SwitchCase": 1,
                "ignoredNodes": ["PropertyDefinition"]
            }],
            // Ensure props start on a new line when there is more than one prop
            'react/jsx-first-prop-new-line': ['error', 'multiline'],
            // Ensure one prop per line for readability
            'react/jsx-max-props-per-line': ['error', { when: 'always' }],
            // Ensure closing bracket on a new line
            'react/jsx-closing-bracket-location': [
                'error',
                {
                    nonEmpty: 'tag-aligned',
                    selfClosing: 'line-aligned',
                },
            ],
            // Ensure imports are at the top
            "import/first": ["error"],
            // Enforce newline after imports
            "import/newline-after-import": ["error", {
                count: 2,
                exactCount: true,
                considerComments: true,
            }],
            // Enforce import sorting
            'import/order': [
                'error',
                {
                    groups: [
                        ['builtin', 'external'],
                        ['internal'],
                        ['parent', 'sibling', 'index'],
                    ],
                    pathGroups: [
                        {
                            pattern: '@/**',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                    alphabetize: {
                        order: 'asc', // Sort imports alphabetically
                        caseInsensitive: true,
                    },
                    'newlines-between': 'always', // Add newlines between groups
                },
            ],
            // Enforce line breaks for objects with multiple properties
            'object-curly-newline': [
                'error',
                {
                    ObjectExpression: {
                        multiline: true,
                        minProperties: 2,
                        consistent: true
                    },
                    // ObjectPattern: 'never',
                    // ImportDeclaration: {
                    //     multiline: true,
                    //     minProperties: 2,
                    //     consistent: false
                    // },
                },
            ],
            // Enforce one property per line in object literals
            'object-property-newline': [
                'error',
                {
                    allowAllPropertiesOnSameLine: false,
                },
            ],
            // Enforce blank lines for TypeScript-specific nodes
            '@stylistic/padding-line-between-statements': [
                'error',
                {
                    blankLine: 'always',
                    prev: ["enum", "interface", "type", 'class', 'function', 'directive', 'break', 'export'],
                    next: '*',
                },
                {
                    blankLine: "never",
                    prev: "function-overload",
                    next: "function"
                }
            ],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "args": "all",
                    "argsIgnorePattern": "^_",
                    "caughtErrors": "all",
                    "caughtErrorsIgnorePattern": "^_",
                    "destructuredArrayIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-empty-object-type': 'off'
        },
    }
]
