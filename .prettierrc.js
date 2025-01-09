module.exports = {
    arrowParens: 'avoid',
    bracketSameLine: true,
    bracketSpacing: false,
    singleQuote: true,
    trailingComma: 'all',
    useTabs: false,
    tabWidth: 4,
    overrides: [
        {
            files: ['*.yml'],
            options: {
                useTabs: false,
                tabWidth: 2,
            },
        },
    ],
    endOfLine: 'lf',
};
