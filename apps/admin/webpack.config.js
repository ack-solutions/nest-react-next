const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { join } = require('path');


module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/admin'),
    },
    devServer: {
        port: 4200,
        hot: true,
        liveReload: false,
        historyApiFallback: {
            index: '/index.html',
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        },
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    cache: process.env.NODE_ENV !== 'production' ? {
        type: 'memory',
    } : false,
    resolve: {
        alias: {
            // Ensure react-refresh works correctly
            ...(process.env.NODE_ENV !== 'production' && {
                'react-refresh/runtime': require.resolve('react-refresh/runtime'),
            }),
        },
    },
    plugins: [
        new NxAppWebpackPlugin({
            tsConfig: './tsconfig.app.json',
            compiler: 'babel',
            main: './src/main.tsx',
            index: './src/index.html',
            baseHref: '/',
            assets: ['./src/favicon.ico', './src/assets'],
            styles: ['./src/styles.scss'],
            outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
            optimization: process.env['NODE_ENV'] === 'production',
        }),
        new NxReactWebpackPlugin({
            // Uncomment this line if you don't want to use SVGR
            // See: https://react-svgr.com/
            // svgr: false
        }),
        ...(process.env.NODE_ENV !== 'production' ? [new ReactRefreshWebpackPlugin()] : []),
    ],
};
