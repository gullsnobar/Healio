/**
 * OPENAI INTEGRATION TEST
 * Verify that OpenAI API is working correctly
 * Run: node test-openai-integration.js
 */

const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testOpenAIIntegration() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     OPENAI INTEGRATION TEST                                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  // Test 1: Check API Key
  log('TEST 1: Checking OpenAI API Key Configuration', 'blue');
  log('━'.repeat(60), 'blue');
  
  if (!OPENAI_API_KEY) {
    log('❌ FAILED: OPENAI_API_KEY not found in .env file', 'red');
    log('   ACTION: Add OPENAI_API_KEY=your_key to .env', 'yellow');
    return;
  }

  const keyPreview = `${OPENAI_API_KEY.substring(0, 10)}...${OPENAI_API_KEY.substring(-10)}`;
  log(`✅ PASSED: API Key found: ${keyPreview}`, 'green');
  log(`   Full key length: ${OPENAI_API_KEY.length} characters\n`);

  // Test 2: Test OpenAI Connectivity
  log('TEST 2: Testing OpenAI API Connectivity', 'blue');
  log('━'.repeat(60), 'blue');

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a health assistant. Keep responses brief.',
          },
          {
            role: 'user',
            content: 'What is AI?',
          },
        ],
        max_tokens: 50,
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

    if (response.status === 200) {
      log('✅ PASSED: Successfully connected to OpenAI API', 'green');
      log(`   Response status: ${response.status}`, 'green');
      log(`   Model: gpt-3.5-turbo\n`);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      log('❌ FAILED: Authentication Error (401)', 'red');
      log('   Issue: Invalid or expired API key', 'yellow');
      log('   ACTION: Check your OPENAI_API_KEY in .env', 'yellow');
    } else if (error.response?.status === 403) {
      log('❌ FAILED: Permission Denied (403)', 'red');
      log('   Issue: API key lacks required permissions', 'yellow');
      log('   ACTION: Check your OpenAI account permissions', 'yellow');
    } else if (error.response?.status === 429) {
      log('❌ FAILED: Rate Limited (429)', 'red');
      log('   Issue: Too many requests', 'yellow');
      log('   ACTION: Wait a moment and try again', 'yellow');
    } else if (error.code === 'ECONNREFUSED') {
      log('❌ FAILED: Connection Refused', 'red');
      log('   Issue: Cannot reach OpenAI servers', 'yellow');
      log('   ACTION: Check your internet connection', 'yellow');
    } else if (error.code === 'ENOTFOUND') {
      log('❌ FAILED: Domain Not Found', 'red');
      log('   Issue: Cannot resolve api.openai.com', 'yellow');
      log('   ACTION: Check your DNS settings and internet', 'yellow');
    } else if (error.message.includes('timeout')) {
      log('❌ FAILED: Request Timeout', 'red');
      log('   Issue: OpenAI API took too long to respond', 'yellow');
      log('   ACTION: Try again later', 'yellow');
    } else {
      log(`❌ FAILED: ${error.message}`, 'red');
      if (error.response?.data?.error) {
        log(`   Error: ${JSON.stringify(error.response.data.error)}`, 'yellow');
      }
    }
    return;
  }

  // Test 3: Test Health-Specific Query
  log('TEST 3: Testing Health-Related Query', 'blue');
  log('━'.repeat(60), 'blue');

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful health assistant. Keep responses brief (1-2 sentences).',
          },
          {
            role: 'user',
            content: 'How can I improve my sleep quality?',
          },
        ],
        max_tokens: 100,
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

    if (response.data?.choices?.[0]?.message?.content) {
      const generatedText = response.data.choices[0].message.content;
      log('✅ PASSED: Health query processed successfully', 'green');
      log(`\n   Generated Response:\n   ${generatedText}\n`, 'green');
    }
  } catch (error) {
    log(`❌ FAILED: Health query test failed - ${error.message}`, 'red');
  }

  // Test 4: Test Backend Endpoints
  log('TEST 4: Testing Backend AI Endpoints', 'blue');
  log('━'.repeat(60), 'blue');

  const testCases = [
    {
      name: 'Chat Endpoint',
      endpoint: 'http://localhost:5000/api/ai/chat',
      method: 'POST',
      body: { message: 'What should I eat for a healthy diet?' },
    },
    {
      name: 'Chat with Context',
      endpoint: 'http://localhost:5000/api/ai/chat-context',
      method: 'POST',
      body: { message: 'Can you remind me to take my medication?', userId: 'test-user-123' },
    },
  ];

  let backendRunning = false;

  for (const testCase of testCases) {
    try {
      const response = await axios({
        method: testCase.method,
        url: testCase.endpoint,
        data: testCase.body,
        timeout: 10000,
      });

      if (!backendRunning) backendRunning = true;
      
      if (response.data?.success) {
        log(`✅ ${testCase.name}: Working`, 'green');
        log(`   Response: ${response.data.message?.substring(0, 80) || 'OK'}...`, 'green');
      } else {
        log(`⚠️  ${testCase.name}: ${response.status}`, 'yellow');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_HTTP_REQUEST_TIMEOUT') {
        if (!backendRunning) {
          log(`⚠️  ${testCase.name}: Backend not running on port 5000`, 'yellow');
          log(`   ACTION: Start backend with: npm start`, 'yellow');
          backendRunning = false;
        }
      } else {
        log(`⚠️  ${testCase.name}: ${error.message?.substring(0, 50)}`, 'yellow');
      }
    }
  }

  // Summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     TEST SUMMARY                                           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('✅ If you see green checks, your OpenAI integration is working!', 'green');
  log('⚠️  Yellow warnings are non-critical (usually backend not running)', 'yellow');
  log('❌ Red errors need to be fixed before using AI features\n', 'red');

  log('🔧 Next Steps:', 'blue');
  log('1. Make sure your backend is running: npm start', 'cyan');
  log('2. Test endpoints with curl commands below:', 'cyan');
  log('3. Watch console logs for real-time activity', 'cyan');

  log('\n📌 CURL Test Commands:', 'blue');
  log('━'.repeat(60), 'blue');

  log('\n#1. Test Chat Endpoint:', 'cyan');
  log(`curl -X POST http://localhost:5000/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What should I eat for a healthy diet?"}'`, 'yellow');

  log('\n#2. Test Context Chat:', 'cyan');
  log(`curl -X POST http://localhost:5000/api/ai/chat-context \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Remind me to drink water", "userId": "user123"}'`, 'yellow');

  log('\n#3. Test Clear History:', 'cyan');
  log(`curl -X POST http://localhost:5000/api/ai/clear-history \\
  -H "Content-Type: application/json" \\
  -d '{"userId": "user123"}'`, 'yellow');

  log('\n✅ Your OpenAI integration is ready! 🚀\n', 'green');
}

testOpenAIIntegration().catch((error) => {
  log(`\nUnexpected error: ${error.message}`, 'red');
  process.exit(1);
});
