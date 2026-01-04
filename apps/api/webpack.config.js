const nodeExternals = require('webpack-node-externals');

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
  };
};
