const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: {
      type: 'commonjs2',
    },
  },
  cache: {
    compression: false,
    allowCollectingMemory: true,
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    cacheDirectory: path.resolve(__dirname, '.cache'),
  },
  snapshot: {
    managedPaths: [path.resolve(__dirname, './node_modules'), path.resolve(__dirname, '../../node_modules')],
    immutablePaths: [],
    buildDependencies: {
      hash: true,
      timestamp: true,
    },
    module: {
      timestamp: true,
    },
    resolve: {
      timestamp: true,
    },
    resolveBuildDependencies: {
      hash: true,
      timestamp: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.join(__dirname, 'src'),
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'nimma/legacy': path.join(
        __dirname,
        '../../node_modules/nimma/dist',
        process.version.slice(1, 3) === '12' ? 'legacy' : '',
        'esm/index.mjs',
      ),
      'nimma/fallbacks': path.join(__dirname, '../../node_modules/nimma/dist/esm/fallbacks/index.mjs'),
    },
  },
  performance: {
    hints: 'warning',
  },
  devtool: false,
  context: __dirname,
  target: 'node',
  stats: 'errors-only',
  node: {
    // __dirname: true,
  },
  optimization: {
    chunkIds: 'size',
    moduleIds: 'size',
    mangleExports: 'size',
    minimize: true,
    realContentHash: false,
  },
};
