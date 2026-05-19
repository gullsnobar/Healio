# MR & FT AI Integration Guide

## Complete API Endpoints Documentation

### Base URL
```
http://localhost:5000/api/ai
```

---

## 1. CHATBOT ENDPOINTS

### 1.1 Single-Turn Chat (Simple)
**Endpoint:** `POST /api/ai/chat`

**Description:** Send a message to the health assistant AI without conversation history

**Request:**
```json
{
  "message": "What are the benefits of regular exercise?",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Regular exercise provides numerous health benefits...",
    "model": "mistral-7b",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

### 1.2 Multi-Turn Chat (With Context)
**Endpoint:** `POST /api/ai/chat-context`

**Description:** Have a conversation with the AI while maintaining context/history

**Request:**
```json
{
  "message": "Can you explain diabetes?",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "Diabetes is a chronic condition where blood glucose levels are elevated...",
    "conversationLength": 2,
    "model": "mistral-7b"
  }
}
```

**Notes:**
- Maintains conversation history in memory (up to 5 exchanges per user)
- Each user gets their own conversation history
- Context is lost when server restarts

---

### 1.3 Clear Chat History
**Endpoint:** `POST /api/ai/clear-history`

**Description:** Clear all conversation history for a specific user

**Request:**
```json
{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cleared history for user user-123",
  "cleared": true
}
```

---

## 2. SPEECH-TO-TEXT ENDPOINT

### 2.1 Transcribe Audio File
**Endpoint:** `POST /api/ai/transcribe-audio`

**Description:** Convert audio file to text using Whisper-base model

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Fields:
  - `audio` (File): Audio file to transcribe
  - `userId` (String, optional): User identifier for logging

**Supported Formats:**
- MP3
- WAV
- M4A
- FLAC
- OGG

**Size Limits:**
- Maximum: 50MB

**Response:**
```json
{
  "success": true,
  "data": {
    "transcription": "The doctor prescribes antibiotics for bacterial infections.",
    "language": "en",
    "duration": 5.2,
    "model": "whisper-base",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/ai/transcribe-audio \
  -F "audio=@recording.mp3" \
  -F "userId=user-123"
```

**Example JavaScript:**
```javascript
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('userId', 'user-123');

const response = await fetch('/api/ai/transcribe-audio', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

---

## 3. IMAGE ANALYSIS ENDPOINT

### 3.1 Analyze Medicine Image
**Endpoint:** `POST /api/ai/analyze-medicine-image`

**Description:** Analyze medicine/medication image and generate AI caption with health suggestions

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Fields:
  - `image` (File): Image file to analyze
  - `userId` (String, optional): User identifier for logging

**Supported Formats:**
- JPEG
- PNG
- GIF
- WebP

**Size Limits:**
- Maximum: 10MB

**Response:**
```json
{
  "success": true,
  "data": {
    "caption": "A bottle of aspirin tablets 500mg for pain relief",
    "suggestions": [
      {
        "type": "medication-reminder",
        "title": "Take with Food",
        "description": "Aspirin should be taken with food or milk to prevent stomach irritation"
      },
      {
        "type": "consultation",
        "title": "Consult Pharmacist",
        "description": "Ask about potential interactions with other medications"
      },
      {
        "type": "storage",
        "title": "Store Properly",
        "description": "Keep in a cool, dry place away from moisture"
      }
    ],
    "model": "blip",
    "timestamp": "2024-01-15T10:40:00Z"
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/api/ai/analyze-medicine-image \
  -F "image=@medicine.jpg" \
  -F "userId=user-123"
```

---

## 4. HEALTH SUGGESTIONS ENDPOINTS

### 4.1 Generate Health Suggestions
**Endpoint:** `POST /api/ai/suggestions`

**Description:** Generate personalized health suggestions based on user health data

**Request:**
```json
{
  "steps": 8500,
  "sleepHours": 7,
  "missedDoses": 0,
  "waterIntake": 2.5,
  "heartRate": 72,
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "healthScore": 78,
    "suggestions": [
      {
        "category": "activity",
        "priority": "medium",
        "suggestion": "Try to reach 10,000 steps daily for optimal health",
        "current": 8500,
        "target": 10000
      },
      {
        "category": "sleep",
        "priority": "low",
        "suggestion": "Great job maintaining 7 hours of sleep!",
        "current": 7,
        "target": 7
      }
    ]
  }
}
```

---

### 4.2 Detect Health Issues
**Endpoint:** `POST /api/ai/health-issues`

**Description:** Detect critical health issues from user data and return alerts

**Request:**
```json
{
  "steps": 2000,
  "sleepHours": 4,
  "missedDoses": 5,
  "waterIntake": 0.5,
  "heartRate": 120
}
```

**Response:**
```json
{
  "success": true,
  "alertCount": 2,
  "alerts": [
    {
      "type": "CRITICAL",
      "category": "sleep",
      "message": "Insufficient sleep detected. You got only 4 hours. Aim for 7-9 hours.",
      "severity": "critical"
    },
    {
      "type": "HIGH",
      "category": "hydration",
      "message": "Severe dehydration risk. Water intake very low (0.5L / 2L recommended)",
      "severity": "high"
    }
  ]
}
```

---

## 5. NOTIFICATION ENDPOINTS

### 5.1 Send Custom Notification
**Endpoint:** `POST /api/ai/send-notification`

**Description:** Send a custom push notification to a device

**Request:**
```json
{
  "deviceToken": "device-fcm-token-here",
  "title": "Medication Reminder",
  "body": "Time to take your morning medications",
  "data": {
    "medicationId": "med-123",
    "type": "medication"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "notification-id-xxxxx",
    "status": "sent"
  }
}
```

---

### 5.2 Send Medication Reminder
**Endpoint:** `POST /api/ai/send-medication-reminder`

**Description:** Send a medication reminder notification

**Request:**
```json
{
  "deviceToken": "device-fcm-token-here",
  "medicationName": "Aspirin",
  "medicationId": "med-123",
  "dosage": "500mg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "reminder-xxxxx",
    "medication": "Aspirin",
    "status": "sent"
  }
}
```

---

### 5.3 Send Health Alert
**Endpoint:** `POST /api/ai/send-health-alert`

**Description:** Send a health alert notification

**Request:**
```json
{
  "deviceToken": "device-fcm-token-here",
  "message": "Your blood pressure is unusually high",
  "type": "blood-pressure",
  "severity": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "alert-xxxxx",
    "status": "sent"
  }
}
```

---

### 5.4 Send Achievement Notification
**Endpoint:** `POST /api/ai/send-achievement`

**Description:** Send an achievement/badge notification

**Request:**
```json
{
  "deviceToken": "device-fcm-token-here",
  "message": "🎉 Congratulations! You've reached 100,000 steps this month!",
  "achievementId": "achievement-step-100k"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "achievement-xxxxx",
    "status": "sent"
  }
}
```

---

## 6. TOPIC SUBSCRIPTION ENDPOINTS

### 6.1 Subscribe to Topic
**Endpoint:** `POST /api/ai/subscribe-topic`

**Description:** Subscribe device to FCM topic for bulk notifications

**Request:**
```json
{
  "deviceToken": "device-fcm-token-here",
  "topic": "medication-reminders"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "subscribed",
    "topic": "medication-reminders"
  }
}
```

**Common Topics:**
- `medication-reminders`
- `health-alerts`
- `fitness-challenges`
- `health-insights`
- `public-announcements`

---

### 6.2 Unsubscribe from Topic
**Endpoint:** `POST /api/ai/unsubscribe-topic`

**Description:** Unsubscribe device from FCM topic

**Request:**
```json
{
  "deviceToken": "device-fcm-token-here",
  "topic": "medication-reminders"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "unsubscribed",
    "topic": "medication-reminders"
  }
}
```

---

## 7. HEALTH CHECK ENDPOINT

### 7.1 AI Services Health Check
**Endpoint:** `GET /api/ai/health`

**Description:** Verify all AI services are operational

**Request:**
```
GET /api/ai/health
```

**Response:**
```json
{
  "success": true,
  "message": "AI Services Health Check",
  "services": {
    "chatbot": "OK",
    "speechToText": "OK",
    "imageAnalysis": "OK",
    "suggestions": "OK",
    "notifications": "OK"
  },
  "timestamp": "2024-01-15T10:45:00Z"
}
```

---

## Environment Variables

The following environment variables must be set in `.env`:

```env
# Hugging Face API (for chatbot, speech-to-text, image analysis)
HF_API_KEY=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

# Firebase Admin SDK (for notifications)
FIREBASE_PROJECT_ID=healio-bba24
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# Optional fallback (not used in current setup)
OPENAI_API_KEY=...
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-15T10:50:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (invalid token)
- `413` - Payload Too Large (file exceeds size limit)
- `500` - Server Error
- `503` - Service Unavailable (API key missing or invalid)

---

## File Upload Limits

| Feature | Max Size | Formats |
|---------|----------|---------|
| Audio (Speech-to-Text) | 50MB | MP3, WAV, M4A, FLAC, OGG |
| Images (Analysis) | 10MB | JPEG, PNG, GIF, WebP |

---

## Upload Directory Structure

```
backend/
├── uploads/
│   ├── audio/           # Speech-to-text audio files
│   ├── images/          # Medicine image analysis files
│   └── documents/       # General document uploads
```

---

## Testing the Endpoints

### Test with cURL

```bash
# Chatbot
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How can I improve my health?","userId":"user-123"}'

# Speech-to-Text
curl -X POST http://localhost:5000/api/ai/transcribe-audio \
  -F "audio=@sample.mp3" \
  -F "userId=user-123"

# Image Analysis
curl -X POST http://localhost:5000/api/ai/analyze-medicine-image \
  -F "image=@medicine.jpg" \
  -F "userId=user-123"

# Health Check
curl http://localhost:5000/api/ai/health
```

### Test with Postman

1. Create a new POST request
2. Set URL to `http://localhost:5000/api/ai/chat`
3. Set Headers:
   - `Content-Type: application/json`
4. Set Body (raw JSON):
```json
{
  "message": "What should I eat for diabetes?",
  "userId": "test-user"
}
```
5. Click Send

---

## Implementation Notes

### Services Used

1. **Chatbot Service**
   - Model: Mistral-7B-Instruct-v0.2
   - API: Hugging Face Inference
   - Max Tokens: 250 per response
   - Context: Last 5 exchanges stored

2. **Speech-to-Text Service**
   - Model: OpenAI Whisper-base
   - API: Hugging Face Inference
   - Max Duration: ~50MB audio
   - Languages: Auto-detected

3. **Image Analysis Service**
   - Model: Salesforce BLIP
   - API: Hugging Face Inference
   - Max Size: ~10MB
   - Output: Caption + AI Suggestions

4. **Suggestions Engine**
   - Rules-based analysis
   - Calculates health score (0-100)
   - Generates priority-based suggestions

5. **Notifications**
   - Firebase Cloud Messaging (FCM)
   - Real-time delivery
   - Topic-based bulk sends
   - Device-specific or topic subscriptions

---

## Logging

All AI services log to:
- **Console**: Real-time development feedback
- **File**: `backend/logs/ai-services-YYYY-MM-DD.log`

Log Format:
```
[TIMESTAMP] [LEVEL] [SERVICE] Message
[2024-01-15 10:45:30] [INFO] [AI Chat] User user-123 sent: "What are...?"
```

---

## Next Steps

1. **Store Conversations**: Integrate MongoDB to persist conversation history
2. **User Analytics**: Track AI service usage per user
3. **Performance Tuning**: Cache frequent questions/responses
4. **Multi-Language Support**: Add language-specific prompts
5. **Custom Models**: Fine-tune Mistral for health domain
6. **Real-time Sync**: Implement WebSocket for live notifications

---

## Deployment Checklist

- [ ] Verify `HF_API_KEY` is set in production .env
- [ ] Verify Firebase credentials are properly configured
- [ ] Create `uploads/audio/`, `uploads/images/` directories
- [ ] Set appropriate file size limits in nginx/reverse proxy
- [ ] Enable HTTPS for secure file uploads
- [ ] Configure error logging and monitoring
- [ ] Test all endpoints in staging before production
- [ ] Document API in API portal for frontend developers

---

## Support

For issues or questions:
1. Check logs in `backend/logs/`
2. Verify API keys are correctly set
3. Check file format and size limits
4. Review error response for specific details
5. Contact: [support@healio.app](mailto:support@healio.app)
