const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { corsOptions } = require('./config/cors');
const { rateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// Initialize OpenAI client lazily (when needed)
let openaiClient = null;

const getOpenAIClient = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (err) {
      console.warn('⚠ Failed to initialize OpenAI:', err.message);
    }
  }
  return openaiClient;
};

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

// OpenAI Test Endpoint
app.get('/test-openai', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        error: 'OpenAI API key not configured',
        message: 'OPENAI_API_KEY not found in environment variables'
      });
    }

    const client = getOpenAIClient();
    if (!client) {
      return res.status(503).json({ 
        error: 'OpenAI client initialization failed',
        message: 'Unable to initialize OpenAI client'
      });
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Say hello in one short line' }
      ],
      max_tokens: 100,
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
      model: response.model,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
      }
    });

  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

module.exports = app;
