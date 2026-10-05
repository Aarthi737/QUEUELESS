// Automated backend test script for QueueLess API
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING QUEUELESS BACKEND API TESTS ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 0. Reset Demo Data to guarantee fresh seed with single-hashed password
    const resetRes = await fetch(`${BASE_URL}/admin/reset-demo`, { method: 'POST' });
    const resetData = await resetRes.json();
    assert(resetRes.status === 200 && resetData.success === true, 'POST /api/admin/reset-demo');

    // 1. Healthcheck
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.success === true, 'GET /api/health');

    // 2. Auth Login (Customer)
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aarthi.sharma@example.com',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token && loginData.user.email === 'aarthi.sharma@example.com', 'POST /api/auth/login (Customer)');
    const authToken = loginData.token;

    // 3. Auth Me
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.name === 'Aarthi Sharma', 'GET /api/auth/me (Protected)');

    // 4. Invalid Login
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aarthi.sharma@example.com',
        password: 'wrongpassword',
      }),
    });
    assert(invalidLoginRes.status === 401, 'POST /api/auth/login (Invalid Password returns 401)');

    // 5. Auth Register
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Registered User',
        email: uniqueEmail,
        password: 'password123',
        phone: '+91 99999 88888',
      }),
    });
    const registerData = await registerRes.json();
    assert(registerRes.status === 201 && registerData.token && registerData.user.email === uniqueEmail, 'POST /api/auth/register');

    // 6. Duplicate Email Register
    const dupRegisterRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: uniqueEmail,
        password: 'password123',
      }),
    });
    assert(dupRegisterRes.status === 409, 'POST /api/auth/register (Duplicate Email returns 409)');

    // 7. Get All Queues
    const queuesRes = await fetch(`${BASE_URL}/queues`);
    const queuesData = await queuesRes.json();
    assert(queuesRes.status === 200 && Array.isArray(queuesData.data) && queuesData.count === 6, 'GET /api/queues (Returns 6 services)');
    const firstQueue = queuesData.data[0];

    // 8. Get Queue By ID
    const singleQueueRes = await fetch(`${BASE_URL}/queues/${firstQueue.id}`);
    const singleQueueData = await singleQueueRes.json();
    assert(singleQueueRes.status === 200 && singleQueueData.data.name === firstQueue.name, `GET /api/queues/:id (${firstQueue.name})`);

    // 9. Get User's Active Queue
    const activeQueueRes = await fetch(`${BASE_URL}/queues/my/active`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const activeQueueData = await activeQueueRes.json();
    assert(activeQueueRes.status === 200 && activeQueueData.data !== null && activeQueueData.data.tokenNumber === 'A42', 'GET /api/queues/my/active (Returns token A42 for Aarthi)');

    // 10. Get User's Queue History
    const historyRes = await fetch(`${BASE_URL}/queues/my/history`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const historyData = await historyRes.json();
    assert(historyRes.status === 200 && Array.isArray(historyData.data) && historyData.data.length >= 4, 'GET /api/queues/my/history (Returns past records)');

    // 11. Join Queue (using the newly registered user)
    const newAuthToken = registerData.token;
    const bankQueue = queuesData.data.find(q => q.codePrefix === 'B');
    const joinRes = await fetch(`${BASE_URL}/queues/${bankQueue.id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newAuthToken}`,
      },
      body: JSON.stringify({
        notes: 'Deposit transaction',
      }),
    });
    const joinData = await joinRes.json();
    assert(joinRes.status === 201 && joinData.data.tokenNumber.startsWith('B'), `POST /api/queues/:id/join (Generated token ${joinData.data?.tokenNumber})`);

    // 12. Duplicate Join in same queue
    const dupJoinRes = await fetch(`${BASE_URL}/queues/${bankQueue.id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newAuthToken}`,
      },
      body: JSON.stringify({ notes: 'Second try' }),
    });
    assert(dupJoinRes.status === 409, 'POST /api/queues/:id/join (Duplicate join prevented with 409)');

    // 13. Leave Queue
    const leaveRes = await fetch(`${BASE_URL}/queues/${bankQueue.id}/leave`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${newAuthToken}` },
    });
    const leaveData = await leaveRes.json();
    assert(leaveRes.status === 200 && leaveData.success === true, 'DELETE /api/queues/:id/leave (Leaves queue and marks Cancelled)');

    // 14. Staff Calling Console: Call Next
    const hospQueue = queuesData.data.find(q => q.codePrefix === 'A');
    const callNextRes = await fetch(`${BASE_URL}/queues/${hospQueue.id}/call-next`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const callNextData = await callNextRes.json();
    assert(callNextRes.status === 200 && callNextData.data.currentServing === 'A36', 'POST /api/queues/:id/call-next (Advances to A36)');

    // 15. Staff Upcoming Entries
    const entriesRes = await fetch(`${BASE_URL}/queues/${firstQueue.id}/entries`);
    const entriesData = await entriesRes.json();
    assert(entriesRes.status === 200 && Array.isArray(entriesData.data), 'GET /api/queues/:id/entries (Returns upcoming list)');

    // 16. Staff Toggle Pause
    const pauseRes = await fetch(`${BASE_URL}/queues/${firstQueue.id}/toggle-pause`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const pauseData = await pauseRes.json();
    assert(pauseRes.status === 200 && pauseData.data.status === 'Paused', 'PUT /api/queues/:id/toggle-pause (Pauses queue)');

    // Resume it back
    await fetch(`${BASE_URL}/queues/${firstQueue.id}/toggle-pause`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authToken}` },
    });

    // 17. Admin Overview
    const adminRes = await fetch(`${BASE_URL}/admin/overview`);
    const adminData = await adminRes.json();
    assert(adminRes.status === 200 && typeof adminData.data.activeQueues === 'number', 'GET /api/admin/overview (Returns system overview statistics)');

    // 18. Admin Users
    const adminUsersRes = await fetch(`${BASE_URL}/admin/users`);
    const adminUsersData = await adminUsersRes.json();
    assert(adminUsersRes.status === 200 && Array.isArray(adminUsersData.data) && adminUsersData.count >= 4, 'GET /api/admin/users (Returns registered users list)');

    console.log(`\n=== API TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
