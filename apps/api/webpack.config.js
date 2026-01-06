const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      modules: [
        'node_modules',
        '../../node_modules',
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100', /^@libs\/.*/],
      }),
    ],
    plugins: [
      ...(options.plugins || []),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/app/seeder/mjml'),
            to: path.resolve(__dirname, 'dist/app/seeder/mjml'),
          },
        ],
      }),
    ],
  };
};
