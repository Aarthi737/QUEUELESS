export const initialUserQueue = {
  id: 'token-a42',
  tokenNumber: 'A42',
  tokenIndex: 42,
  serviceId: 'hosp-1',
  serviceName: 'CityCare Hospital',
  department: 'General Consultation',
  category: 'Healthcare',
  location: 'Main Block, 1st Floor, OPD Room 4',
  counterNumber: 'OPD Desk 4',
  status: 'Waiting', // 'Waiting' | 'Now Serving' | 'Completed' | 'Cancelled'
  issuedAt: 'Today, 09:15 AM',
  peopleAhead: 7,
  estimatedWait: 21, // 21 minutes
  currentServing: 'A35',
  notes: 'Routine primary health evaluation',
};

export const initialQueueHistory = [
  {
    id: 'hist-1',
    tokenNumber: 'A31',
    serviceName: 'CityCare Hospital',
    department: 'General Consultation',
    category: 'Healthcare',
    status: 'Completed',
    date: 'Today, 10:30 AM',
    counter: 'OPD Desk 4',
    waitTime: '18 min',
  },
  {
    id: 'hist-2',
    tokenNumber: 'B18',
    serviceName: 'City Bank',
    department: 'Cash Counter',
    category: 'Banking',
    status: 'Completed',
    date: 'Yesterday, 2:15 PM',
    counter: 'Counter 2',
    waitTime: '12 min',
  },
  {
    id: 'hist-3',
    tokenNumber: 'G40',
    serviceName: 'Civic Service Center',
    department: 'Driving License',
    category: 'Government',
    status: 'Cancelled',
    date: '3 days ago, 11:20 AM',
    counter: 'Counter A',
    waitTime: 'Cancelled by user',
  },
  {
    id: 'hist-4',
    tokenNumber: 'U04',
    serviceName: 'Metro University',
    department: 'Registrar Office',
    category: 'College',
    status: 'Completed',
    date: '5 days ago, 3:45 PM',
    counter: 'Desk 102',
    waitTime: '9 min',
  },
];

// Helper to generate upcoming mock queue tokens for a service
export const generateUpcomingTokens = (prefix, currentNumber, count = 10) => {
  const list = [];
  for (let i = 0; i <= count; i++) {
    const num = currentNumber + i;
    const token = `${prefix}${num < 10 ? '0' + num : num}`;
    list.push({
      token,
      number: num,
      status: i === 0 ? 'Now Serving' : 'Waiting',
      waitTime: i * 3,
    });
  }
  return list;
};
