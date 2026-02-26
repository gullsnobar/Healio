const cors = require('cors');
const { corsOptions } = require('../config/cors');

const corsHandler = cors(corsOptions);
const corsPreflightHandler = cors(corsOptions);

module.exports = { corsHandler, corsPreflightHandler };
