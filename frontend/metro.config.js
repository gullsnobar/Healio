const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix: axios tries to import Node's "crypto" module which doesn't exist in React Native.
// This tells Metro to resolve it to an empty module instead of crashing.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'crypto') {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
