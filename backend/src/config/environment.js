module.exports = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  port: process.env.PORT || 5000,
  aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:8000',
};
