const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// List of Node modules to stub as empty in React Native
const nodeStdlibModules = [
  'crypto', 'url', 'http', 'http2', 'https', 'net', 'tls', 'dns',
  'stream', 'zlib', 'assert', 'events', 'util', 'querystring',
  'path', 'os', 'fs', 'child_process', 'worker_threads', 'sea',
];

const normalizeNodeModuleName = (moduleName) => {
  if (moduleName.startsWith('node:')) {
    return moduleName.slice(5);
  }
  return moduleName;
};

// Use resolver.extraNodeModules to prevent Metro creating invalid folders
config.resolver.extraNodeModules = nodeStdlibModules.reduce((acc, mod) => {
  acc[mod] = __dirname + '/emptyModule.js'; // point to a local empty file
  return acc;
}, {});

// Optional: fallback for resolver
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const normalizedModuleName = normalizeNodeModuleName(moduleName);
  if (nodeStdlibModules.includes(normalizedModuleName)) {
    return {
      type: 'sourceFile',
      filePath: __dirname + '/emptyModule.js',
    };
  }
  return defaultResolveRequest(context, moduleName, platform);
};

// Ensure bundle responses have correct MIME type
config.server = config.server || {};
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    if (req.url.endsWith('.bundle')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    }
    return middleware(req, res, next);
  };
};

module.exports = config;
