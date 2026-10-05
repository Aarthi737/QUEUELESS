import mongoose from 'mongoose';

const queueEntrySchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: [true, 'Queue ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    tokenNumber: {
      type: String,
      required: [true, 'Token number is required'],
      trim: true,
      uppercase: true,
    },
    tokenIndex: {
      type: Number,
      required: [true, 'Token sequence index is required'],
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Waiting', 'Now Serving', 'Completed', 'Cancelled', 'Skipped'],
      default: 'Waiting',
      index: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    servedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for frontend id compatibility
queueEntrySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

queueEntrySchema.set('toJSON', {
  virtuals: true,
});

export const QueueEntry = mongoose.model('QueueEntry', queueEntrySchema);
