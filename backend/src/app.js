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

// ✅ List available models endpoint
app.get("/chat/models", (req, res) => {
  const models = {
    free: [
      {
        id: "meta-llama/llama-3-8b-instruct",
        name: "Llama 3 8B (Recommended)",
        description: "Fast, free, and reliable for health queries",
        type: "free"
      },
      {
        id: "meta-llama/llama-2-7b-chat",
        name: "Llama 2 7B",
        description: "Alternative free model",
        type: "free"
      },
    ],
    premium: [
      {
        id: "openai/gpt-4",
        name: "GPT-4",
        description: "Most capable model (paid)",
        type: "premium"
      },
      {
        id: "openai/gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        description: "Fast and affordable (paid)",
        type: "premium"
      },
    ]
  };
  res.json(models);
});

// ✅ OpenRouter Chat Endpoint (Production Ready)
// Based on: https://openrouter.ai/docs/quickstart
app.post("/chat", async (req, res) => {
  try {
    const { message, model = "meta-llama/llama-3-8b-instruct" } = req.body;

    // ✅ Validate inputs
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: "Message is required and must be a non-empty string" 
      });
    }

    // ✅ Validate model name (prevent injection)
    if (!model || typeof model !== 'string' || model.length > 100) {
      return res.status(400).json({ 
        error: "Invalid model specified" 
      });
    }

    // ✅ Verify API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY not configured');
      return res.status(503).json({ 
        error: "AI service not configured. Please set OPENROUTER_API_KEY in environment." 
      });
    }

    // ✅ OpenRouter API call with best practices from documentation
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          // Required header
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          
          // ✅ Optional headers for app attribution (helps on OpenRouter leaderboards)
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-OpenRouter-Title": "Healio Health Assistant",
        },
        body: JSON.stringify({
          // ✅ Model: customizable, defaults to free Llama
          // See: https://openrouter.ai/docs/faq#how-do-i-use-a-free-model
          model: model,
          
          // Messages in OpenAI format
          messages: [
            {
              role: "user",
              content: message.trim(),
            },
          ],
          
          // ✅ Optional parameters for better responses
          temperature: 0.7,  // Balanced creativity and consistency
          top_p: 0.95,       // Nucleus sampling
          top_k: 40,         // Top-k sampling
          max_tokens: 500,   // Reasonable response length for health queries
        }),
      }
    );

    // Parse response
    const data = await response.json();

    // ✅ Handle API errors with detailed logging
    if (!response.ok) {
      console.error("❌ OpenRouter API Error:", {
        status: response.status,
        error: data?.error,
      });

      // Return appropriate error message
      if (response.status === 401) {
        return res.status(503).json({ 
          error: "Invalid API key. Please check your OPENROUTER_API_KEY." 
        });
      }
      
      if (response.status === 429) {
        return res.status(429).json({ 
          error: "Rate limited. Please try again in a moment." 
        });
      }

      return res.status(response.status).json({
        error: data?.error?.message || "OpenRouter API returned an error",
      });
    }

    // ✅ Safe extraction using optional chaining (prevents crashes)
    const reply = data?.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response.";
    
    // ✅ Log successful response (useful for debugging)
    console.log(`✅ Chat response generated (${reply.length} chars)`);

    // Return success response
    res.json({ 
      reply,
      // Optional: Include additional metadata for frontend
      model: data?.model,
      usage: data?.usage ? {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens,
      } : undefined,
    });

  } catch (error) {
    console.error("❌ Server Error in /chat endpoint:", error.message);
    
    // Check for specific error types
    if (error instanceof TypeError) {
      return res.status(500).json({ 
        error: "Network error. Is the OpenRouter API accessible?" 
      });
    }

    res.status(500).json({ 
      error: "An unexpected error occurred. Please try again.",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

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
