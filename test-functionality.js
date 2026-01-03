#!/usr/bin/env node

// Simple test script to verify key functionalities
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testHealthCheck() {
  console.log('Testing health check...');
  try {
    const response = await fetch(`${BASE_URL}/api/healthz`);
    const data = await response.json();
    console.log('✓ Health check:', data);
    return response.status === 200 && data.ok === true;
  } catch (error) {
    console.log('✗ Health check failed:', error.message);
    return false;
  }
}

async function testCreatePaste() {
  console.log('Testing paste creation...');
  try {
    const response = await fetch(`${BASE_URL}/api/pastes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'Hello, World! This is a test paste.',
        ttl_seconds: 3600,
        max_views: 5
      })
    });
    const data = await response.json();
    console.log('✓ Paste created:', data);
    return { success: response.status === 200, data };
  } catch (error) {
    console.log('✗ Paste creation failed:', error.message);
    return { success: false };
  }
}

async function testGetPaste(id) {
  console.log(`Testing paste retrieval for ID: ${id}...`);
  try {
    const response = await fetch(`${BASE_URL}/api/pastes/${id}`);
    const data = await response.json();
    console.log('✓ Paste retrieved:', data);
    return { success: response.status === 200, data };
  } catch (error) {
    console.log('✗ Paste retrieval failed:', error.message);
    return { success: false };
  }
}

async function testViewLimit(id) {
  console.log(`Testing view limit for ID: ${id}...`);
  let viewCount = 0;
  
  while (viewCount < 10) { // Try to exceed the limit
    try {
      const response = await fetch(`${BASE_URL}/api/pastes/${id}`);
      viewCount++;
      
      if (response.status === 404) {
        console.log(`✓ Paste correctly deleted after ${viewCount} views`);
        return true;
      }
      
      const data = await response.json();
      console.log(`View ${viewCount}: remaining_views = ${data.remaining_views}`);
      
      if (data.remaining_views === 0) {
        // One more request should return 404
        const finalResponse = await fetch(`${BASE_URL}/api/pastes/${id}`);
        if (finalResponse.status === 404) {
          console.log('✓ View limit working correctly');
          return true;
        }
      }
    } catch (error) {
      console.log('✗ View limit test failed:', error.message);
      return false;
    }
  }
  
  console.log('✗ View limit not working - paste still accessible after 10 views');
  return false;
}

async function runTests() {
  console.log('Starting Pastebin-Lite functionality tests...\n');
  
  // Test 1: Health check
  const healthOk = await testHealthCheck();
  console.log('');
  
  // Test 2: Create paste
  const createResult = await testCreatePaste();
  console.log('');
  
  if (!createResult.success) {
    console.log('Cannot continue tests without successful paste creation');
    return;
  }
  
  const pasteId = createResult.data.id;
  
  // Test 3: Get paste
  const getResult = await testGetPaste(pasteId);
  console.log('');
  
  // Test 4: View limit
  const viewLimitOk = await testViewLimit(pasteId);
  console.log('');
  
  // Summary
  console.log('=== Test Summary ===');
  console.log(`Health Check: ${healthOk ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Create Paste: ${createResult.success ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Get Paste: ${getResult.success ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`View Limit: ${viewLimitOk ? '✓ PASS' : '✗ FAIL'}`);
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testHealthCheck, testCreatePaste, testGetPaste, testViewLimit };