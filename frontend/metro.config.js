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
