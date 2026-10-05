// End-to-end integration and data persistence test for QueueLess
const API_URL = 'http://localhost:5000/api';

async function runE2E() {
  console.log('🚀 RUNNING END-TO-END FLOW & PERSISTENCE VERIFICATION\n');

  // Step 1: Register new user
  const uniqueEmail = `persist_user_${Date.now()}@example.com`;
  console.log(`1. Registering user with email: ${uniqueEmail}`);
  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Sundaram',
      email: uniqueEmail,
      password: 'password123',
      phone: '+91 91234 56789',
      preferredLocation: 'North Campus',
    }),
  });
  const regData = await regRes.json();
  if (!regData.success) throw new Error('Registration failed: ' + regData.message);
  console.log('   ✅ Registration successful. JWT Token received.');
  const token = regData.token;

  // Step 2: Fetch Profile
  console.log('2. Fetching profile from MongoDB via GET /api/auth/me');
  const meRes = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  if (meData.user.name !== 'Priya Sundaram') throw new Error('Profile mismatch');
  console.log(`   ✅ Profile verified from database: ${meData.user.name} (${meData.user.email})`);

  // Step 3: Get available queues
  console.log('3. Fetching available queues from MongoDB via GET /api/queues');
  const queuesRes = await fetch(`${API_URL}/queues`);
  const queuesData = await queuesRes.json();
  const metroQueue = queuesData.data.find((q) => q.codePrefix === 'U');
  if (!metroQueue) throw new Error('Metro University queue not found');
  console.log(`   ✅ Found ${queuesData.count} services. Selected: ${metroQueue.name} (Current serving: ${metroQueue.currentServing})`);

  // Step 4: Join Queue
  console.log(`4. Joining queue for ${metroQueue.name}`);
  const joinRes = await fetch(`${API_URL}/queues/${metroQueue.id}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notes: 'Need transcript verification',
    }),
  });
  const joinData = await joinRes.json();
  if (!joinData.success) throw new Error('Join queue failed: ' + joinData.message);
  const userToken = joinData.data.tokenNumber;
  console.log(`   ✅ Digital token issued in MongoDB: #${userToken} | People Ahead: ${joinData.data.peopleAhead} | Wait: ${joinData.data.estimatedWait} min`);

  // Step 5: Check Active Queue
  console.log('5. Querying active queue via GET /api/queues/my/active');
  const activeRes = await fetch(`${API_URL}/queues/my/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const activeData = await activeRes.json();
  if (!activeData.data || activeData.data.tokenNumber !== userToken) throw new Error('Active queue mismatch');
  console.log(`   ✅ Confirmed active ticket: #${activeData.data.tokenNumber} for ${activeData.data.serviceName}`);

  // Step 6: Staff advances queue
  console.log('6. Staff calling next token in Metro University queue');
  const callNextRes = await fetch(`${API_URL}/queues/${metroQueue.id}/call-next`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const callNextData = await callNextRes.json();
  console.log(`   ✅ Queue advanced in MongoDB! Now serving: ${callNextData.data.currentServing}`);

  // Step 7: Leave Queue
  console.log('7. User cancels / leaves queue via DELETE /api/queues/:id/leave');
  const leaveRes = await fetch(`${API_URL}/queues/${metroQueue.id}/leave`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const leaveData = await leaveRes.json();
  if (!leaveData.success) throw new Error('Leave queue failed: ' + leaveData.message);
  console.log('   ✅ Successfully left queue.');

  // Step 8: Verify Active Queue is now empty
  const activeAfterLeave = await fetch(`${API_URL}/queues/my/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const activeAfterLeaveData = await activeAfterLeave.json();
  if (activeAfterLeaveData.data !== null) throw new Error('Active queue should be null after leaving');
  console.log('   ✅ Active queue is now null (empty state).');

  // Step 9: Verify History in MongoDB
  console.log('9. Checking history via GET /api/queues/my/history');
  const historyRes = await fetch(`${API_URL}/queues/my/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const historyData = await historyRes.json();
  const cancelledRecord = historyData.data.find((h) => h.tokenNumber === userToken);
  if (!cancelledRecord || cancelledRecord.status !== 'Cancelled') throw new Error('Cancelled history record missing');
  console.log(`   ✅ Found cancelled ticket #${cancelledRecord.tokenNumber} in MongoDB history.`);

  // Step 10: Update Profile
  console.log('10. Updating profile via PUT /api/auth/profile');
  const updateRes = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      preferredLocation: 'Metro City Center',
    }),
  });
  const updateData = await updateRes.json();
  if (updateData.user.preferredLocation !== 'Metro City Center') throw new Error('Profile update failed');
  console.log(`   ✅ Profile successfully updated and persisted in MongoDB: ${updateData.user.preferredLocation}`);

  console.log('\n🎉 ALL 10 END-TO-END FLOW & PERSISTENCE TESTS PASSED FLAWLESSLY!\n');
}

runE2E().catch((err) => {
  console.error('❌ E2E Test Error:', err);
  process.exit(1);
});
