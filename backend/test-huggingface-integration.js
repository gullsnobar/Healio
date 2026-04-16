/**
 * HUGGING FACE INTEGRATION TEST
 * Tests the Hugging Face API key and Mistral-7B model integration
 * Run: node test-huggingface-integration.js
 */

const axios = require('axios');
require('dotenv').config();

const HF_API_KEY = process.env.HuggingFace_API_KEY;
const HF_API_URL = 'https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

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

async function testHuggingFaceIntegration() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     HUGGING FACE INTEGRATION TEST                          ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  // Test 1: Check API Key
  log('TEST 1: Checking API Key Configuration', 'blue');
  log('━'.repeat(60), 'blue');
  
  if (!HF_API_KEY) {
    log('❌ FAILED: HuggingFace_API_KEY not found in .env file', 'red');
    log('   ACTION: Add HuggingFace_API_KEY=your_key to .env', 'yellow');
    return;
  }

  const keyPreview = `${HF_API_KEY.substring(0, 10)}...${HF_API_KEY.substring(-10)}`;
  log(`✅ PASSED: API Key found: ${keyPreview}`, 'green');
  log(`   Full key length: ${HF_API_KEY.length} characters\n`);

  // Test 2: Check Hugging Face Connectivity
  log('TEST 2: Testing Hugging Face API Connectivity', 'blue');
  log('━'.repeat(60), 'blue');

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: 'What is AI?',
        parameters: {
          max_new_tokens: 50,
          temperature: 0.7,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.status === 200) {
      log('✅ PASSED: Successfully connected to Hugging Face API', 'green');
      log(`   Response status: ${response.status}`, 'green');
      log(`   Model: Mistral-7B-Instruct-v0.2\n`);
    }
  } catch (error) {
    if (error.response?.status === 401) {
      log('❌ FAILED: Authentication Error (401)', 'red');
      log('   Issue: Invalid or expired API key', 'yellow');
      log('   ACTION: Check your HuggingFace_API_KEY in .env', 'yellow');
    } else if (error.response?.status === 403) {
      log('❌ FAILED: Permission Denied (403)', 'red');
      log('   Issue: API key lacks required permissions', 'yellow');
      log('   ACTION: Check your Hugging Face account permissions', 'yellow');
    } else if (error.code === 'ECONNREFUSED') {
      log('❌ FAILED: Connection Refused', 'red');
      log('   Issue: Cannot reach Hugging Face servers', 'yellow');
      log('   ACTION: Check your internet connection', 'yellow');
    } else if (error.code === 'ENOTFOUND') {
      log('❌ FAILED: Domain Not Found', 'red');
      log('   Issue: Cannot resolve api-inference.huggingface.co', 'yellow');
      log('   ACTION: Check your DNS settings and internet', 'yellow');
    } else if (error.message.includes('timeout')) {
      log('❌ FAILED: Request Timeout', 'red');
      log('   Issue: Hugging Face API took too long to respond', 'yellow');
      log('   ACTION: Try again later or check API status', 'yellow');
    } else {
      log(`❌ FAILED: ${error.message}`, 'red');
      if (error.response?.data) {
        log(`   Response: ${JSON.stringify(error.response.data)}`, 'yellow');
      }
    }
    return;
  }

  // Test 3: Test Health Chatbot Specific Query
  log('TEST 3: Testing Health-Specific Query', 'blue');
  log('━'.repeat(60), 'blue');

  const healthPrompt = `You are a helpful health assistant. Answer briefly (1-2 sentences).
User: How can I improve my sleep quality?
Assistant:`;

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: healthPrompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const generatedText = response.data[0].generated_text;
      log('✅ PASSED: Health query processed successfully', 'green');
      log(`\n   Generated Response:\n   ${generatedText}\n`, 'green');
    }
  } catch (error) {
    log(`❌ FAILED: Health query test failed - ${error.message}`, 'red');
  }

  // Test 4: Test with Backend Endpoints
  log('TEST 4: Testing Backend Integration Endpoints', 'blue');
  log('━'.repeat(60), 'blue');

  const testCases = [
    {
      name: 'Chat Endpoint',
      endpoint: 'http://localhost:5000/api/ai/chat',
      method: 'POST',
      body: { message: 'What should I eat for a healthy diet?' },
    },
    {
      name: 'Health Issues Detection',
      endpoint: 'http://localhost:5000/api/ai/health-issues',
      method: 'POST',
      body: {
        steps: 2000,
        sleepHours: 5,
        missedDoses: 2,
        waterIntake: 1,
      },
    },
    {
      name: 'Suggestions Endpoint',
      endpoint: 'http://localhost:5000/api/ai/suggestions',
      method: 'POST',
      body: {
        steps: 3000,
        sleepHours: 6,
        missedDoses: 1,
        waterIntake: 2,
      },
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
      
      log(`✅ ${testCase.name}: ${response.status}`, 'green');
      if (response.data) {
        log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`, 'green');
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_HTTP_REQUEST_TIMEOUT') {
        if (!backendRunning) {
          log(`⚠️  ${testCase.name}: Backend not running on port 5000`, 'yellow');
          log(`   ACTION: Start backend with: npm start`, 'yellow');
          backendRunning = false;
        }
      } else {
        log(`⚠️  ${testCase.name}: ${error.message}`, 'yellow');
      }
    }
  }

  // Summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     TEST SUMMARY                                           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  log('📋 Checklist:', 'blue');
  log('✅ If you see all green checks, your Hugging Face integration is working!', 'green');
  log('⚠️  Yellow warnings indicate non-critical issues to check', 'yellow');
  log('❌ Red errors need to be fixed before using the integration', 'red');

  log('\n🔧 Next Steps:', 'blue');
  log('1. Make sure your backend is running: npm start', 'cyan');
  log('2. Test endpoints with the provided curl commands below:', 'cyan');
  log('3. Check API responses for proper AI-generated content', 'cyan');

  log('\n📌 CURL Test Commands:', 'blue');
  log('━'.repeat(60), 'blue');

  log('\n#1. Test Chat Endpoint:', 'cyan');
  log(`curl -X POST http://localhost:5000/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What should I eat for a healthy diet?"}'`, 'yellow');

  log('\n#2. Test Health Issues Detection:', 'cyan');
  log(`curl -X POST http://localhost:5000/api/ai/health-issues \\
  -H "Content-Type: application/json" \\
  -d '{"steps": 2000, "sleepHours": 5, "missedDoses": 2, "waterIntake": 1}'`, 'yellow');

  log('\n#3. Test Suggestions:', 'cyan');
  log(`curl -X POST http://localhost:5000/api/ai/suggestions \\
  -H "Content-Type: application/json" \\
  -d '{"steps": 3000, "sleepHours": 6, "missedDoses": 1, "waterIntake": 2}'`, 'yellow');

  log('\n📚 Troubleshooting Guide:', 'blue');
  log('━'.repeat(60), 'blue');

  log('\n❌ "HuggingFace_API_KEY not found"', 'red');
  log('   → Solution: Add the key to .env file and restart the server', 'yellow');

  log('\n❌ "401 Unauthorized"', 'red');
  log('   → Solution: Check your API key at https://huggingface.co/settings/tokens', 'yellow');

  log('\n❌ "Model is loading" error', 'red');
  log('   → Solution: Wait a few minutes, the model might be initializing', 'yellow');

  log('\n❌ "Timeout" error', 'red');
  log('   → Solution: Try again, Hugging Face might be under heavy load', 'yellow');

  log('\n✅ All Done! Your Hugging Face integration should be ready to use.\n', 'green');
}

// Run the tests
testHuggingFaceIntegration().catch((error) => {
  log(`\nUnexpected error: ${error.message}`, 'red');
  process.exit(1);
});
