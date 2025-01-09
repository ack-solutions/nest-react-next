const { fixupConfigRules } = require('@eslint/compat');
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const nx = require('@nx/eslint-plugin');

const baseConfig = require('../../eslint.react.config');


const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    ...fixupConfigRules(compat.extends('next')),

    ...fixupConfigRules(compat.extends('next/core-web-vitals')),

    ...baseConfig,
    ...nx.configs['flat/react-typescript'],
    { ignores: ['.next/**/*'] },
];
