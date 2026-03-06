const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Node standard library modules that axios (and other packages) try to import
// but don't exist in the React Native runtime. Resolve them as empty modules.
const nodeStdlibModules = [
  'crypto', 'url', 'http', 'http2', 'https', 'net', 'tls', 'dns',
  'stream', 'zlib', 'assert', 'events', 'util', 'querystring',
  'path', 'os', 'fs', 'child_process', 'worker_threads',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (nodeStdlibModules.includes(moduleName)) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
