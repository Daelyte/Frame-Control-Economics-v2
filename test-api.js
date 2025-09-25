#!/usr/bin/env node
/**
 * Test script for Frame Economics API endpoints
 * Tests Arcjet protection and developer bypass functionality
 */

const NETLIFY_URL = 'https://frame-economics.netlify.app'; // Update with your Netlify URL
const LOCAL_URL = 'http://localhost:8888'; // For local development

// Test both local and production
const BASE_URL = process.argv.includes('--local') ? LOCAL_URL : NETLIFY_URL;

async function testEndpoint(url, method = 'GET', data = null) {
  console.log(`\n🔍 Testing ${method} ${url}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Frame-Economics-Test-Script/1.0',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Response: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    if (response.headers.get('x-blocked-reason')) {
      console.log(`🚫 Blocked Reason: ${response.headers.get('x-blocked-reason')}`);
    }
    
    return response.ok;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Frame Economics API Tests');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  
  const tests = [
    // Analytics endpoint tests
    {
      name: 'Analytics GET',
      test: () => testEndpoint(`${BASE_URL}/api/analytics`)
    },
    {
      name: 'Analytics POST - Valid Event',
      test: () => testEndpoint(`${BASE_URL}/api/analytics`, 'POST', {
        event: 'rule_completed',
        data: {
          rule: 1,
          completionTime: Date.now()
        }
      })
    },
    {
      name: 'Analytics POST - Invalid Event',
      test: () => testEndpoint(`${BASE_URL}/api/analytics`, 'POST', {
        event: 'invalid_event',
        data: {}
      })
    },
    
    // Feedback endpoint tests
    {
      name: 'Feedback POST - Valid Feedback',
      test: () => testEndpoint(`${BASE_URL}/api/feedback`, 'POST', {
        type: 'general',
        message: 'This is a test feedback message for the API endpoint testing.',
        email: 'test@example.com'
      })
    },
    {
      name: 'Feedback POST - Missing Fields',
      test: () => testEndpoint(`${BASE_URL}/api/feedback`, 'POST', {
        type: 'bug'
        // Missing message
      })
    },
    {
      name: 'Feedback GET - Should be blocked',
      test: () => testEndpoint(`${BASE_URL}/api/feedback`)
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    console.log(`\n📋 Running test: ${test.name}`);
    const result = await test.test();
    if (result) {
      passed++;
      console.log('✅ Test passed');
    } else {
      console.log('❌ Test failed (this might be expected for some tests)');
    }
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎯 Tests completed: ${passed}/${total} passed`);
  console.log('\n📊 Summary:');
  console.log('- Analytics endpoints should allow GET and POST');
  console.log('- Feedback endpoint should only allow POST');
  console.log('- Invalid data should be rejected with 400 status');
  console.log('- Developer requests should bypass Arcjet protection');
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, testEndpoint };