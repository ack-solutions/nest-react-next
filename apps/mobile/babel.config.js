module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Handle import.meta in shared code
            'transform-import-meta',
            // Required for react-native-reanimated (must be last)
            'react-native-reanimated/plugin',
        ],
        env: {
            production: {
                plugins: ['react-native-paper/babel'],
            },
        },
    };
};
