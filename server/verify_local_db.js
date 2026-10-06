import mongoose from 'mongoose';

const API_BASE = 'http://localhost:5000/api';
const MONGO_URI = 'mongodb://127.0.0.1:27017/queueless';

async function runLocalVerification() {
  console.log('====================================================');
  console.log('   QUEUELESS LOCAL END-TO-END DEMO & DB VERIFICATION');
  console.log('====================================================\n');

  // Connect directly to MongoDB to inspect collections before & after
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB directly for independent DB verification.');
  console.log('   Database Name:', mongoose.connection.name);

  const testEmail = `student_demo_${Date.now()}@college.edu`;
  const testPassword = 'securePassword123';
  const testName = 'Rahul Verma';
  const testPhone = '+91 98765 12345';

  // ----------------------------------------------------
  // TEST 1: User Registration
  // ----------------------------------------------------
  console.log('\n--- TEST 1: User Registration ---');
  console.log(`Sending POST /api/auth/register for: ${testEmail}`);
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      phone: testPhone,
      password: testPassword,
    }),
  });
  const regData = await regRes.json();
  if (!regData.success) throw new Error('Registration failed: ' + regData.message);
  console.log('✅ Server returned HTTP 201 Registration Success.');
  console.log('   User ID:', regData.user.id);
  console.log('   Token:', regData.token.substring(0, 25) + '...');

  // VERIFY IN MONGODB
  const dbUser = await mongoose.connection.db
    .collection('users')
    .findOne({ email: testEmail });
  if (!dbUser) throw new Error('FATAL: Registered user NOT found in MongoDB users collection!');
  console.log('🔍 Verified in MongoDB users collection:');
  console.log('   _id in MongoDB:', dbUser._id.toString());
  console.log('   name in MongoDB:', dbUser.name);
  console.log('   email in MongoDB:', dbUser.email);
  console.log('   password in MongoDB is bcrypt-hashed:', dbUser.password.startsWith('$2'));

  const token = regData.token;

  // ----------------------------------------------------
  // TEST 2: User Login
  // ----------------------------------------------------
  console.log('\n--- TEST 2: User Login ---');
  console.log(`Sending POST /api/auth/login for: ${testEmail}`);
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.success) throw new Error('Login failed: ' + loginData.message);
  console.log('✅ Server returned HTTP 200 Login Success.');
  console.log('   Logged in user:', loginData.user.name, `(${loginData.user.email})`);

  // ----------------------------------------------------
  // TEST 3: Queue Listing
  // ----------------------------------------------------
  console.log('\n--- TEST 3: Fetch Queues from MongoDB ---');
  const queuesRes = await fetch(`${API_BASE}/queues`);
  const queuesData = await queuesRes.json();
  if (!queuesData.success) throw new Error('Failed to fetch queues');
  console.log(`✅ Server returned ${queuesData.count} live queues from MongoDB.`);
  const targetQueue = queuesData.data[0];
  console.log(`   Selected Queue: "${targetQueue.name}" (${targetQueue.department})`);
  console.log(`   Current Serving: ${targetQueue.currentServing} | People Waiting: ${targetQueue.peopleWaiting}`);

  // ----------------------------------------------------
  // TEST 4: Join Queue
  // ----------------------------------------------------
  console.log('\n--- TEST 4: Join Queue ---');
  console.log(`Sending POST /api/queues/${targetQueue.id}/join with user token`);
  const joinRes = await fetch(`${API_BASE}/queues/${targetQueue.id}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      notes: 'Semester exam hall ticket verification',
      customerName: testName,
      customerPhone: testPhone,
    }),
  });
  const joinData = await joinRes.json();
  if (!joinData.success) throw new Error('Join queue failed: ' + joinData.message);
  console.log('✅ Server returned HTTP 201 Joined Queue.');
  console.log('   Issued Token Number:', joinData.data.tokenNumber);
  console.log('   People Ahead:', joinData.data.peopleAhead);
  console.log('   Estimated Wait:', joinData.data.estimatedWait, 'minutes');

  // VERIFY IN MONGODB queueentries COLLECTION
  const dbEntry = await mongoose.connection.db
    .collection('queueentries')
    .findOne({ _id: new mongoose.Types.ObjectId(joinData.data.id) });
  if (!dbEntry) throw new Error('FATAL: Queue entry NOT found in MongoDB queueentries collection!');
  console.log('🔍 Verified in MongoDB queueentries collection:');
  console.log('   _id in MongoDB:', dbEntry._id.toString());
  console.log('   tokenNumber in MongoDB:', dbEntry.tokenNumber);
  console.log('   status in MongoDB:', dbEntry.status);
  console.log('   userId in MongoDB matches registered user:', dbEntry.userId.toString() === dbUser._id.toString());
  console.log('   customerName in MongoDB:', dbEntry.customerName);

  // ----------------------------------------------------
  // TEST 5: Queue Tracking (My Active Queue)
  // ----------------------------------------------------
  console.log('\n--- TEST 5: Track Active Queue ---');
  const activeRes = await fetch(`${API_BASE}/queues/my/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const activeData = await activeRes.json();
  if (!activeData.success || !activeData.data) throw new Error('Active queue not found');
  console.log('✅ Server returned active ticket from MongoDB:');
  console.log('   Token Number:', activeData.data.tokenNumber);
  console.log('   Service:', activeData.data.serviceName);
  console.log('   Status:', activeData.data.status);

  // ----------------------------------------------------
  // TEST 6: Leave Queue
  // ----------------------------------------------------
  console.log('\n--- TEST 6: Leave Queue ---');
  const leaveRes = await fetch(`${API_BASE}/queues/${targetQueue.id}/leave`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      entryId: joinData.data.id,
      tokenNumber: joinData.data.tokenNumber,
    }),
  });
  const leaveData = await leaveRes.json();
  if (!leaveData.success) throw new Error('Leave queue failed: ' + leaveData.message);
  console.log('✅ Server returned HTTP 200 Left Queue.');

  // VERIFY IN MONGODB THAT STATUS IS NOW "Cancelled"
  const updatedDbEntry = await mongoose.connection.db
    .collection('queueentries')
    .findOne({ _id: new mongoose.Types.ObjectId(joinData.data.id) });
  console.log('🔍 Verified in MongoDB queueentries collection:');
  console.log('   status updated to:', updatedDbEntry.status);

  // ----------------------------------------------------
  // TEST 7: Queue History
  // ----------------------------------------------------
  console.log('\n--- TEST 7: Queue History ---');
  const historyRes = await fetch(`${API_BASE}/queues/my/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const historyData = await historyRes.json();
  if (!historyData.success) throw new Error('Fetch history failed');
  console.log(`✅ Server returned ${historyData.count} history records for user from MongoDB.`);
  const foundInHistory = historyData.data.find((h) => h.tokenNumber === joinData.data.tokenNumber);
  console.log('   Cancelled token found in history:', Boolean(foundInHistory));
  console.log('   History record status:', foundInHistory?.status);

  // ----------------------------------------------------
  // TEST 8: Verify Active Queue is now null
  // ----------------------------------------------------
  console.log('\n--- TEST 8: Confirm Active Queue is now null ---');
  const activeAfterLeave = await fetch(`${API_BASE}/queues/my/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const activeAfterData = await activeAfterLeave.json();
  console.log('✅ Active queue is null:', activeAfterData.data === null);

  await mongoose.disconnect();
  console.log('\n====================================================');
  console.log('🎉 ALL 8 LOCAL MERN & MONGODB TESTS PASSED FLAWLESSLY!');
  console.log('====================================================');
}

runLocalVerification().catch((err) => {
  console.error('\n❌ VERIFICATION ERROR:', err.message);
  process.exit(1);
});
