# HEALIO AI System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites
- Node.js v14+ installed
- Backend running on port 5000
- `HF_API_KEY` set in `.env`

### 2. Start Backend
```bash
cd backend
npm install
npm start
# Server running on http://localhost:5000
```

### 3. Verify AI Services
```bash
# Check if all AI services are healthy
curl http://localhost:5000/api/ai/health
```

Response should show:
```json
{
  "success": true,
  "services": {
    "chatbot": "OK",
    "speechToText": "OK",
    "imageAnalysis": "OK",
    "suggestions": "OK",
    "notifications": "OK"
  }
}
```

---

## 💬 Quick Examples

### Chat with Health Assistant
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache, what should I do?",
    "userId": "user-123"
  }'
```

### Convert Audio to Text
```bash
curl -X POST http://localhost:5000/api/ai/transcribe-audio \
  -F "audio=@myrecording.mp3" \
  -F "userId=user-123"
```

### Analyze Medicine Image
```bash
curl -X POST http://localhost:5000/api/ai/analyze-medicine-image \
  -F "image=@medicine.jpg" \
  -F "userId=user-123"
```

### Get Health Suggestions
```bash
curl -X POST http://localhost:5000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "steps": 5000,
    "sleepHours": 6,
    "missedDoses": 1,
    "waterIntake": 2,
    "heartRate": 75
  }'
```

### Send Notification
```bash
curl -X POST http://localhost:5000/api/ai/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "your-fcm-token",
    "title": "Medication Reminder",
    "body": "Take your medicine now"
  }'
```

---

## 📱 Frontend Integration Examples

### React Native Example (Chatbot)
```javascript
// Send message to chatbot
const response = await fetch('http://localhost:5000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    userId: currentUserId
  })
});

const data = await response.json();
console.log(data.data.message); // AI response
```

### React Native Example (Speech-to-Text)
```javascript
// Transcribe audio file
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('userId', currentUserId);

const response = await fetch('http://localhost:5000/api/ai/transcribe-audio', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.data.text); // Transcribed text
```

### React Native Example (Image Analysis)
```javascript
// Analyze medicine image
const formData = new FormData();
formData.append('image', imageFile);
formData.append('userId', currentUserId);

const response = await fetch('http://localhost:5000/api/ai/analyze-medicine-image', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.data.caption);      // Image caption
console.log(data.data.suggestions);  // Health suggestions
```

---

## 🔍 Testing

### Run Complete Test Suite
```bash
cd backend

# Node.js test suite
node test-ai-endpoints.js

# PowerShell test suite (Windows)
.\test-ai-endpoints.ps1
```

Test coverage:
- ✅ Chatbot (single-turn + multi-turn)
- ✅ Health suggestions
- ✅ Health issue detection
- ✅ All notifications
- ✅ Topic subscriptions
- ✅ File upload endpoints

---

## 📊 API Endpoints Summary

| Feature | POST Endpoint | Purpose |
|---------|---------------|---------|
| **Chatbot** | `/api/ai/chat` | Chat with AI |
| | `/api/ai/chat-context` | Multi-turn chat |
| | `/api/ai/clear-history` | Clear chat history |
| **Audio** | `/api/ai/transcribe-audio` | Speech-to-Text |
| **Image** | `/api/ai/analyze-medicine-image` | Image analysis |
| **Health** | `/api/ai/suggestions` | Get suggestions |
| | `/api/ai/health-issues` | Detect issues |
| **Notifications** | `/api/ai/send-notification` | Send notification |
| | `/api/ai/send-medication-reminder` | Medication alert |
| | `/api/ai/send-health-alert` | Health alert |
| | `/api/ai/send-achievement` | Achievement badge |
| | `/api/ai/subscribe-topic` | Subscribe to topic |
| | `/api/ai/unsubscribe-topic` | Unsubscribe |
| **Health** | `GET /api/ai/health` | Check services |

---

## 🛠️ Troubleshooting

### Issue: "API Key not configured"
```bash
# Check if HF_API_KEY is set
echo $HF_API_KEY  # Linux/Mac
echo %HF_API_KEY% # Windows

# Set API Key in .env file
HF_API_KEY=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
```

### Issue: "Audio file too large"
- Maximum file size: 50MB
- Use MP3 compression to reduce size
- Or upload shorter clips

### Issue: "Image not recognized"
- Ensure file is .jpg, .png, .gif, or .webp
- Maximum file size: 10MB
- Try with different angle/lighting

### Issue: Notification not received
- Verify FCM device token is valid
- Check Firebase configuration
- Ensure device has internet connection

---

## 📚 Documentation

- **Full API Reference**: [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md)
- **Implementation Details**: [AI_SYSTEM_IMPLEMENTATION_SUMMARY.md](./AI_SYSTEM_IMPLEMENTATION_SUMMARY.md)
- **Tests**: [test-ai-endpoints.js](./test-ai-endpoints.js)

---

## 🎯 Next Steps

1. **Integrate Frontend**: Use the React Native examples above
2. **Add Database**: Persist conversations to MongoDB
3. **Custom Training**: Fine-tune Mistral for better health responses
4. **Analytics**: Track AI service usage
5. **Scale**: Use Redis for caching

---

## 📝 Common Questions

**Q: Can I use this offline?**
A: No, AI models require internet connection. For offline, see `AI_SYSTEM_IMPLEMENTATION_SUMMARY.md` for future plans.

**Q: How long do conversations persist?**
A: Currently in-memory (lost on server restart). For persistence, see database integration plans.

**Q: Can I change the AI model?**
A: Yes! Edit `HF_API_URL` in `src/services/aiServices/chatbotService.js` to use different Hugging Face models.

**Q: What's the response time?**
A: Typically 1-5 seconds depending on model and network. Longer audio/images may take 10-30 seconds.

**Q: Is it production-ready?**
A: Yes! See deployment checklist in `AI_SYSTEM_IMPLEMENTATION_SUMMARY.md`.

---

## 🔐 Security Best Practices

1. **Never commit API keys** - Use `.env` files
2. **Validate file uploads** - Already done in middleware
3. **Rate limit endpoints** - Add `express-rate-limit`
4. **Use HTTPS in production** - Configure reverse proxy
5. **Monitor logs** - Check `backend/logs/` for issues

---

## 📞 Getting Help

1. Check [AI_INTEGRATION_GUIDE.md](./AI_INTEGRATION_GUIDE.md) for detailed docs
2. Run tests: `node test-ai-endpoints.js`
3. Review logs: `backend/logs/ai-services-*.log`
4. Check `.env` configuration

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] `GET /api/ai/health` returns OK
- [ ] Chat endpoint responds in < 5 seconds
- [ ] File uploads work with correct size limits
- [ ] Notifications can be sent
- [ ] Test suite passes: `node test-ai-endpoints.js`

Once all items are checked, AI system is ready for integration! 🎉

---

Generated: January 2024 | Status: ✅ COMPLETE
