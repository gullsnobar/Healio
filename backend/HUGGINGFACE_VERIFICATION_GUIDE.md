# Hugging Face Integration - Verification Guide

## Quick Start - How to Test If It's Working

### Option 1: Automated Test (Windows)
```powershell
# Navigate to backend folder
cd backend

# Run the test script
.\test-huggingface-integration.ps1
```

### Option 2: Automated Test (Mac/Linux)
```bash
# Navigate to backend folder
cd backend

# Run the test script
node test-huggingface-integration.js
```

### Option 3: Manual Test with cURL

#### Step 1: Start your backend
```bash
cd backend
npm start
```

#### Step 2: Test the chat endpoint
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What should I eat for a healthy diet?"}'
```

**Expected Response:**
```json
{
  "success": true,
  "response": "A balanced diet should include fruits, vegetables, lean proteins, whole grains...",
  "timestamp": "2024-XX-XX..."
}
```

#### Step 3: Test health issues detection
```bash
curl -X POST http://localhost:5000/api/ai/health-issues \
  -H "Content-Type: application/json" \
  -d '{"steps": 2000, "sleepHours": 5, "missedDoses": 2, "waterIntake": 1}'
```

#### Step 4: Test suggestions endpoint
```bash
curl -X POST http://localhost:5000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{"steps": 3000, "sleepHours": 6, "missedDoses": 1, "waterIntake": 2}'
```

---

## What to Look For - Success Indicators

✅ **All Working:**
- `✅ PASSED` messages in green
- HTTP 200 status codes
- AI generating meaningful responses
- No error messages

⚠️ **Warnings (non-critical):**
- Backend not running on port 5000 (start it first)
- Response time is slow (model might be loading)

❌ **Errors (need fixing):**
- `HuggingFace_API_KEY not found` → Add key to .env
- `401 Unauthorized` → Check your API key
- `Connection Refused` → Start your backend
- `Model is loading` → Wait a few minutes

---

## Step-by-Step Verification Checklist

### Setup Check
- [ ] I have HuggingFace_API_KEY in my .env file
- [ ] Backend can read the .env file
- [ ] Node modules are installed (`npm install` done)

### Connectivity Check
- [ ] Internet connection is active
- [ ] Hugging Face servers are reachable
- [ ] No firewall blocking api-inference.huggingface.co

### API Key Check
- [ ] API key is valid (from https://huggingface.co/settings/tokens)
- [ ] API key has proper permissions
- [ ] API key is active (not revoked)

### Backend Check
- [ ] Backend server starts without errors
- [ ] All AI routes are registered
- [ ] No errors in console logs

### Integration Check
- [ ] Chat endpoint returns responses
- [ ] Health detection works
- [ ] Suggestions are generated
- [ ] No timeout errors

---

## Common Issues & Solutions

### Issue 1: "HuggingFace_API_KEY not found"
**Problem:** The .env file doesn't have the key or it's spelled wrong

**Solution:**
```bash
# 1. Open your .env file in backend folder
# 2. Find or add this line:
HuggingFace_API_KEY=hf_YourActualKeyHere

# 3. Save the file
# 4. Restart your backend server
npm start
```

### Issue 2: "401 Unauthorized" error
**Problem:** API key is invalid, expired, or incorrect

**Solution:**
1. Go to https://huggingface.co/settings/tokens
2. Login to your account
3. Check if you have an active API token
4. Create a new one if needed:
   - Click "New token"
   - Set permission to "read"
   - Copy the token
5. Replace the key in .env file
6. Restart the backend

### Issue 3: "Connection Refused" or timeout errors
**Problem:** Backend not running or Hugging Face service is down

**Solution:**
```bash
# Make sure backend is running
cd backend
npm start

# Test connectivity to Hugging Face
curl -I https://api-inference.huggingface.co/
# Should return 200 status
```

### Issue 4: "Model is loading" error
**Problem:** The Mistral-7B model is initializing (takes a few minutes on first use)

**Solution:**
- Wait 5-10 minutes
- Try the request again
- Hugging Face will cache the model after first use

### Issue 5: Very slow responses (>30 seconds)
**Problem:** Model inference is taking too long

**Causes:**
- Free tier Hugging Face account (limited speed)
- High server load
- Network latency

**Solution:**
- Upgrade to Hugging Face Pro for faster inference
- Use a faster model like DistilBERT
- Increase timeout in chatbotService.js if needed

---

## What Each Endpoint Tests

### 1. `/api/ai/chat` - Chatbot Integration
- **Tests:** Hugging Face Mistral model
- **Input:** User message about health
- **Output:** AI-generated response
- **Uses:** Hugging Face API key

### 2. `/api/ai/health-issues` - Health Detection
- **Tests:** Rule-based + AI analysis
- **Input:** Health metrics (steps, sleep, etc.)
- **Output:** List of detected health issues
- **Uses:** Backend rules + Hugging Face API

### 3. `/api/ai/suggestions` - Personalized Suggestions
- **Tests:** Smart recommendation engine
- **Input:** Daily health stats
- **Output:** Actionable health suggestions
- **Uses:** Both rule-based and AI-powered

---

## Understanding the Test Results

### If ALL tests pass ✅
```
✅ PASSED: HuggingFace_API_KEY found
✅ PASSED: Successfully connected to Hugging Face API
✅ PASSED: Health query processed successfully
✅ Chat Endpoint: 200
✅ Health Issues Detection: 200
✅ Suggestions Endpoint: 200
```
**Meaning:** Your Hugging Face integration is working perfectly!

### If you see yellow warnings ⚠️
```
⚠️  Backend not running on port 5000
⚠️  Model is loading
```
**Meaning:** Not critical. Start backend or wait a moment and retry.

### If you see red errors ❌
```
❌ FAILED: HuggingFace_API_KEY not found in .env file
❌ FAILED: Authentication Error (401)
```
**Meaning:** Fix the configuration before using the integration.

---

## Environment Variables Needed

Verify these are in your `.env` file:

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_secret_here

# Hugging Face (REQUIRED FOR AI)
HuggingFace_API_KEY=hf_YourActualKeyHere

# Other services
OPENAI_API_KEY=sk-...
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## Next Steps If Everything Works

Once your integration is verified:

1. **Use the Chat API** in your frontend:
   ```javascript
   const response = await fetch('http://localhost:5000/api/ai/chat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message: 'How can I sleep better?' })
   });
   const data = await response.json();
   console.log(data.response); // AI response
   ```

2. **Test from Frontend** - Create a health dashboard component that calls these endpoints

3. **Monitor Logs** - Check backend logs for any issues:
   ```bash
   # Backend output shows all API calls
   📝 [Chatbot] User unknown sent message: "What should I eat..."
   ✅ [Chatbot] Response generated in 2.5s
   ```

4. **Add Error Handling** - Implement retry logic and fallbacks for when API is slow

---

## Quick Reference Commands

```bash
# Run the automated test
node test-huggingface-integration.js

# Test a single endpoint (Windows)
curl -X POST http://localhost:5000/api/ai/chat -H "Content-Type: application/json" -d "{\"message\": \"Hello\"}"

# View backend logs in real-time
npm start

# Check if backend is running
netstat -ano | findstr :5000  (Windows)
lsof -i :5000  (Mac/Linux)

# Restart backend
npm start  (Stop with Ctrl+C then run again)
```

---

## Need Help?

If tests are still failing:

1. **Check the error message** - Read the red error text carefully
2. **Look at backend logs** - Run `npm start` and watch console
3. **Verify API key** - https://huggingface.co/settings/tokens
4. **Test internet** - Make sure you're connected
5. **Check firewall** - Allow connections to api-inference.huggingface.co
6. **Restart everything** - Stop backend and database, start again

---

**Your Hugging Face integration should be ready to use! 🚀**
