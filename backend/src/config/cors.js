const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://healio.com', 'https://app.healio.com']
    : ['http://localhost:3000', 'http://localhost:19006', 'http://localhost:8081'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};
module.exports = { corsOptions };
