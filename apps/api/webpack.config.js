const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = function (options) {
  const rootNodeModules = path.resolve(__dirname, '../../node_modules');
  const appNodeModules = path.join(__dirname, 'node_modules');

  return {
    ...options,

    entry: {
      main: path.resolve(__dirname, 'src/main.ts'),
    },

    output: {
      ...options.output,
      filename: '[name].js',
    },

    // Make sure webpack is in "node" mode
    target: 'node',
    externalsPresets: { node: true },

    resolve: {
      ...options.resolve,

      // IMPORTANT: pnpm monorepo - include root + local node_modules
      modules: ['node_modules', rootNodeModules, appNodeModules],

      extensions: ['.ts', '.tsx', '.js', '.jsx'],

      // IMPORTANT: helps with pnpm symlinks
      symlinks: false,
    },

    externals: [
      // Externalize all node_modules (so native .node files are NOT bundled)
      nodeExternals({
        modulesDir: rootNodeModules,
        additionalModuleDirs: [appNodeModules],
        allowlist: ['webpack/hot/poll?100', /^@libs\/.*/],
      }),

      // EXTRA SAFETY: force argon2 to runtime require (avoid bundling .node)
      { '@node-rs/argon2': 'commonjs @node-rs/argon2' },
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
