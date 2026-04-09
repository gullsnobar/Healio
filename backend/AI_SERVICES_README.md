# 🤖 HEALIO AI SERVICES DOCUMENTATION

Complete production-ready AI module system for HEALIO FYP project.

## 📋 Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [API Endpoints](#api-endpoints)
5. [Usage Examples](#usage-examples)
6. [Environment Variables](#environment-variables)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

---

## ✨ Features

### 1. **AI Chatbot (NLP)**
- Uses OpenAI GPT-4o-mini model
- Single-turn and multi-turn conversations
- Conversation history management
- Health-focused responses

### 2. **Smart Suggestions Engine (Rule-Based AI)**
- Analyzes user health data (steps, sleep, medication, hydration)
- Generates personalized suggestions
- Priority-based recommendations (Critical, High, Medium, Low)
- Health issue detection and alerts

### 3. **Push Notifications (Firebase Cloud Messaging)**
- Send custom notifications
- Medication reminders
- Health alerts
- Achievement notifications
- Topic-based broadcasting
- Device subscription management

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── services/
│   │   └── aiServices/
│   │       ├── chatbotService.js        # OpenAI integration
│   │       ├── suggestionsService.js    # Rule-based suggestions
│   │       └── notificationService.js   # Firebase notifications
│   ├── controllers/
│   │   └── aiController.js              # API logic
│   ├── routes/
│   │   └── aiRoutes.js                  # AI endpoints
│   ├── utils/
│   │   └── aiLogger.js                  # Logging utility
│   ├── app.js                           # Express app
│   └── server.js                        # Entry point
├── .env                                 # Configuration
└── package.json                         # Dependencies
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install openai firebase-admin dotenv
```

### 2. Configure Environment Variables

Create/update `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxx...your-key...xxx

# MongoDB
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/healio

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=30m
JWT_REFRESH_EXPIRE=7d

# Firebase (optional - only if using FCM)
FIREBASE_SERVICE_ACCOUNT_PATH=./config/healio-bba24-firebase-adminsdk.json

# Server
PORT=5000
NODE_ENV=development
```

### 3. Verify Installation

```bash
# Test backend starts
npm run dev

# Test OpenAI connection
curl http://localhost:5000/test-openai

# Expected response:
# {
#   "success": true,
#   "reply": "Hello!"
# }
```

---

## 📡 API Endpoints

### **CHATBOT ENDPOINTS**

#### 1. **POST /api/ai/chat**
Send message to health assistant

**Request:**
```json
{
  "message": "How can I improve my sleep?",
  "userId": "user123"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Better sleep tips: maintain a consistent schedule, avoid screens 1 hour before bed...",
    "usage": {
      "promptTokens": 20,
      "completionTokens": 45,
      "totalTokens": 65
    }
  }
}
```

---

#### 2. **POST /api/ai/chat-context**
Multi-turn conversation with history

**Request:**
```json
{
  "userId": "user123",
  "message": "What about exercise?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Exercise helps sleep quality...",
    "conversationLength": 4
  }
}
```

---

#### 3. **POST /api/ai/clear-history**
Clear conversation history

**Request:**
```json
{
  "userId": "user123"
}
```

---

### **SUGGESTIONS ENDPOINTS**

#### 4. **POST /api/ai/suggestions**
Generate personalized health suggestions

**Request:**
```json
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
    "total": 4,
    "suggestions": [
      {
        "type": "activity",
        "priority": "medium",
        "title": "🚴 Increase Activity",
        "message": "You're below the recommended 10,000 steps...",
        "actionItems": ["Aim for 5,000 more steps", "Do 20-minute exercise"]
      },
      {
        "type": "sleep",
        "priority": "high",
        "title": "🌙 Insufficient Sleep",
        "message": "You need more sleep...",
        "actionItems": ["Go to bed 30 minutes earlier"]
      }
    ]
  }
}
```

---

#### 5. **POST /api/ai/health-issues**
Detect critical health issues

**Request:**
```json
{
  "steps": 500,
  "sleepHours": 3,
  "missedDoses": 4,
  "waterIntake": 0.8
}
```

**Response:**
```json
{
  "success": true,
  "alertCount": 4,
  "alerts": [
    {
      "type": "ACTIVITY_ALERT",
      "severity": "HIGH",
      "message": "Low activity detected - Please move around"
    },
    {
      "type": "SLEEP_ALERT",
      "severity": "CRITICAL",
      "message": "Severe sleep deprivation detected"
    }
  ]
}
```

---

### **NOTIFICATION ENDPOINTS**

#### 6. **POST /api/ai/send-notification**
Send custom push notification

**Request:**
```json
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "title": "Health Reminder",
  "body": "Time for your daily check-in!",
  "data": {
    "type": "reminder",
    "targetScreen": "health_dashboard"
  }
}
```

---

#### 7. **POST /api/ai/send-medication-reminder**
Send medication reminder

**Request:**
```json
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "medicationName": "Aspirin",
  "medicationId": "med_123",
  "dosage": "500mg"
}
```

---

#### 8. **POST /api/ai/send-health-alert**
Send health alert

**Request:**
```json
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "message": "Your heart rate is elevated - Please rest",
  "type": "HEART_RATE_ALERT",
  "severity": "HIGH"
}
```

---

#### 9. **POST /api/ai/send-achievement**
Send achievement notification

**Request:**
```json
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "message": "You reached 10,000 steps today!",
  "achievementId": "achievement_steps_10k"
}
```

---

### **TOPIC MANAGEMENT ENDPOINTS**

#### 10. **POST /api/ai/subscribe-topic**
Subscribe device to FCM topic (for bulk notifications)

**Request:**
```json
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "topic": "medication_reminders"
}
```

---

#### 11. **POST /api/ai/unsubscribe-topic**
Unsubscribe from FCM topic

**Request:**
```json
{
  "deviceToken": "eO2EqGVgkdE:APA91bFx...",
  "topic": "medication_reminders"
}
```

---

### **HEALTH CHECK ENDPOINT**

#### 12. **GET /api/ai/health**
Check AI services status

**Response:**
```json
{
  "success": true,
  "message": "AI Services Health Check",
  "services": {
    "chatbot": "OK",
    "suggestions": "OK",
    "notifications": "OK"
  }
}
```

---

## 💡 Usage Examples

### Example 1: Multi-step Health Recommendation Flow

```javascript
// 1. Get user health data
const userData = {
  steps: 2500,
  sleepHours: 5.5,
  missedDoses: 1,
  waterIntake: 1.5,
  heartRate: 85
};

// 2. Generate suggestions
POST /api/ai/suggestions
Body: userData

// 3. If health issues detected
POST /api/ai/health-issues
Body: userData

// 4. Send notification to user
POST /api/ai/send-health-alert
Body: {
  deviceToken: userToken,
  message: "Based on recommendations, please increase activity",
  type: "ACTIVITY_ALERT"
}

// 5. User asks follow-up question
POST /api/ai/chat-context
Body: {
  userId: "user123",
  message: "How can I improve my sleep?"
}
```

### Example 2: Medication Reminder System

```javascript
// 1. Subscribe user to medication_reminders topic
POST /api/ai/subscribe-topic
Body: {
  deviceToken: userToken,
  topic: "medication_reminders"
}

// 2. When medication time arrives, send reminder
POST /api/ai/send-medication-reminder
Body: {
  deviceToken: userToken,
  medicationName: "Aspirin",
  dosage: "500mg"
}

// Or send to all subscribed users
POST /api/ai/send-notification-to-topic
Body: {
  topic: "medication_reminders",
  title: "Medication Reminder",
  body: "It's time for your morning dose"
}
```

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| OPENAI_API_KEY | Yes | Your OpenAI API key |
| MONGO_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Secret for JWT tokens |
| JWT_REFRESH_SECRET | Yes | Secret for refresh tokens |
| PORT | No | Server port (default: 5000) |
| NODE_ENV | No | Environment (development/production) |

---

## ⚠️ Error Handling

All endpoints return structured error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Errors:

| Status | Error | Solution |
|--------|-------|----------|
| 400 | "Message is required" | Include message in request body |
| 401 | "API authentication failed" | Check OPENAI_API_KEY in .env |
| 429 | "API quota exceeded" | Add billing to OpenAI account |
| 500 | "Internal server error" | Check server logs |
| 503 | "OpenAI API key not configured" | Set OPENAI_API_KEY in .env |

---

## ✅ Best Practices

### 1. **Security**
- ✅ Never commit `.env` file
- ✅ Use environment variables for all secrets
- ✅ Validate user input before API calls
- ✅ Rate limit API endpoints
- ✅ Use HTTPS in production

### 2. **Performance**
- ✅ Cache suggestions for repeated users
- ✅ Use lazy initialization for OpenAI client
- ✅ Batch FCM notifications when possible
- ✅ Monitor token usage

### 3. **Reliability**
- ✅ Add retry logic with exponential backoff
- ✅ Implement comprehensive logging
- ✅ Handle network timeouts gracefully
- ✅ Validate Firebase credentials on startup

### 4. **Scalability**
- ✅ Store conversation history in database (not memory)
- ✅ Use message queues for notifications
- ✅ Implement caching for suggestions
- ✅ Consider async processing for heavy operations

---

## 🐛 Troubleshooting

### Issue: "OpenAI API key not configured"
```bash
# Solution: Check .env file
echo $OPENAI_API_KEY
# Should output your API key
```

### Issue: Notifications not sending
```bash
# Solution: Verify Firebase configuration
# 1. Check Firebase service account file exists
# 2. Verify Firebase credentials in .env
# 3. Test Firebase connection
curl http://localhost:5000/api/ai/health
```

### Issue: High token usage
```bash
# Solution: Optimize prompts
# 1. Reduce context length
# 2. Use shorter system prompts
# 3. Clear conversation history regularly
```

---

## 📚 Further Reading

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in server logs
3. Check Firebase Console for notification issues
4. Verify OpenAI API quota

---

**Last Updated:** April 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
