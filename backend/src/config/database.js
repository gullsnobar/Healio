const mongoose = require('mongoose');
module.exports = {
  uri: process.env.MONGODB_URI,
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000, // Increased for DNS resolution
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    retryReads: true,
    family: 4, // IPv4
  },
};
