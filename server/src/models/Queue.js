import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a service/facility name'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide a department name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Healthcare', 'Banking', 'College', 'Government', 'Services'],
      default: 'Services',
    },
    codePrefix: {
      type: String,
      required: [true, 'Please provide a token prefix code (e.g. A, B, U)'],
      uppercase: true,
      trim: true,
      maxlength: 3,
    },
    currentServing: {
      type: String,
      default: 'A00',
    },
    currentNumber: {
      type: Number,
      default: 0,
    },
    peopleWaiting: {
      type: Number,
      default: 0,
    },
    avgWaitPerPerson: {
      type: Number,
      default: 3, // in minutes
    },
    estimatedWait: {
      type: Number,
      default: 0, // in minutes
    },
    location: {
      type: String,
      default: 'Main Counter Area',
      trim: true,
    },
    operatingHours: {
      type: String,
      default: '09:00 AM - 05:00 PM',
      trim: true,
    },
    counterNumber: {
      type: String,
      default: 'Counter 1',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Closed'],
      default: 'Active',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for frontend id compatibility
queueSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

queueSchema.set('toJSON', {
  virtuals: true,
});

export const Queue = mongoose.model('Queue', queueSchema);
