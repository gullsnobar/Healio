const path = require('path');
const withExpoWebpack = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await withExpoWebpack(env, argv);

  // Ignore React Native specific modules in web builds
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^firebase\/auth\/react-native$/,
    })
  );

  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^@react-native-vector-icons\/get-image$/,
    })
  );

  // Mock fallbacks for React Native modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'firebase/auth/react-native': false,
    '@react-native-vector-icons/get-image': false,
  };

  return config;
};
