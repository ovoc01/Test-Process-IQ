const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testNoSqlInjection() {
  console.log('--- Testing NoSQL Injection ---');
  try {
    // Attempt to login with NoSQL injection payload
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      username: { "$gt": "" },
      password: { "$gt": "" }
    });
    console.log('Result:', res.status === 200 ? 'VULNERABLE' : 'SECURE');
  } catch (err) {
    console.log('Result: SECURE (Error caught)');
  }
}

async function testBruteForce() {
  console.log('\n--- Testing Brute Force ---');
  let successCount = 0;
  let blockedCount = 0;

  for (let i = 0; i < 110; i++) {
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        username: 'admin',
        password: 'wrong-password'
      });
    } catch (err) {
      if (err.response?.status === 429) {
        blockedCount++;
      } else {
        successCount++;
      }
    }
  }
  console.log(`Requests processed: 110`);
  console.log(`Blocked by Rate Limit: ${blockedCount}`);
  console.log(blockedCount > 0 ? 'Result: SECURE (Rate limiting active)' : 'Result: VULNERABLE');
}

async function runTests() {
  await testNoSqlInjection();
  await testBruteForce();
}

runTests();
