const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { corsOptions } = require('./config/cors');
const { rateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

module.exports = app;
