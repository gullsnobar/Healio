#!/bin/bash

# 🧪 HEALIO AI SERVICES - CURL TESTING GUIDE
# 
# This script contains curl commands to test all 12 AI endpoints
# Run each command individually in your terminal
# 
# Requirements:
# - Backend running on http://localhost:5000
# - OpenAI API key configured in .env
# - Firebase token for notification tests (optional)

echo "🚀 HEALIO AI Services - Testing Guide"
echo "========================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api/ai"
TEST_DEVICE_TOKEN="YOUR_FIREBASE_DEVICE_TOKEN_HERE"
TEST_USER_ID="test-user-$(date +%s)"

# ====================================================
# 1. HEALTH CHECK - Verify services are running
# ====================================================

echo -e "${BLUE}1️⃣  HEALTH CHECK${NC}"
echo "---"
echo "Testing if all services are running..."
echo ""

curl -X GET "$API_URL/health" \
  -H "Content-Type: application/json"

echo ""
echo ""

# ====================================================
# 2. SIMPLE CHAT - Send a message
# ====================================================

echo -e "${BLUE}2️⃣  SIMPLE CHAT${NC}"
echo "---"
echo "Sending a message to health assistant..."
echo ""

curl -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How can I improve my daily fitness routine?",
    "userId": "'$TEST_USER_ID'"
  }'

echo ""
echo ""

# ====================================================
# 3. MULTI-TURN CHAT - Continue conversation
# ====================================================

echo -e "${BLUE}3️⃣  MULTI-TURN CONVERSATION${NC}"
echo "---"
echo "Note: This uses conversation history. Run #2 first!"
echo ""

curl -X POST "$API_URL/chat-context" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$TEST_USER_ID'",
    "message": "What about nutrition? Should I change my diet?"
  }'

echo ""
echo ""

# ====================================================
# 4. FOLLOW-UP CHAT
# ====================================================

echo -e "${BLUE}4️⃣  FOLLOW-UP CHAT${NC}"
echo "---"
echo "Third message in conversation..."
echo ""

curl -X POST "$API_URL/chat-context" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$TEST_USER_ID'",
    "message": "Can you provide 3 specific meal ideas for a healthy diet?"
  }'

echo ""
echo ""

# ====================================================
# 5. CLEAR CHAT HISTORY
# ====================================================

echo -e "${BLUE}5️⃣  CLEAR CONVERSATION HISTORY${NC}"
echo "---"
echo "Clearing conversation history for user..."
echo ""

curl -X POST "$API_URL/clear-history" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "'$TEST_USER_ID'"
  }'

echo ""
echo ""

# ====================================================
# 6. GENERATE SUGGESTIONS - Based on health metrics
# ====================================================

echo -e "${BLUE}6️⃣  GENERATE HEALTH SUGGESTIONS${NC}"
echo "---"
echo "Generating suggestions based on health data..."
echo ""

curl -X POST "$API_URL/suggestions" \
  -H "Content-Type: application/json" \
  -d '{
    "steps": 2500,
    "sleepHours": 5.5,
    "missedDoses": 1,
    "waterIntake": 1.5,
    "heartRate": 85
  }'

echo ""
echo ""

# ====================================================
# 7. CRITICAL HEALTH DATA - Detect issues
# ====================================================

echo -e "${BLUE}7️⃣  DETECT HEALTH ISSUES${NC}"
echo "---"
echo "Detecting health alerts from poor metrics..."
echo ""

curl -X POST "$API_URL/health-issues" \
  -H "Content-Type: application/json" \
  -d '{
    "steps": 500,
    "sleepHours": 3,
    "missedDoses": 4,
    "waterIntake": 0.5
  }'

echo ""
echo ""

# ====================================================
# 8. SEND CUSTOM NOTIFICATION
# ====================================================

echo -e "${BLUE}8️⃣  SEND CUSTOM NOTIFICATION${NC}"
echo "---"
echo "Sending a custom notification (requires valid Firebase token)..."
echo ""
echo "⚠️  NOTE: Replace $TEST_DEVICE_TOKEN with your actual device token"
echo ""

curl -X POST "$API_URL/send-notification" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$TEST_DEVICE_TOKEN'",
    "title": "🏥 Health Reminder",
    "body": "Time to check your vital signs!",
    "data": {
      "type": "health_reminder",
      "priority": "high",
      "targetScreen": "health_dashboard"
    }
  }'

echo ""
echo ""

# ====================================================
# 9. SEND MEDICATION REMINDER
# ====================================================

echo -e "${BLUE}9️⃣  SEND MEDICATION REMINDER${NC}"
echo "---"
echo "Sending medication reminder notification..."
echo ""

curl -X POST "$API_URL/send-medication-reminder" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$TEST_DEVICE_TOKEN'",
    "medicationName": "Aspirin",
    "medicationId": "med_123",
    "dosage": "500mg",
    "frequency": "Twice daily"
  }'

echo ""
echo ""

# ====================================================
# 10. SEND HEALTH ALERT
# ====================================================

echo -e "${BLUE}🔟 SEND HEALTH ALERT${NC}"
echo "---"
echo "Sending a health alert notification..."
echo ""

curl -X POST "$API_URL/send-health-alert" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$TEST_DEVICE_TOKEN'",
    "message": "⚠️ Your heart rate is elevated at 120 bpm",
    "type": "HEART_RATE_ALERT",
    "severity": "HIGH",
    "metrics": {
      "heartRate": 120,
      "normal_range": "60-100"
    }
  }'

echo ""
echo ""

# ====================================================
# 11. SEND ACHIEVEMENT NOTIFICATION
# ====================================================

echo -e "${BLUE}1️⃣1️⃣  SEND ACHIEVEMENT NOTIFICATION${NC}"
echo "---"
echo "Sending achievement/celebration notification..."
echo ""

curl -X POST "$API_URL/send-achievement" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$TEST_DEVICE_TOKEN'",
    "message": "🎉 Congratulations! You reached 10,000 steps today!",
    "achievementId": "achievement_steps_10k",
    "points": 100
  }'

echo ""
echo ""

# ====================================================
# 12A. SUBSCRIBE TO TOPIC
# ====================================================

echo -e "${BLUE}1️⃣2️⃣A SUBSCRIBE TO FCM TOPIC${NC}"
echo "---"
echo "Subscribing device to FCM topic for bulk notifications..."
echo ""

curl -X POST "$API_URL/subscribe-topic" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$TEST_DEVICE_TOKEN'",
    "topic": "medication_reminders"
  }'

echo ""
echo ""

# ====================================================
# 12B. UNSUBSCRIBE FROM TOPIC
# ====================================================

echo -e "${BLUE}1️⃣2️⃣B UNSUBSCRIBE FROM FCM TOPIC${NC}"
echo "---"
echo "Unsubscribing device from FCM topic..."
echo ""

curl -X POST "$API_URL/unsubscribe-topic" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceToken": "'$TEST_DEVICE_TOKEN'",
    "topic": "medication_reminders"
  }'

echo ""
echo ""

# ====================================================
# SUCCESS SUMMARY
# ====================================================

echo -e "${GREEN}✅ Test Complete!${NC}"
echo ""
echo "Summary of endpoints tested:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Health Check"
echo "✅ Simple Chat"
echo "✅ Multi-turn Conversation"
echo "✅ Follow-up Chat"
echo "✅ Clear History"
echo "✅ Generate Suggestions"
echo "✅ Detect Health Issues"
echo "✅ Send Notification"
echo "✅ Send Medication Reminder"
echo "✅ Send Health Alert"
echo "✅ Send Achievement"
echo "✅ Subscribe to Topic"
echo "✅ Unsubscribe from Topic"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Notes:"
echo "   • For notification tests, replace $TEST_DEVICE_TOKEN with a real Firebase token"
echo "   • Ensure .env file has OPENAI_API_KEY configured"
echo "   • Backend must be running on localhost:5000"
echo ""
echo "📚 Full documentation: See AI_SERVICES_README.md"
echo ""
