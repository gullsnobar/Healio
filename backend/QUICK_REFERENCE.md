# 📋 HEALIO AI SERVICES - QUICK REFERENCE CARD

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install
cd backend && npm install

# 2. Configure .env
echo "OPENAI_API_KEY=sk-proj-xxxxx" >> .env
echo "MONGO_URI=mongodb://127.0.0.1:27017/healio" >> .env

# 3. Run
npm run dev

# 4. Test
curl http://localhost:5000/api/ai/health
```

---

## 📡 API Endpoints (Quick Reference)

### Chatbot
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/chat` | POST | Send message to AI |
| `/api/ai/chat-context` | POST | Multi-turn conversation |
| `/api/ai/clear-history` | POST | Clear history |

### Health
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/suggestions` | POST | Generate suggestions |
| `/api/ai/health-issues` | POST | Detect problems |
| `/api/ai/health` | GET | Service status |

### Notifications
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/send-notification` | POST | Custom notification |
| `/api/ai/send-medication-reminder` | POST | Medication alert |
| `/api/ai/send-health-alert` | POST | Health warning |
| `/api/ai/send-achievement` | POST | Achievement badge |
| `/api/ai/subscribe-topic` | POST | Subscribe to topic |
| `/api/ai/unsubscribe-topic` | POST | Unsubscribe |

---

## 💬 Chat Request/Response

**Request:**
```json
POST /api/ai/chat
{
  "message": "How can I sleep better?",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Here are tips for better sleep...",
    "usage": {
      "promptTokens": 20,
      "completionTokens": 45
    }
  }
}
```

---

## 💊 Suggestions Request/Response

**Request:**
```json
POST /api/ai/suggestions
{
  "steps": 2500,
  "sleepHours": 5.5,
  "missedDoses": 1,
  "waterIntake": 1.5,
  "heartRate": 85
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 3,
    "suggestions": [
      {
        "type": "activity",
        "priority": "medium",
        "title": "🚴 Increase Activity",
        "message": "...",
        "actionItems": ["Walk 5,000 more steps"]
      }
    ]
  }
}
```

---

## 🔔 Notification Request

**Request:**
```json
POST /api/ai/send-notification
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "title": "Health Reminder",
  "body": "Time for check-in!",
  "data": {
    "type": "reminder",
    "targetScreen": "dashboard"
  }
}
```

---

## 🔐 Environment Variables

| Key | Required | Example |
|-----|----------|---------|
| OPENAI_API_KEY | ✅ | sk-proj-xxxx |
| MONGO_URI | ✅ | mongodb://localhost/healio |
| JWT_SECRET | ✅ | super-secret-key |
| PORT | ❌ | 5000 |
| NODE_ENV | ❌ | development |

---

## 🧪 Testing

### Bash
```bash
bash test-ai-endpoints.sh
```

### PowerShell
```powershell
.\test-ai-endpoints.ps1
```

### Single curl
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hi","userId":"test"}'
```

---

## 📁 File Locations

| File | Location | Purpose |
|------|----------|---------|
| Chatbot Service | `src/services/aiServices/chatbotService.js` | OpenAI integration |
| Suggestions | `src/services/aiServices/suggestionsService.js` | Rule-based AI |
| Notifications | `src/services/aiServices/notificationService.js` | Firebase FCM |
| Controller | `src/controllers/aiController.js` | API logic |
| Routes | `src/routes/aiRoutes.js` | Endpoints |
| Logger | `src/utils/aiLogger.js` | Logging |

---

## ⚙️ Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| Environment | `.env` | API keys & config |
| Main app | `src/app.js` | Express setup |
| Server | `server.js` | Entry point |
| Routes index | `src/routes/index.js` | Route mounting |

---

## 🎯 Usage Examples

### Send Chat Message
```javascript
const response = await fetch('http://localhost:5000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'How can I improve my fitness?',
    userId: 'user123'
  })
});
const data = await response.json();
```

### Get Health Suggestions
```javascript
const response = await fetch('http://localhost:5000/api/ai/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    steps: 3000,
    sleepHours: 7,
    missedDoses: 0,
    waterIntake: 2
  })
});
const data = await response.json();
```

---

## 🚨 Error Responses

```json
{
  "success": false,
  "error": "Error message here"
}
```

| Status | Error | Solution |
|--------|-------|----------|
| 400 | "Message required" | Add message field |
| 401 | "API auth failed" | Check OPENAI_API_KEY |
| 429 | "Quota exceeded" | Upgrade OpenAI plan |
| 500 | "Server error" | Check logs |

---

## 📊 Service Limits

| Service | Limit | Reset |
|---------|-------|-------|
| OpenAI | Based on plan | Monthly |
| Firebase | Free tier | Daily |
| DB | MongoDB limits | N/A |
| Rate limit | 100 req/min | Per minute |

---

## 🔍 Health Check

```bash
curl http://localhost:5000/api/ai/health

# Response:
# {
#   "success": true,
#   "message": "AI Services Health Check",
#   "services": {
#     "chatbot": "OK",
#     "suggestions": "OK",
#     "notifications": "OK"
#   }
# }
```

---

## 📚 Documentation

- **Full API Docs:** `AI_SERVICES_README.md`
- **Setup Guide:** `SETUP_CHECKLIST.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **Code Comments:** Inline in service files
- **Test Scripts:** `test-ai-endpoints.sh`, `test-ai-endpoints.ps1`

---

## 🚀 Deployment Commands

```bash
# Start server
npm run dev

# Stop server (Ctrl+C)

# Check if running
curl http://localhost:5000/health

# View logs
tail -f logs/ai-services.log

# Kill all node processes
pkill -f node
# OR on Windows
taskkill /F /IM node.exe
```

---

## 💡 Pro Tips

✅ Always test with `/api/ai/health` first  
✅ Clear history regularly to save memory  
✅ Monitor token usage in responses  
✅ Use topics for bulk notifications  
✅ Implement retry logic in frontend  
✅ Cache suggestions for repeated users  
✅ Log all API errors for debugging  

---

## ❌ Common Mistakes

❌ Forgetting to set OPENAI_API_KEY  
❌ Not clearing conversation history  
❌ Using invalid Firebase tokens  
❌ Exceeding rate limits  
❌ Not handling errors in frontend  

---

## 📞 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| API key error | Set OPENAI_API_KEY in .env |
| Connection failed | Check if server running on :5000 |
| Notification fails | Verify Firebase token format |
| High costs | Monitor token usage |
| Slow response | Check API quota |

---

**Version:** 1.0.0  
**Status:** ✅ Ready  
**Print this page for quick reference!**
