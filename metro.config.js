const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true
});

// 1. Enhanced resolver for module resolution
config.resolver = {
  ...config.resolver,
  sourceExts: [
    ...config.resolver.sourceExts,
    'js',
    'jsx',
    'cjs',
    'mjs'
  ],
  assetExts: [
    ...config.resolver.assetExts,
    'png',
    'jpg',
    'svg'
  ],
  resolverMainFields: ['react-native', 'browser', 'main'],
  unstable_enablePackageExports: true
};

// 2. Logging configuration (preserves your custom logging)
config.reporter = {
  update: (event) => {
    if (event.type === 'client_log') {
      console[event.level](`[APP ${event.level.toUpperCase()}]`, ...event.data);
    }
    if (event.type === 'bundle_transform_progressed') {
      console.log(`[BUNDLE] ${event.transformedFileCount}/${event.totalFileCount} files`);
    }
  }
};

// 3. Server configuration for better debugging
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => (req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return middleware(req, res, next);
  }
};

module.exports = config;