import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Queue } from '../models/Queue.js';
import { QueueEntry } from '../models/QueueEntry.js';

export const seedDatabase = async () => {
  try {
    console.log('Seeding database with initial QueueLess records...');

    // Clear existing collections
    await User.deleteMany({});
    await Queue.deleteMany({});
    await QueueEntry.deleteMany({});

    // 1. Create Users
    const customerUser = await User.create({
      name: 'Aarthi Sharma',
      email: 'aarthi.sharma@example.com',
      password: 'password123',
      phone: '+91 98765 43210',
      preferredLocation: 'Central City, Metro Region',
      role: 'customer',
      avatar: 'AS',
    });

    const staffUser = await User.create({
      name: 'Dr. Rajesh Kumar',
      email: 'r.kumar@citycare.org',
      password: 'password123',
      phone: '+91 98111 22334',
      preferredLocation: 'CityCare Hospital OPD',
      role: 'staff',
      avatar: 'RK',
    });

    const adminUser = await User.create({
      name: 'Vikram Mehta',
      email: 'admin@queueless.io',
      password: 'password123',
      phone: '+91 98222 33445',
      preferredLocation: 'Central HQ Operations',
      role: 'admin',
      avatar: 'VM',
    });

    // 2. Create Services / Queues
    const hospitalQueue = await Queue.create({
      name: 'CityCare Hospital',
      department: 'General Consultation',
      category: 'Healthcare',
      codePrefix: 'A',
      currentServing: 'A35',
      currentNumber: 35,
      peopleWaiting: 12,
      avgWaitPerPerson: 3,
      estimatedWait: 36,
      location: 'Main Block, 1st Floor, OPD Room 4',
      operatingHours: '08:00 AM - 05:00 PM',
      status: 'Active',
      description: 'General health checkups, vitals evaluation, and medical consultations with senior physicians.',
      counterNumber: 'OPD Desk 4',
    });

    staffUser.assignedServiceId = hospitalQueue._id;
    await staffUser.save();

    const bankQueue = await Queue.create({
      name: 'City Bank',
      department: 'Cash & Teller Counter',
      category: 'Banking',
      codePrefix: 'B',
      currentServing: 'B18',
      currentNumber: 18,
      peopleWaiting: 8,
      avgWaitPerPerson: 3,
      estimatedWait: 24,
      location: 'Central Plaza Branch, Counter 2',
      operatingHours: '09:30 AM - 04:30 PM',
      status: 'Active',
      description: 'Cash deposits, cheque withdrawals, DD creation, and foreign currency counter assistance.',
      counterNumber: 'Counter 2',
    });

    const uniQueue = await Queue.create({
      name: 'Metro University',
      department: 'Registrar & Admissions',
      category: 'College',
      codePrefix: 'U',
      currentServing: 'U09',
      currentNumber: 9,
      peopleWaiting: 5,
      avgWaitPerPerson: 3,
      estimatedWait: 15,
      location: 'Administrative Wing, Room 102',
      operatingHours: '09:00 AM - 04:00 PM',
      status: 'Active',
      description: 'Degree transcripts, bonafide certificates, course enrollment approvals, and student ID services.',
      counterNumber: 'Desk 102',
    });

    const govtQueue = await Queue.create({
      name: 'Civic Service Center',
      department: 'Driving License & IDs',
      category: 'Government',
      codePrefix: 'G',
      currentServing: 'G44',
      currentNumber: 44,
      peopleWaiting: 14,
      avgWaitPerPerson: 3,
      estimatedWait: 42,
      location: 'District Center, Hall B, Counter A',
      operatingHours: '09:00 AM - 05:00 PM',
      status: 'Active',
      description: 'Driving license renewals, biometric verification, voter card corrections, and notarized affidavits.',
      counterNumber: 'Counter A',
    });

    const diagQueue = await Queue.create({
      name: 'Apex Diagnostics',
      department: 'Blood Test & Pathology Lab',
      category: 'Healthcare',
      codePrefix: 'L',
      currentServing: 'L12',
      currentNumber: 12,
      peopleWaiting: 6,
      avgWaitPerPerson: 3,
      estimatedWait: 18,
      location: 'MedTower Annex, 2nd Floor, Lab 2',
      operatingHours: '07:00 AM - 02:00 PM',
      status: 'Active',
      description: 'Routine blood profiles, fasting blood sugar, lipid panels, pathology sample collections.',
      counterNumber: 'Lab Station 2',
    });

    const teleQueue = await Queue.create({
      name: 'Telecom Express',
      department: 'Customer Service & SIM Desk',
      category: 'Services',
      codePrefix: 'T',
      currentServing: 'T21',
      currentNumber: 21,
      peopleWaiting: 4,
      avgWaitPerPerson: 3,
      estimatedWait: 12,
      location: 'Orion Galleria, Level 1, Desk 1',
      operatingHours: '10:00 AM - 08:00 PM',
      status: 'Active',
      description: 'Instant eSIM activation, postpaid bill disputes, roaming plans, and device broadband support.',
      counterNumber: 'Desk 1',
    });

    // 3. Create active queue entry for customer Aarthi (# A42)
    // Create intervening entries between A36 and A41 so peopleAhead equals 7
    for (let i = 36; i <= 41; i++) {
      await QueueEntry.create({
        queueId: hospitalQueue._id,
        customerName: `Patient ${i}`,
        customerPhone: `+91 98000 ${10000 + i}`,
        tokenNumber: `A${i}`,
        tokenIndex: i,
        status: 'Waiting',
        notes: 'Consultation ticket',
        joinedAt: new Date(Date.now() - (42 - i) * 180000),
      });
    }

    // Aarthi's entry: A42
    await QueueEntry.create({
      queueId: hospitalQueue._id,
      userId: customerUser._id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      tokenNumber: 'A42',
      tokenIndex: 42,
      status: 'Waiting',
      notes: 'Routine primary health evaluation',
      joinedAt: new Date(Date.now() - 15 * 60000),
    });

    // 4. Create History Entries for customer Aarthi
    await QueueEntry.create({
      queueId: hospitalQueue._id,
      userId: customerUser._id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      tokenNumber: 'A31',
      tokenIndex: 31,
      status: 'Completed',
      notes: 'General Consultation',
      joinedAt: new Date(Date.now() - 2 * 3600000),
      servedAt: new Date(Date.now() - 1.8 * 3600000),
      completedAt: new Date(Date.now() - 1.5 * 3600000),
    });

    await QueueEntry.create({
      queueId: bankQueue._id,
      userId: customerUser._id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      tokenNumber: 'B18',
      tokenIndex: 18,
      status: 'Completed',
      notes: 'Cash Counter deposit',
      joinedAt: new Date(Date.now() - 24 * 3600000),
      servedAt: new Date(Date.now() - 23.8 * 3600000),
      completedAt: new Date(Date.now() - 23.5 * 3600000),
    });

    await QueueEntry.create({
      queueId: govtQueue._id,
      userId: customerUser._id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      tokenNumber: 'G40',
      tokenIndex: 40,
      status: 'Cancelled',
      notes: 'Driving license renewal',
      joinedAt: new Date(Date.now() - 72 * 3600000),
      completedAt: new Date(Date.now() - 71.9 * 3600000),
    });

    await QueueEntry.create({
      queueId: uniQueue._id,
      userId: customerUser._id,
      customerName: customerUser.name,
      customerPhone: customerUser.phone,
      tokenNumber: 'U04',
      tokenIndex: 4,
      status: 'Completed',
      notes: 'Transcript issuance',
      joinedAt: new Date(Date.now() - 120 * 3600000),
      servedAt: new Date(Date.now() - 119.8 * 3600000),
      completedAt: new Date(Date.now() - 119.5 * 3600000),
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
