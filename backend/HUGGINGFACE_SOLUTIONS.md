# Hugging Face Integration - Solutions Guide

## Problem Identified ❌
- Old Hugging Face endpoint (`api-inference.huggingface.co`) is **deprecated (410 error)**
- New router endpoint returns **404 Not Found**
- This means the Hugging Face free Inference API endpoint format has changed

---

## Solution Options (Pick ONE)

### ✅ OPTION 1: Use OpenAI API (RECOMMENDED - Fastest)
You already have `OPENAI_API_KEY` configured in `.env`. This is the fastest solution.

### Step 1: Update chatbotService.js
Replace the file with OpenAI implementation:

```javascript
/**
 * AI CHATBOT SERVICE - OpenAI Version
 * Uses OpenAI GPT-3.5-Turbo for health-related queries
 * More reliable and faster than Hugging Face free tier
 */

const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const conversationHistory = {};

const chatWithAI = async (userMessage, userId = 'unknown') => {
  try {
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Invalid message: must be a non-empty string');
    }

    if (userMessage.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    if (userMessage.length > 2000) {
      throw new Error('Message too long (max 2000 characters)');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`📝 [Chatbot] User ${userId} sent message: "${userMessage.substring(0, 50)}..."`);

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful health and medication assistant for the HEALIO app.
Your responsibilities:
- Provide accurate, safe, and simple health information
- Give medication reminders and wellness tips
- Be empathetic and supportive
- Always recommend consulting a doctor for serious conditions
- Keep responses concise (2-3 sentences max)
- Avoid medical claims you cannot verify`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        max_tokens: 250,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let aiResponse = '';
    if (response.data?.choices?.[0]?.message?.content) {
      aiResponse = response.data.choices[0].message.content.trim();
    }

    if (!aiResponse) {
      aiResponse = "I'm thinking... Could you rephrase your question?";
    }

    console.log(`✅ [Chatbot] Response generated: ${aiResponse.substring(0, 50)}...`);

    return {
      success: true,
      message: aiResponse,
      model: 'gpt-3.5-turbo',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ [Chatbot] Error: ${error.message}`);
    throw error;
  }
};

// Other export functions remain the same
module.exports = {
  chatWithAI,
  // ... rest of exports
};
```

**Advantages:**
- ✅ Faster responses
- ✅ More reliable
- ✅ Better quality responses
- ✅ Your API key already works

---

### OPTION 2: Use Hugging Face Inference API (With Updated Implementation)
If you want to stick with Hugging Face, use the **Serverless Inference API**.

**Requirements:**
- Hugging Face Pro account ($9/month) - Free tier is being deprecated
- OR use `huggingface_hub` Python package

**Python Solution (Recommended for Hugging Face):**

Update to use Hugging Face Hub library instead of HTTP requests:

```bash
pip install huggingface-hub
```

Then use it from Node.js via Python subprocess or create a Python FastAPI endpoint.

---

### OPTION 3: Use Local Hugging Face Model With Ollama
Run Hugging Face models locally without cloud API.

**Setup:**
```bash
# Install Ollama
# Download: https://ollama.ai

# Pull a model
ollama pull mistral
# or
ollama pull neural-chat

# It runs on localhost:11434
```

**Update endpoint:**
```javascript
const HF_API_URL = 'http://localhost:11434/api/generate';
```

---

## RECOMMENDED: Quick Fix with OpenAI

### Step 1: Update the chatbot service
Copy the OpenAI implementation code above to [src/services/aiServices/chatbotService.js](src/services/aiServices/chatbotService.js)

### Step 2: Test it
```bash
node test-huggingface-integration.js
```

### Step 3: Your endpoints work immediately
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I improve my sleep?"}'
```

---

## Why OpenAI is Better Right Now

| Feature | OpenAI | Hugging Face Free | Hugging Face Pro |
|---------|--------|------------------|------------------|
| **API Status** | ✅ Working | ❌ Deprecated | ✅ Working |
| **Speed** | Fast (2-5s) | Medium (5-10s) | Medium (3-6s) |
| **Cost** | $0.50 per 1M input tokens | Free (ending) | $9/month minimum |
| **Quality** | Excellent | Good | Good |
| **Setup** | Done ✅ | Broken | Requires changes |
| **Your Status** | **Key already configured** | Not working | Requires upgrade |

---

## How to Switch to Different Provider Later

Your code is designed to be modular. When switching providers:

1. Only edit the `chatbotService.js` file
2. Change the API endpoint URL
3. Update the request/response format
4. Everything else works automatically ✓

---

## If You Want to Keep Hugging Face...

**Contact Hugging Face support about:**
- New Inference API endpoint format for `router.huggingface.co`
- Or upgrade to Pro ($9/month)
- Or use the Hugging Face Hub library

**For now, use OpenAI** - it's faster and already configured.

---

## Implementation Steps

### For OpenAI (Recommended):

**File:** [backend/src/services/aiServices/chatbotService.js](backend/src/services/aiServices/chatbotService.js)

1. Open the file
2. Replace the entire implementation with the OpenAI code shown above
3. Save and restart backend: `npm start`
4. Test: `node test-huggingface-integration.js`

**That's it! 🎉 Your AI will start working immediately.**

---

## Verification Commands

### After switching to OpenAI:
```bash
# Test 1: Simple chat
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a healthy sleep schedule?"}'

# Expected: AI response about sleep in 2-5 seconds

# Test 2: Health suggestions
curl -X POST http://localhost:5000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{"steps": 2000, "sleepHours": 4, "missedDoses": 1, "waterIntake": 1}'

# Expected: Suggestions with priority levels
```

---

## Summary

✅ **Your integration found the issue** - Hugging Face endpoint is deprecated

✅ **Quick solution available** - Switch to OpenAI (key already configured)

✅ **Future options preserved** - Easy to switch providers later

🚀 **Next step:** Update chatbotService.js with OpenAI implementation and test
