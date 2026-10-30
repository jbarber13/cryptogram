// react-scripts 5 uses webpack 5, which no longer bundles Node core-module
// polyfills. web3 / ipfs-http-client still expect them, so add them back here.
// Loaded by react-app-rewired (see package.json scripts).
const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    assert: require.resolve('assert/'),
    buffer: require.resolve('buffer/'),
    constants: require.resolve('constants-browserify'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    process: require.resolve('process/browser'),
    querystring: require.resolve('querystring-es3'),
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url/'),
    util: require.resolve('util/'),
    vm: require.resolve('vm-browserify'),
    zlib: require.resolve('browserify-zlib'),
    child_process: false,
    fs: false,
    net: false,
    tls: false,
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // Old ESM packages import without file extensions.
  config.module.rules.push({ test: /\.m?js$/, resolve: { fullySpecified: false } });

  // Many old deps ship broken source maps; don't fail/warn on them.
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
