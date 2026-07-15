import mongoose from 'mongoose';

/**
 * Application Model - Job application tracking
 * Tracks the complete application lifecycle from submission to result
 */
const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn', 'offer-letter'],
    default: 'applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  resume: {
    url: String,
    publicId: String,
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  currentRound: {
    type: Number,
    default: 0,
  },
  interviewSchedule: {
    date: Date,
    time: String,
    venue: String,
    mode: { type: String, enum: ['online', 'offline'] },
    link: String,
    instructions: String,
  },
  recruiterNotes: {
    type: String,
    trim: true,
  },
  offerLetter: {
    url: String,
    publicId: String,
    package: Number,
    joiningDate: Date,
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: String,
  }],
}, {
  timestamps: true,
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, student: 1 }, { unique: true });
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
