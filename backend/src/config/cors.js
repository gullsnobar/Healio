const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://healio.com', 'https://app.healio.com']
    : true,  // Allow ALL origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
};
module.exports = { corsOptions };
