# 🧪 MR & FT AI SERVICES - POWERSHELL TESTING GUIDE
# Windows PowerShell version for testing all 12 AI endpoints
#
# Usage: .\test-ai-endpoints.ps1
#
# Requirements:
# - Backend running on http://localhost:5000
# - OpenAI API key configured in .env

Write-Host "🚀 MR & FT AI Services - Testing Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:5000/api/ai"
$TEST_DEVICE_TOKEN = "YOUR_FIREBASE_DEVICE_TOKEN_HERE"
$TEST_USER_ID = "test-user-$(Get-Date -Format 'yyyyMMddHHmmss')"

# Helper function to make requests
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [string]$Description,
        [int]$TestNumber
    )
    
    Write-Host "$TestNumber. $Description" -ForegroundColor Blue
    Write-Host "---"
    
    try {
        $response = Invoke-RestMethod `
            -Uri "$API_URL$Endpoint" `
            -Method $Method `
            -Headers @{"Content-Type"="application/json"} `
            -Body $Body `
            -ErrorAction Stop
        
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host ""
}

# ====================================================
# 1. HEALTH CHECK
# ====================================================

Test-Endpoint `
    -Method "GET" `
    -Endpoint "/health" `
    -Description "Health Check - Verify services running" `
    -TestNumber "1️⃣"

# ====================================================
# 2. SIMPLE CHAT
# ====================================================

$chatBody = @{
    message = "How can I improve my daily fitness routine?"
    userId = $TEST_USER_ID
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/chat" `
    -Body $chatBody `
    -Description "Simple Chat - Send message to AI" `
    -TestNumber "2️⃣"

# ====================================================
# 3. MULTI-TURN CHAT
# ====================================================

$contextBody = @{
    userId = $TEST_USER_ID
    message = "What about nutrition? Should I change my diet?"
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/chat-context" `
    -Body $contextBody `
    -Description "Multi-turn Chat - Continue conversation" `
    -TestNumber "3️⃣"

# ====================================================
# 4. FOLLOW-UP CHAT
# ====================================================

$followupBody = @{
    userId = $TEST_USER_ID
    message = "Can you provide 3 specific meal ideas for a healthy diet?"
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/chat-context" `
    -Body $followupBody `
    -Description "Follow-up Chat - Third message in conversation" `
    -TestNumber "4️⃣"

# ====================================================
# 5. CLEAR HISTORY
# ====================================================

$clearBody = @{
    userId = $TEST_USER_ID
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/clear-history" `
    -Body $clearBody `
    -Description "Clear History - Clear conversation history" `
    -TestNumber "5️⃣"

# ====================================================
# 6. GENERATE SUGGESTIONS
# ====================================================

$suggestionsBody = @{
    steps = 2500
    sleepHours = 5.5
    missedDoses = 1
    waterIntake = 1.5
    heartRate = 85
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/suggestions" `
    -Body $suggestionsBody `
    -Description "Generate Suggestions - Based on health data" `
    -TestNumber "6️⃣"

# ====================================================
# 7. DETECT HEALTH ISSUES
# ====================================================

$healthIssuesBody = @{
    steps = 500
    sleepHours = 3
    missedDoses = 4
    waterIntake = 0.5
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/health-issues" `
    -Body $healthIssuesBody `
    -Description "Detect Issues - Identify health problems" `
    -TestNumber "7️⃣"

# ====================================================
# 8. SEND NOTIFICATION
# ====================================================

$notificationBody = @{
    deviceToken = $TEST_DEVICE_TOKEN
    title = "🏥 Health Reminder"
    body = "Time to check your vital signs!"
    data = @{
        type = "health_reminder"
        priority = "high"
        targetScreen = "health_dashboard"
    }
} | ConvertTo-Json

Write-Host "⚠️  NOTE: Replace token with your actual Firebase device token" -ForegroundColor Yellow

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/send-notification" `
    -Body $notificationBody `
    -Description "Send Notification - Custom notification" `
    -TestNumber "8️⃣"

# ====================================================
# 9. MEDICATION REMINDER
# ====================================================

$medReminderBody = @{
    deviceToken = $TEST_DEVICE_TOKEN
    medicationName = "Aspirin"
    medicationId = "med_123"
    dosage = "500mg"
    frequency = "Twice daily"
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/send-medication-reminder" `
    -Body $medReminderBody `
    -Description "Medication Reminder - Send medication alert" `
    -TestNumber "9️⃣"

# ====================================================
# 10. HEALTH ALERT
# ====================================================

$healthAlertBody = @{
    deviceToken = $TEST_DEVICE_TOKEN
    message = "⚠️  Your heart rate is elevated at 120 bpm"
    type = "HEART_RATE_ALERT"
    severity = "HIGH"
    metrics = @{
        heartRate = 120
        normal_range = "60-100"
    }
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/send-health-alert" `
    -Body $healthAlertBody `
    -Description "Health Alert - Send warning notification" `
    -TestNumber "🔟"

# ====================================================
# 11. ACHIEVEMENT NOTIFICATION
# ====================================================

$achievementBody = @{
    deviceToken = $TEST_DEVICE_TOKEN
    message = "🎉 Congratulations! You reached 10,000 steps today!"
    achievementId = "achievement_steps_10k"
    points = 100
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/send-achievement" `
    -Body $achievementBody `
    -Description "Achievement - Send celebration notification" `
    -TestNumber "1️⃣1️⃣"

# ====================================================
# 12A. SUBSCRIBE TO TOPIC
# ====================================================

$subscribeBody = @{
    deviceToken = $TEST_DEVICE_TOKEN
    topic = "medication_reminders"
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/subscribe-topic" `
    -Body $subscribeBody `
    -Description "Subscribe to Topic - For bulk notifications" `
    -TestNumber "1️⃣2️⃣A"

# ====================================================
# 12B. UNSUBSCRIBE FROM TOPIC
# ====================================================

$unsubscribeBody = @{
    deviceToken = $TEST_DEVICE_TOKEN
    topic = "medication_reminders"
} | ConvertTo-Json

Test-Endpoint `
    -Method "POST" `
    -Endpoint "/unsubscribe-topic" `
    -Body $unsubscribeBody `
    -Description "Unsubscribe from Topic - Leave topic" `
    -TestNumber "1️⃣2️⃣B"

# ====================================================
# SUMMARY
# ====================================================

Write-Host "✅ Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary of endpoints tested:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Health Check" -ForegroundColor Green
Write-Host "✅ Simple Chat" -ForegroundColor Green
Write-Host "✅ Multi-turn Conversation" -ForegroundColor Green
Write-Host "✅ Follow-up Chat" -ForegroundColor Green
Write-Host "✅ Clear History" -ForegroundColor Green
Write-Host "✅ Generate Suggestions" -ForegroundColor Green
Write-Host "✅ Detect Health Issues" -ForegroundColor Green
Write-Host "✅ Send Notification" -ForegroundColor Green
Write-Host "✅ Send Medication Reminder" -ForegroundColor Green
Write-Host "✅ Send Health Alert" -ForegroundColor Green
Write-Host "✅ Send Achievement" -ForegroundColor Green
Write-Host "✅ Subscribe to Topic" -ForegroundColor Green
Write-Host "✅ Unsubscribe from Topic" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Notes:" -ForegroundColor Yellow
Write-Host "   • For notification tests, replace token with your actual Firebase token" -ForegroundColor Yellow
Write-Host "   • Ensure .env file has OPENAI_API_KEY configured" -ForegroundColor Yellow
Write-Host "   • Backend must be running on localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Full documentation: See AI_SERVICES_README.md" -ForegroundColor Cyan
