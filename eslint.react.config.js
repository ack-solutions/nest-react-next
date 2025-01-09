// const eslintConfig = require('./eslint-config/react-config');
const baseConfig = require('./eslint.config');


module.exports = [
    ...baseConfig,
    {
        plugins: {
            react: require('eslint-plugin-react'),
        },
        files: ['**/*.tsx', '**/*.jsx'],

        // Override or add rules here
        rules: {
            // ...eslintConfig,
            // Enforce rules of hooks
            'react-hooks/rules-of-hooks': 'error',

            // Ensure proper dependencies for hooks
            'react-hooks/exhaustive-deps': ['warn'],
        },
    },
];
