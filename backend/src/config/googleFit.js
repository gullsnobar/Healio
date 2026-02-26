const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_FIT_CLIENT_ID,
  process.env.GOOGLE_FIT_CLIENT_SECRET,
  'http://localhost:5000/api/auth/google/callback'
);
module.exports = { oauth2Client, fitness: google.fitness({ version: 'v1', auth: oauth2Client }) };
