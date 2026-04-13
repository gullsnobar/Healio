# HEALIO AI System - Troubleshooting Guide

## Common Issues & Solutions

### 1. Backend Startup Issues

#### Problem: "HF_API_KEY is not defined"
```
Error: Hugging Face API key not configured
Status: 503 Service Unavailable
```

**Solution**:
1. Check if `.env` file exists in `backend/` directory
2. Add or verify API key:
   ```env
   HF_API_KEY=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
   ```
3. Restart backend: `npm start`
4. Verify: `curl http://localhost:5000/api/ai/health`

**Verification**:
```bash
# Check if key is set
echo $HF_API_KEY  # Linux/Mac
echo %HF_API_KEY% # Windows

# Test API connection
curl -H "Authorization: Bearer $HF_API_KEY" \
  https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2 \
  -X POST -d '{"inputs":"test"}'
```

---

#### Problem: "Port 5000 already in use"
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Find process using port 5000
# Linux/Mac:
lsof -i :5000

# Windows:
netstat -ano | findstr :5000

# Kill process (get PID from above)
# Linux/Mac:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F

# Start backend on different port:
PORT=5001 npm start
```

---

#### Problem: "Cannot find module 'multer'"
```
Error: Cannot find module 'multer'
```

**Solution**:
```bash
cd backend
npm install multer uuid
npm start
```

---

### 2. API Request Issues

#### Problem: "404 Not Found"
```json
{
  "success": false,
  "message": "Route not found"
}
```

**Solution**:
1. Verify endpoint URL correct (check spelling)
2. Check HTTP method (POST vs GET)
3. Verify backend is running on port 5000
4. Example endpoints:
   ```
   GET  http://localhost:5000/api/ai/health
   POST http://localhost:5000/api/ai/chat
   POST http://localhost:5000/api/ai/chat-context
   POST http://localhost:5000/api/ai/transcribe-audio
   POST http://localhost:5000/api/ai/analyze-medicine-image
   ```

---

#### Problem: "CORS Error"
```
Access to XMLHttpRequest at 'http://localhost:5000/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:
1. CORS is already configured in backend
2. Check if frontend is making requests correctly:
   ```javascript
   // ✅ Correct
   const response = await fetch('http://localhost:5000/api/ai/chat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message: 'Hello', userId: 'user-1' })
   });

   // ❌ Wrong - missing method
   const response = await fetch('http://localhost:5000/api/ai/chat', {
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ message: 'Hello' })
   });
   ```

---

### 3. Chatbot Issues

#### Problem: "No response from chatbot"
```json
{
  "success": true,
  "message": "I'm thinking... Could you rephrase your question?"
}
```

**Solution**:
- Model may be loading (first request takes 30+ seconds)
- Wait and retry
- Check API key is valid
- Message may be too long (max 2000 characters)
- Try simpler message: "Hello"

---

#### Problem: "Conversation history not persisting"
```
Message 1: "What is diabetes?"
Message 2: "Tell me more" → No context from message 1
```

**Solution**:
1. Use `/chat-context` endpoint (not `/chat`)
2. Always include `userId` parameter
3. Same user ID for conversation continuity
4. Remember: History is lost on server restart (database needed for persistence)

**Test with same userId**:
```bash
# Message 1
curl -X POST http://localhost:5000/api/ai/chat-context \
  -H "Content-Type: application/json" \
  -d '{"message":"What is diabetes?","userId":"user-123"}'

# Message 2 (with same userId)
curl -X POST http://localhost:5000/api/ai/chat-context \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me more","userId":"user-123"}'
```

---

### 4. File Upload Issues

#### Problem: "413 Payload Too Large"
```json
{
  "success": false,
  "error": "File exceeds size limit"
}
```

**Solution**:
- Audio files: Max 50MB
- Image files: Max 10MB
- Try compressing:
  ```bash
  # Audio (MP3 compression)
  ffmpeg -i input.wav -acodec libmp3lame -ab 128k output.mp3

  # Image (PNG/JPEG compression)
  convert input.jpg -quality 85 output.jpg
  ```

---

#### Problem: "Unsupported audio/image format"
```json
{
  "success": false,
  "error": "Unsupported audio format. Use MP3, WAV, M4A, FLAC or OGG."
}
```

**Solution**:
- **Audio**: Convert to MP3, WAV, M4A, FLAC, or OGG
- **Images**: Use JPEG, PNG, GIF, or WebP

**Conversion examples**:
```bash
# Audio: Convert WAV to MP3
ffmpeg -i audio.wav -acodec libmp3lame -ab 192k audio.mp3

# Image: Convert to PNG
convert image.bmp image.png

# Image: Compress PNG to reduce size
convert image.png -strip -quality 85 image-compressed.png
```

---

#### Problem: "File not found on server"
```json
{
  "success": false,
  "error": "Audio file not found"
}
```

**Solution**:
1. Verify upload actually succeeded
2. Check browser developer console for upload errors
3. Verify `uploads/` directory exists
4. Check file permissions:
   ```bash
   # Linux/Mac
   chmod 755 backend/uploads/audio
   chmod 755 backend/uploads/images

   # Verify
   ls -la backend/uploads/
   ```

---

### 5. Speech-to-Text Issues

#### Problem: "No speech detected"
```json
{
  "success": false,
  "error": "No speech detected in audio file"
}
```

**Solution**:
1. Audio file may have no voice/silence
2. Try different audio file
3. Increase audio volume before uploading
4. Ensure audio quality is good

---

#### Problem: "Timeout during transcription"
```json
{
  "success": false,
  "error": "Speech processing took too long. Try a shorter audio file."
}
```

**Solution**:
- Audio too long (> 10 minutes)
- Network connection slow
- Hugging Face API busy
- Try shorter audio file (< 5 minutes)
- Retry after waiting

---

### 6. Image Analysis Issues

#### Problem: "Image not recognized as medicine"
```json
{
  "success": true,
  "caption": "A picture of a sunset",
  "suggestions": [
    {
      "type": "general",
      "message": "Maintain a healthy lifestyle..."
    }
  ]
}
```

**Solution**:
- Image must contain medicine/pills
- Try different angle/lighting
- Ensure image is clear and well-lit
- Try: Medicine bottles, pill packs, capsules

---

#### Problem: "Image analysis very slow"
```
Waiting 30+ seconds for response...
```

**Solution**:
- Model is loading for first request (normal)
- Subsequent requests are faster
- Large images take longer (> 5MB)
- Compress image if possible

---

### 7. Health Suggestions Issues

#### Problem: "Invalid health data"
```json
{
  "success": false,
  "error": "User data is required"
}
```

**Solution**:
- Ensure all required fields are provided:
  ```javascript
  {
    "steps": 5000,           // number
    "sleepHours": 7,         // number
    "missedDoses": 0,        // number
    "waterIntake": 2.5,      // number (in liters)
    "heartRate": 75,         // number (in bpm)
    "userId": "user-123"     // string (optional)
  }
  ```

---

#### Problem: "Health score seems wrong"
```json
{
  "healthScore": 25,  // Too low?
  "suggestions": [...]
}
```

**Solution**:
- Health score calculation based on:
  - Steps: < 5000 = low, 5000-10000 = medium, > 10000 = high
  - Sleep: < 6 hours = low, 6-8 = medium, > 8 = high
  - Medications: > 2 missed = low
  - Water: < 2L = low, 2-3L = medium, > 3L = high
  - Heart rate: > 100 bpm = low
- Check if data inputs are realistic

---

### 8. Notification Issues

#### Problem: "Notification failed to send"
```json
{
  "success": false,
  "error": "Device token invalid or Firebase not configured"
}
```

**Solution**:
1. Verify Firebase is configured:
   ```env
   FIREBASE_PROJECT_ID=healio-bba24
   FIREBASE_PRIVATE_KEY=...
   FIREBASE_CLIENT_EMAIL=...
   ```
2. Get valid FCM device token from mobile app
3. Ensure device has Firebase Cloud Messaging enabled
4. Test with valid token:
   ```bash
   curl -X POST http://localhost:5000/api/ai/send-notification \
     -H "Content-Type: application/json" \
     -d '{
       "deviceToken": "valid-fcm-token",
       "title": "Test",
       "body": "Test notification"
     }'
   ```

---

#### Problem: "Notification received but not displayed"
```
Notification sent but not shown on device
```

**Solution**:
1. Check mobile app notification permissions
2. Verify app has notification access
3. Check device notification settings
4. Ensure app is subscribed to topics (if using topic-based)
5. Check notification sound/vibration settings

---

#### Problem: "Topic subscription not working"
```json
{
  "success": false,
  "error": "Subscription failed"
}
```

**Solution**:
1. Ensure device token is valid
2. Topic name must be lowercase and hyphenated:
   - ✅ `medication-reminders`
   - ✅ `health-alerts`
   - ❌ `Medication Reminders`
   - ❌ `MedicationReminders`
3. Verify FCM is initialized correctly

---

### 9. Logging Issues

#### Problem: "No logs being generated"
```
backend/logs/ directory is empty
```

**Solution**:
1. Check if logs directory exists:
   ```bash
   ls -la backend/logs/
   # If missing:
   mkdir -p backend/logs
   chmod 755 backend/logs
   ```
2. Check file permissions
3. Use test API to generate logs:
   ```bash
   curl -X POST http://localhost:5000/api/ai/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test","userId":"test-user"}'
   ```
4. Check log file:
   ```bash
   tail -f backend/logs/ai-services-$(date +%Y-%m-%d).log
   ```

---

#### Problem: "Logs are too verbose"
```
Millions of log entries
```

**Solution**:
1. Implement log rotation (recommended)
2. Adjust log level in `src/utils/aiLogger.js`
3. Filter logs by service:
   ```bash
   tail -f backend/logs/ai-services-*.log | grep "[Error]"
   ```

---

### 10. Performance Issues

#### Problem: "API responses very slow"
```
Chatbot takes > 10 seconds
```

**Solution**:
1. **First request**: Model loads (30+ seconds normal)
2. **Subsequent requests**: Should be faster
3. **Check network**: Poor internet connection?
4. **Check server**: CPU/memory usage high?
   ```bash
   # Monitor CPU/memory
   top  # Linux/Mac
   tasklist  # Windows
   ```
5. **Implement caching**:
   - Cache frequent questions
   - Use Redis for performance

---

#### Problem: "File uploads slow"
```
10MB image takes > 30 seconds to upload
```

**Solution**:
1. File size too large - compress before upload
2. Network bandwidth limited
3. Server processing slow
4. Try chunked uploads for large files

---

### 11. Testing Issues

#### Problem: "Test suite fails"
```
Failed: POST /chat - timeout
```

**Solution**:
1. Verify backend is running:
   ```bash
   curl http://localhost:5000/api/ai/health
   ```
2. Increase timeout in test file:
   ```javascript
   // In test-ai-endpoints.js
   timeout: 60000  // 60 seconds instead of 30
   ```
3. Run test slowly:
   ```bash
   # Add delays between tests
   node test-ai-endpoints.js --slow
   ```

---

### 12. Frontend Integration Issues

#### Problem: "Response parsing error"
```javascript
// Error: Cannot read property 'data' of undefined
response.body.data.message
```

**Solution**:
1. Check API response format:
   ```javascript
   // ✅ Correct response structure
   {
     "success": true,
     "data": {
       "message": "AI response",
       "model": "mistral-7b"
     }
   }
   ```
2. Always verify response structure:
   ```javascript
   if (response.body?.data?.message) {
     console.log(response.body.data.message);
   } else {
     console.log("Unexpected response format");
   }
   ```

---

#### Problem: "TypeScript compilation error"
```
Property 'data' does not exist on type 'Response'
```

**Solution**:
```typescript
// Add proper types
interface AIResponse {
  success: boolean;
  data: {
    message: string;
    model?: string;
    [key: string]: any;
  };
  error?: string;
}

const response = await fetch(...) as AIResponse;
```

---

### 13. Database Integration Issues

#### Problem: "Conversations not persisting"
```
After server restart, all conversations lost
```

**Solution** (Future Enhancement):
- Currently using in-memory storage
- To persist conversations:
  1. Add MongoDB model: `ConversationHistory`
  2. Modify `chatbotService.js` to save to DB
  3. Load history on conversation start
  4. See `AI_SYSTEM_IMPLEMENTATION_SUMMARY.md` for plans

---

### 14. Security Issues

#### Problem: "API key exposed in frontend code"
```javascript
// ❌ WRONG - Never do this!
const API_KEY = "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";
```

**Solution**:
1. Always keep API keys in backend `.env` only
2. Frontend calls backend endpoints only
3. Backend makes calls to Hugging Face with key
4. Never expose API keys in client-side code

---

#### Problem: "Large files causing memory issues"
```
Out of memory error when processing large file
```

**Solution**:
1. Implement stream-based processing
2. Add file size validation at upload
3. Process files in chunks
4. Increase Node.js memory (if necessary):
   ```bash
   node --max-old-space-size=4096 server.js
   ```

---

## General Debugging Steps

### 1. Enable Debug Logging
```bash
# Set debug environment variable
DEBUG=* npm start

# Or increase log verbosity in aiLogger.js
```

### 2. Check Error Messages
- Read full error message (not just first line)
- Check HTTP status code (400, 401, 413, 500, etc.)
- Look for specific error details in response body

### 3. Use Browser DevTools
```javascript
// Log full response for inspection
console.log('Full Response:', JSON.stringify(response, null, 2));

// Check request details
console.log('Request URL:', url);
console.log('Request Headers:', headers);
console.log('Request Body:', body);
```

### 4. Test with cURL First
```bash
# Test endpoint in isolation
curl -v -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# -v flag shows all details (request headers, response headers, etc.)
```

### 5. Check Server Logs
```bash
# View real-time logs
tail -f backend/logs/ai-services-*.log

# Search for errors
grep "ERROR\|Error\|error" backend/logs/ai-services-*.log

# View last 50 lines
tail -50 backend/logs/ai-services-*.log
```

---

## Quick Reference: HTTP Status Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | Everything working ✅ |
| 400 | Bad Request | Check request format (missing fields?) |
| 401 | Unauthorized | Check API key or auth token |
| 404 | Not Found | Check URL spelling/method |
| 413 | Payload Too Large | Reduce file size |
| 500 | Server Error | Check server logs |
| 503 | Service Unavailable | Check API keys, restart server |

---

## Support Resources

1. **Documentation**: 
   - [AI_QUICK_START.md](./AI_QUICK_START.md)
   - [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)

2. **Testing**:
   - `node test-ai-endpoints.js`
   - `.\test-ai-endpoints.ps1` (Windows)

3. **Logs**:
   - `backend/logs/ai-services-YYYY-MM-DD.log`

4. **API Key**:
   - Hugging Face: https://huggingface.co/settings/tokens

5. **Services Status**:
   - Hugging Face API: https://status.huggingface.co/
   - Firebase: https://status.firebase.google.com/

---

## Report Issues

If you encounter issues not listed here:
1. Check logs in `backend/logs/`
2. Verify environment variables
3. Run test suite
4. Review error message carefully
5. Restart backend and try again

For persistent issues, provide:
- Error message (full text)
- API endpoint called
- Request body (without API keys)
- Response body
- Backend logs (relevant lines)
- Backend version/Node.js version

---

Last Updated: January 2024
Version: 1.0
Status: Complete Troubleshooting Guide
