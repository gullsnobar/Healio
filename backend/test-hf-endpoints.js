/**
 * HUGGING FACE ENDPOINT DISCOVERY TEST
 * Tests multiple endpoint formats to find the working one
 */

const axios = require('axios');
require('dotenv').config();

const HF_API_KEY = process.env.HuggingFace_API_KEY;

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

async function testEndpoint(url, name) {
  try {
    log(`\nTesting: ${name}`, 'blue');
    log(`URL: ${url}`, 'cyan');

    const response = await axios.post(
      url,
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
        timeout: 15000,
      }
    );

    log(`✅ SUCCESS (${response.status}): ${name}`, 'green');
    log(`Response received:`, 'green');
    if (response.data && Array.isArray(response.data)) {
      log(`  ${response.data[0].generated_text?.substring(0, 100) || 'Response received'}...`, 'green');
    }
    return { success: true, name, url };
  } catch (error) {
    const status = error.response?.status || 'unknown';
    const message = error.response?.data || error.message;
    log(`❌ FAILED (${status}): ${name}`, 'red');
    log(`  Error: ${JSON.stringify(message).substring(0, 100)}`, 'yellow');
    return { success: false, name, url, error: message };
  }
}

async function findWorkingEndpoint() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  HUGGING FACE ENDPOINT DISCOVERY                           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  if (!HF_API_KEY) {
    log('\n❌ HuggingFace_API_KEY not found in .env', 'red');
    return;
  }

  const endpoints = [
    {
      url: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      name: 'Old endpoint (api-inference)',
    },
    {
      url: 'https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      name: 'New router endpoint (v1)',
    },
    {
      url: 'https://router.huggingface.io/models/mistralai/Mistral-7B-Instruct-v0.2',
      name: 'New router endpoint (v2 - .io)',
    },
    {
      url: 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      name: 'Alternative model - Zephyr',
    },
    {
      url: 'https://router.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      name: 'Alternative model - Zephyr (router)',
    },
  ];

  log(`\nTesting ${endpoints.length} different endpoint formats...\n`, 'yellow');

  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.url, endpoint.name);
    results.push(result);
    
    // If successful, no need to test more
    if (result.success) {
      log('\n🎉 FOUND WORKING ENDPOINT! Use this in your config:', 'green');
      log(`Endpoint: ${endpoint.url}`, 'green');
      log(`Model: ${endpoint.name}`, 'green');
      return;
    }

    // Wait a bit between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Show summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  TEST SUMMARY                                              ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  log(`\n✅ Working: ${successful.length} endpoints`, 'green');
  log(`❌ Failed: ${failed.length} endpoints\n`, 'red');

  if (successful.length === 0) {
    log('⚠️  No endpoints are currently working.', 'yellow');
    log('\nPossible issues:', 'yellow');
    log('1. API key might be invalid - check https://huggingface.co/settings/tokens', 'yellow');
    log('2. Hugging Face servers might be down', 'yellow');
    log('3. Your network might be blocking huggingface.co', 'yellow');
    log('4. API key might not have the right permissions', 'yellow');
    log('\nAlternative solution:', 'cyan');
    log('Consider using OpenAI API instead (you have OPENAI_API_KEY in .env)', 'cyan');
  }
}

findWorkingEndpoint().catch(error => {
  log(`\nUnexpected error: ${error.message}`, 'red');
  process.exit(1);
});
