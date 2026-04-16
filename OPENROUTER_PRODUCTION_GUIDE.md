# 🚀 OpenRouter Integration - Production Ready Guide

**Date:** April 15, 2026  
**Status:** ✅ Enhanced + Production Ready  
**Based on:** [OpenRouter Official Documentation](https://openrouter.ai/docs/quickstart)

---

## 📊 What's Been Implemented

### ✅ Backend Enhancements

#### 1. **App Attribution Headers**
Your app now includes optional headers for OpenRouter leaderboard rankings:
```js
headers: {
  "HTTP-Referer": "http://localhost:3000",           // Your app URL
  "X-OpenRouter-Title": "Healio Health Assistant",   // Your app name
}
```

**Benefits:**
- ✅ Appears on OpenRouter leaderboards
- ✅ Helps OpenRouter track usage patterns
- ✅ Community visibility

#### 2. **Advanced Model Parameters**
```js
{
  temperature: 0.7,      // Balanced creativity (0-2)
  top_p: 0.95,           // Nucleus sampling
  top_k: 40,             // Top-k sampling
  max_tokens: 500,       // Response length
}
```

**Benefits:**
- ✅ Better quality responses
- ✅ Consistent for health queries
- ✅ Balances creativity with accuracy

#### 3. **Model Selection Endpoint**
New `/chat/models` GET endpoint returns available models:

```json
{
  "free": [
    {
      "id": "meta-llama/llama-3-8b-instruct",
      "name": "Llama 3 8B (Recommended)",
      "description": "Fast, free, and reliable",
      "type": "free"
    }
  ],
  "premium": [
    {
      "id": "openai/gpt-4",
      "name": "GPT-4",
      "description": "Most capable model (paid)",
      "type": "premium"
    }
  ]
}
```

#### 4. **Enhanced Error Handling**
Specific error messages for different scenarios:
- ❌ 401: Invalid API key
- ❌ 429: Rate limited
- ❌ 400: Invalid input
- ❌ 503: Service unavailable
- ❌ 500: Server error

#### 5. **Detailed Logging**
Development-friendly logging:
```
✅ Chat response generated (245 chars)
✅ OPENROUTER_API_KEY: ✓ SET
❌ OpenRouter API Error: {...}
```

---

## 🎯 API Endpoints

### `/chat/models` - List Models
**Method:** `GET`  
**Response:**
```json
{
  "free": [...],
  "premium": [...]
}
```

### `/chat` - Send Message
**Method:** `POST`  
**Body:**
```json
{
  "message": "What's a healthy heart rate?",
  "model": "meta-llama/llama-3-8b-instruct"  // Optional
}
```

**Response:**
```json
{
  "reply": "A healthy resting heart rate...",
  "model": "meta-llama/llama-3-8b-instruct",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 87,
    "total_tokens": 102
  }
}
```

---

## 🔧 Available Models

### 🆓 Free Models (No Cost)
These models run without consuming credits:

```js
"meta-llama/llama-3-8b-instruct"  // ⭐ Recommended - Fast & Good
"meta-llama/llama-2-7b-chat"      // Alternative fast option
```

**Characteristics:**
- ✅ No cost
- ✅ Fast responses
- ✅ Good for health queries
- ✅ Open source

### 💰 Premium Models (Paid)
Higher quality but requires credits:

```js
"openai/gpt-4"           // Most capable
"openai/gpt-3.5-turbo"   // Fast & affordable
"anthropic/claude-3-opus" // Excellent reasoning
```

**Cost:**
- Check: https://openrouter.ai/prices
- Free trial credits available

---

## 📝 Environment Variables

Required in `.env`:
```env
OPENROUTER_API_KEY=sk-or-v1-...        # Your API key from openrouter.ai
APP_URL=http://localhost:3000          # Optional: Your app URL
```

---

## 🚀 Testing the Integration

### Test 1: Basic Chat
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

**Expected Response (200):**
```json
{
  "reply": "I'm just a language model...",
  "model": "meta-llama/llama-3-8b-instruct",
  "usage": {...}
}
```

### Test 2: List Models
```bash
curl http://localhost:5000/chat/models
```

### Test 3: Use Specific Model
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "model": "meta-llama/llama-2-7b-chat"
  }'
```

### Test 4: Error Handling
```bash
# Missing message (400)
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{}'

# Invalid API key (503)
# Set invalid OPENROUTER_API_KEY and try a request
```

---

## 💡 Frontend Usage

### Load Available Models
```js
const fetchModels = async () => {
  try {
    const response = await fetch('http://localhost:5000/chat/models');
    const { free, premium } = await response.json();
    setAvailableModels({ free, premium });
  } catch (error) {
    console.error('Failed to load models:', error);
  }
};
```

### Send Message with Model Selection
```js
const sendMessage = async (text, selectedModel) => {
  const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: text,
      model: selectedModel || "meta-llama/llama-3-8b-instruct"
    })
  });
  
  const data = await response.json();
  console.log(`Tokens used: ${data.usage.total_tokens}`);
  return data.reply;
};
```

---

## 🎨 Optional Frontend Enhancements

### Add Model Selector to Chat UI
```jsx
import { openRouterAPI } from './services/api/openRouterAPI';

export const ModelSelector = ({ onModelChange }) => {
  const [models, setModels] = useState(null);

  useEffect(() => {
    openRouterAPI.getAvailableModels()
      .then(res => setModels(res.data))
      .catch(err => console.error('Failed to load models:', err));
  }, []);

  if (!models) return null;

  return (
    <select onChange={(e) => onModelChange(e.target.value)}>
      {models.free.map(m => (
        <option key={m.id} value={m.id}>
          {m.name} (Free)
        </option>
      ))}
      <optgroup label="Premium (Paid)">
        {models.premium.map(m => (
          <option key={m.id} value={m.id}>
            {m.name} (Paid)
          </option>
        ))}
      </optgroup>
    </select>
  );
};
```

---

## 📊 Best Practices

### ✅ DO
- ✅ Use free models for development
- ✅ Set temperature appropriate for your use case
- ✅ Include app attribution headers
- ✅ Handle errors gracefully
- ✅ Validate user input
- ✅ Log important events
- ✅ Monitor token usage

### ❌ DON'T
- ❌ Expose API key in frontend code
- ❌ Use invalid model names
- ❌ Send empty messages
- ❌ Ignore rate limits
- ❌ Forget to set max_tokens
- ❌ Skip error handling

---

## 🔒 Security Checklist

- [x] API key in `.env` (never committed)
- [x] API key validated in backend
- [x] Input validation (message, model)
- [x] Error messages don't leak secrets
- [x] CORS properly configured
- [x] Rate limiter enabled
- [x] Development mode error details hidden

---

## 📈 Monitoring & Debugging

### Enable Detailed Logging
Set environment variable:
```bash
NODE_ENV=development  # Shows error details
NODE_ENV=production   # Hides error details
```

### View Logs
```bash
# All logs with grep
npm start | grep "✅\|❌"

# Just errors
npm start | grep "❌"
```

### Check API Status
```bash
curl http://localhost:5000/health
# Response: { "status": "OK", "timestamp": "..." }
```

---

## 🆘 Troubleshooting

### Problem: "Invalid API key"
**Solution:**
1. Get key from: https://openrouter.ai
2. Update `.env`: `OPENROUTER_API_KEY=sk-or-v1-...`
3. Restart backend: `npm start`

### Problem: "Rate limited (429)"
**Solution:**
- Default free rate limit: ~20 requests/minute
- Upgrade account or wait for rate limit reset
- For production: contact OpenRouter

### Problem: "Model not found"
**Solution:**
- Check available models: GET `/chat/models`
- Use a name from the list
- Free models: `meta-llama/llama-3-8b-instruct`

### Problem: No response / Timeout
**Solution:**
- Check backend is running: http://localhost:5000/health
- Check API key is valid
- Check OpenRouter status: https://status.openrouter.ai

---

## 📚 Additional Resources

- **Official Docs:** https://openrouter.ai/docs
- **API Reference:** https://openrouter.ai/docs/api/reference
- **Pricing:** https://openrouter.ai/prices
- **Status:** https://status.openrouter.ai
- **Community:** https://openrouter.ai/discord

---

## ✅ Pre-Launch Checklist

Before going to production:

- [x] API key configured
- [x] Error handling implemented
- [x] Input validation added
- [x] Logging configured
- [x] Rate limiter enabled
- [x] CORS configured
- [x] Tests passing
- [x] Documentation complete
- [x] Security reviewed
- [x] Performance tested

---

## 🎉 Summary

Your OpenRouter integration is now:
- ✅ **Production Ready** - Full error handling
- ✅ **Secure** - Validated inputs, protected key
- ✅ **Well-Documented** - Complete API docs
- ✅ **Best Practices** - Following official guidelines
- ✅ **Scalable** - Model selection support
- ✅ **Monitored** - Detailed logging
- ✅ **Flexible** - Free and premium models

**Ready for production deployment!** 🚀

---

Generated: April 15, 2026
