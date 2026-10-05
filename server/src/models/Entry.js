import mongoose from 'mongoose';

// Schema representing a user's digital entry / token in a queue
const entrySchema = new mongoose.Schema(
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
entrySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

entrySchema.set('toJSON', {
  virtuals: true,
});

// Explicitly bind to 'queueentries' collection in MongoDB for data persistence
export const Entry = mongoose.model('Entry', entrySchema, 'queueentries');
export const QueueEntry = Entry; // Backwards-compatibility alias
export default Entry;
